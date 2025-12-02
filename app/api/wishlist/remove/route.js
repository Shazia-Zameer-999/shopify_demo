import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);

    // Guests → handled only in localStorage
    if (!session?.user?.email) {
      return NextResponse.json(
        { isAuthenticated: false },
        { status: 200 }
      );
    }

    const body = await req.json();
    const { id, variantId } = body;

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Remove from wishlist
    user.wishlist = user.wishlist.filter((item) => {
      return item.id !== id && item.variantId !== variantId;
    });

    await user.save();

    return NextResponse.json(
      {
        wishlist: user.wishlist,
        isAuthenticated: true,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Wishlist REMOVE error:", error);
    return NextResponse.json(
      { error: "Failed to remove from wishlist" },
      { status: 500 }
    );
  }
}