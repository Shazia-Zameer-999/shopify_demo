import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { email, username, password } = body;

    if (!email || !username || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message:
            existing.email === email
              ? "Email is already in use."
              : "Username is already taken.",
        },
        { status: 400 }
      );
    }

    const passwordHash = await hash(password, 10);

    const user = await User.create({
      email,
      username,
      passwordHash,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        userId: user._id.toString(),
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Try again later." },
      { status: 500 }
    );
  }
}