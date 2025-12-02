import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";  // ⬅ change this
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        // Guest users return nothing — frontend uses localStorage instead
        if (!session?.user?.email) {
            return NextResponse.json(
                {
                    isAuthenticated: false,
                    count: 0,
                },
                { status: 200 }
            );
        }

        await connectToDatabase();
        const user = await User.findOne({ email: session.user.email });

        const count = user?.wishlist?.length || 0;

        return NextResponse.json(
            {
                isAuthenticated: true,
                count,
            },
            { status: 200 }
        );

    } catch (err) {
        console.error("Wishlist COUNT error:", err);
        return NextResponse.json(
            { error: "Failed to fetch wishlist count" },
            { status: 500 }
        );
    }
}