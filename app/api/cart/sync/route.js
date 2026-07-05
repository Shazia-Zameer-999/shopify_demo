import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import { setCartIdServer } from "@/utils/storage.server";

export const dynamic = "force-dynamic";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const body = await req.json();
        const cartId = body?.cartId;

        if (!cartId || typeof cartId !== "string") {
            return NextResponse.json({ error: "Invalid cart id" }, { status: 400 });
        }

        await connectToDatabase();

        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        user.savedCartId = cartId;
        await user.save();

        await setCartIdServer(cartId);

        return NextResponse.json({ ok: true, cartId }, { status: 200 });
    } catch (error) {
        console.error("Cart sync error:", error);
        return NextResponse.json(
            { error: "Failed to sync cart" },
            { status: 500 },
        );
    }
}