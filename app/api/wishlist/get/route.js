import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";

// This prevents static caching of this route
export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { wishlist: [], isAuthenticated: false },
                { status: 200 },
            );
        }

        await connectToDatabase();

        const user = await User.findById(session.user.id).lean();

        const wishlist = user?.wishlist || [];

        return NextResponse.json(
            {
                wishlist,
                isAuthenticated: true,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Wishlist GET error:", error);
        return NextResponse.json(
            { error: "Failed to fetch wishlist", wishlist: [] },
            { status: 500 },
        );
    }
}