import { NextResponse } from "next/server";

const SEARCH_QUERY = `
  query ProductsSearch($query: String!) {
    products(first: 10, query: $query) {
      edges {
        node {
          id
          title
          handle
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ products: [] });
  }

  try {
    const URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;

    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: SEARCH_QUERY,
        variables: { query }  
      }),
    });

    const data = await response.json();

    
    if (data.errors) {
      console.error("Shopify GraphQL error:", data.errors);
      return NextResponse.json({ products: [] });
    }

    const products = data.data?.products?.edges?.map(e => e.node) || [];
    
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}