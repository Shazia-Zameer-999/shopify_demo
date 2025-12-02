// lib/cartContext.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCartIdServer, setCartIdServer } from "@/utils/storage.server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";

export async function getCartContext(options = {}) {
  const { allowCookieWrite = false } = options;

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || null;

  // One cookie read only
  const cookieCartId = await getCartIdServer(); // null or "gid://shopify/Cart/..."
  let source = "none";

  // -------- GUEST USER --------
  if (!userId) {
    const cartId = cookieCartId || null;
    // For guests we normally don't need to re-set the cookie,
    // but this keeps the pattern consistent:
    if (allowCookieWrite && cartId) {
      await setCartIdServer(cartId);
    }

    return {
      userId: null,
      cartId,
      source: cartId ? "guest-cookie" : "none",
    };
  }

  // -------- AUTHENTICATED USER --------
  await connectToDatabase();
  const user = await User.findById(userId);

  if (!user) {
    // Fallback: behave like guest but keep userId for debugging
    const cartId = cookieCartId || null;
    if (allowCookieWrite && cartId) {
      await setCartIdServer(cartId);
    }
    return {
      userId,
      cartId,
      source: cartId ? "guest-cookie" : "none",
    };
  }

  const savedCartId = user.savedCartId || null;
  let finalCartId = null;

  if (savedCartId) {
    // 1) User already has a saved cart → use it
    finalCartId = savedCartId;
    source = "user-saved";
  } else if (cookieCartId) {
    // 2) No saved cart, but cookie cart exists → adopt it
    finalCartId = cookieCartId;
    source = "guest-adopted";
    user.savedCartId = cookieCartId;
    await user.save();
  } else {
    // 3) No saved cart and no cookie → no cart yet
    finalCartId = null;
    source = "none";
  }

  // Only write cookie in routes/actions that explicitly allow it
  if (allowCookieWrite && finalCartId) {
    await setCartIdServer(finalCartId);
  }

  return {
    userId,
    cartId: finalCartId,
    source,
  };
}