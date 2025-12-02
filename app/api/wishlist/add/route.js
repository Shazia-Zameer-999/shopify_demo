import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    // Guest users → handled by localStorage
    if (!session?.user?.email) {
      return NextResponse.json(
        { isAuthenticated: false },
        { status: 200 }
      );
    }

    const body = await req.json();
    const { id, title, handle, image, variantId, price } = body;

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Prevent duplicates
    const alreadyExists = user.wishlist.find(
      (item) => item.id === id || item.variantId === variantId
    );

    if (!alreadyExists) {
      user.wishlist.push({
        id,
        title,
        handle,
        image,
        variantId,
        price,
      });
      await user.save();
    }

    return NextResponse.json(
      {
        wishlist: user.wishlist,
        isAuthenticated: true,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Wishlist ADD error:", error);
    return NextResponse.json(
      { error: "Failed to add to wishlist" },
      { status: 500 }
    );
  }
}