// app/api/test-db/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";

export async function GET() {
  await connectToDatabase();

  const count = await User.countDocuments().catch(() => 0);

  return NextResponse.json({ ok: true, users: count });
}