import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import {
    syncShopifyCustomerId,
    fetchOrdersForCustomer,
} from "@/lib/shopify-admin";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json(
                { success: false, message: "Not authenticated." },
                { status: 401 }
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

        // Ensure this user is linked to a Shopify customer
        // Try to link Shopify customer id if it already exists (read-only)
        const updatedUser = await syncShopifyCustomerId(user);

        const orders = await fetchOrdersForCustomer({
            shopifyCustomerId: updatedUser.shopifyCustomerId,
            email: updatedUser.email,
        });

        return NextResponse.json(
            { success: true, orders },
            { status: 200 }
        );
    } catch (err) {
        console.error("My Orders error:", err);
        return NextResponse.json(
            { success: false, message: "Failed to load orders." },
            { status: 500 }
        );
    }
}