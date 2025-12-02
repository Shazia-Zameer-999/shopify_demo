// app/api/auth/[...nextauth]/route.js
import { authHandler } from "@/lib/auth";

export const GET = authHandler;
export const POST = authHandler;