import { NextResponse } from "next/server";
import { getCartContext } from "@/lib/cartContext";

const CART_QUERY = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      lines(first: 100) {
        edges {
          node {
            id
            quantity
          }
        }
      }
    }
  }
`;

export async function POST() {
  try {
    // ✅ 1) Get the "effective" cart id:
    //    - guest → from cookie
    //    - logged in → from user.savedCartId (or adopted from cookie)
const { cartId } = await getCartContext({ allowCookieWrite: true });
    if (!cartId) {
      return NextResponse.json({ cart: null });
    }

    // ✅ 2) Call Shopify Storefront API with that cart id
    const response = await fetch(
      `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token":
            process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        },
        body: JSON.stringify({
          query: CART_QUERY,
          variables: { cartId },
        }),
      }
    );

    const data = await response.json();

    if (data.errors) {
      console.error("Shopify cart fetch error:", data.errors);
      return NextResponse.json({ cart: null });
    }

    // ✅ 3) Return the cart so your header can compute the count
    return NextResponse.json({ cart: data.data.cart });
  } catch (error) {
    console.error("Cart count error:", error);
    return NextResponse.json({ cart: null }, { status: 500 });
  }
}