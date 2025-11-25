import { cookies } from "next/headers";

const CART_KEY = "shopify_cart_id";

export async function getCartIdServer() {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get(CART_KEY);
  
  console.log("🍪 Server: Reading cookie:", CART_KEY);
  
  if (!cartCookie?.value) {
    console.log("🍪 Cookie value: NOT FOUND");
    return null;
  }
  
  try {
    // Decode the URI-encoded cart ID
    const decoded = decodeURIComponent(cartCookie.value);
    console.log("🍪 Cookie value (encoded):", cartCookie.value);
    console.log("🍪 Cookie value (decoded):", decoded);
    return decoded;
  } catch (e) {
    console.error("❌ Failed to decode cart ID:", e);
    return null;
  }
}

export async function setCartIdServer(cartId) {
  const cookieStore = await cookies();
  const encoded = encodeURIComponent(cartId);
  
  cookieStore.set(CART_KEY, encoded, {
    maxAge: 60 * 60 * 24 * 20,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production'
  });
}

export async function removeCartIdServer() {
  const cookieStore = await cookies();
  cookieStore.delete(CART_KEY);
}