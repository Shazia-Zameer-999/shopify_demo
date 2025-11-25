import { NextResponse } from "next/server";

// This is the GraphQL query that searches Shopify
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

// This is an API endpoint (like a backend function)
// When frontend calls /api/search?q=snowboard, this function runs
export async function GET(request) {
  // Get the search query from URL (?q=snowboard)
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  // If no search term or too short, return empty results
  if (!query || query.length < 2) {
    return NextResponse.json({ products: [] });
  }

  try {
    // Build the URL to Shopify API
    const URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;

    // Send request to Shopify
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: SEARCH_QUERY,
        variables: { query }  // Send the search term to Shopify
      }),
    });

    const data = await response.json();

    // Check if Shopify returned errors
    if (data.errors) {
      console.error("Shopify GraphQL error:", data.errors);
      return NextResponse.json({ products: [] });
    }

    // Extract products from Shopify response
    const products = data.data?.products?.edges?.map(e => e.node) || [];
    
    // Send results back to frontend
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}