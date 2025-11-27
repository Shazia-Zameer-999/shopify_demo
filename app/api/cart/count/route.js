import { NextResponse } from "next/server";

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

export async function POST(request) {
  try {
    const { cartId } = await request.json();

    if (!cartId) {
      return NextResponse.json({ cart: null });
    }

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

    return NextResponse.json({ cart: data.data.cart });
  } catch (error) {
    console.error("Cart count error:", error);
    return NextResponse.json({ cart: null }, { status: 500 });
  }
}