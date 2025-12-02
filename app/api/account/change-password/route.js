import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import { compare, hash } from "bcryptjs";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Not authenticated." },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "New password must be at least 6 characters.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // If user already has a password, verify current one
    if (user.passwordHash) {
      if (!currentPassword) {
        return NextResponse.json(
          {
            success: false,
            message: "Current password is required.",
          },
          { status: 400 }
        );
      }

      const isValid = await compare(currentPassword, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { success: false, message: "Current password is incorrect." },
          { status: 400 }
        );
      }
    }

    // Set new password (works both as update or first-time password)
    const newHash = await hash(newPassword, 10);
    user.passwordHash = newHash;
    await user.save();

    return NextResponse.json(
      { success: true, message: "Password updated successfully." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Try again later." },
      { status: 500 }
    );
  }
}