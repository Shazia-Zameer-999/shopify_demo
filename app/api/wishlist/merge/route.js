import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { guestWishlist } = await req.json();

    if (!Array.isArray(guestWishlist)) {
      return NextResponse.json(
        { error: "Invalid wishlist format" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Merge guest wishlist → DB wishlist
    const merged = [...user.wishlist];

    guestWishlist.forEach((guestItem) => {
      const exists = merged.some(
        (item) =>
          item.id === guestItem.id ||
          item.variantId === guestItem.variantId
      );

      if (!exists) {
        merged.push(guestItem);
      }
    });

    // Save
    user.wishlist = merged;
    await user.save();

    return NextResponse.json(
      {
        wishlist: merged,
        merged: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Wishlist MERGE error:", error);
    return NextResponse.json(
      { error: "Failed to merge wishlist" },
      { status: 500 }
    );
  }
}