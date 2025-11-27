import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";

const SEARCH_QUERY = `
  query ProductsSearch($query: String!, $first: Int!) {
    products(first: $first, query: $query, sortKey: RELEVANCE) {
      edges {
        node {
          id
          title
          handle
          vendor
          productType
          tags
          availableForSale
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
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

async function searchProducts(query, limit = 24) {
  const URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;

  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token":
        process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query: SEARCH_QUERY,
      variables: { query, first: limit },
    }),
    cache: "no-store",
  });

  const data = await response.json();
  return data.data?.products?.edges || [];
}

export default async function SearchPage({ searchParams }) {
  let theme = "dark";
  try {
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie") || "";
    const themeMatch = cookieHeader.match(/theme=([^;]+)/);
    if (themeMatch && (themeMatch[1] === "light" || themeMatch[1] === "dark")) {
      theme = themeMatch[1];
    }
  } catch (e) {
    console.log("Could not read theme cookie, using default");
  }

  const isDark = theme === "dark";



  // Theme-aware styles
  const pageBg = isDark
    ? "bg-slate-950 text-slate-50"
    : "bg-slate-50 text-slate-900";
  const cardBg = isDark
    ? "bg-slate-900 border-slate-800"
    : "bg-white border-slate-200";
  const cardHover = isDark
    ? "hover:border-slate-700 hover:shadow-2xl hover:shadow-slate-950/80"
    : "hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60";
  const textMuted = isDark ? "text-slate-400" : "text-slate-600";
  const textAccent = isDark ? "text-sky-400" : "text-sky-600";
  const badge = isDark
    ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
    : "bg-emerald-50 text-emerald-700 border-emerald-200";
  const saleBadge = isDark
    ? "bg-red-500/20 text-red-300 border-red-400/30"
    : "bg-red-50 text-red-600 border-red-200";
  const btnPrimary = isDark
    ? "bg-sky-500 text-slate-950 hover:bg-sky-400 shadow-sky-500/50"
    : "bg-sky-600 text-white hover:bg-sky-500 shadow-sky-600/40";

      // Get the search query from URL (?q=snowboard)
  const params = await searchParams;
  const query = params?.q || "";

  const products = query ? await searchProducts(query) : [];

  // Calculate discount percentage helper
  function getDiscount(product) {
    const current = parseFloat(product.priceRange.minVariantPrice.amount);
    const compare = parseFloat(
      product.compareAtPriceRange?.minVariantPrice?.amount || 0,
    );
    if (compare > current) {
      return Math.round(((compare - current) / compare) * 100);
    }
    return 0;
  }

  return (
    <main className={`min-h-screen ${pageBg}`}>
      {isDark ? (
        <>
          <div className="pointer-events-none fixed inset-0 -z-20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900" />
          <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),transparent_50%)]" />
        </>
      ) : (
        <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-slate-100 via-white to-slate-100" />
      )}

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* If no search term */}
        {!query ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="mb-4 text-6xl">🔍</div>
            <h1 className="mb-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Search for Snowboards
            </h1>
            <p className={`max-w-md text-sm sm:text-base ${textMuted}`}>
              Use the search bar above to find boards, gear, and equipment.
              Try searching for "powder", "freestyle", or your favorite brand.
            </p>
            <Link
              href="/"
              className={`mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-lg transition ${btnPrimary}`}
            >
              ← Browse All Products
            </Link>
          </div>
        ) : (
          <>
            {/* Search header */}
            <header className="mb-8">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
                    Search Results
                  </p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                    "{query}"
                  </h1>
                  <p className={`mt-1 text-sm ${textMuted}`}>
                    {products.length} product{products.length !== 1 ? "s" : ""}{" "}
                    found
                  </p>
                </div>
                <Link
                  href="/"
                  className={`text-xs font-medium hover:underline sm:text-sm ${textAccent}`}
                >
                  ← Back to all products
                </Link>
              </div>
            </header>

            {/* No results */}
            {products.length === 0 ? (
              <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
                <div className="mb-4 text-5xl opacity-50">😕</div>
                <h2 className="mb-2 text-xl font-semibold sm:text-2xl">
                  No products found
                </h2>
                <p className={`mb-6 max-w-md text-sm ${textMuted}`}>
                  We couldn't find anything matching "{query}". Try a different
                  search term or browse our full collection.
                </p>
                <Link
                  href="/"
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-lg transition ${btnPrimary}`}
                >
                  ← Browse All Products
                </Link>
              </div>
            ) : (
              // Product grid
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map(({ node: product }) => {
                  const discount = getDiscount(product);
                  const isOnSale = discount > 0;
                  const price = parseFloat(
                    product.priceRange.minVariantPrice.amount,
                  );
                  const comparePrice = parseFloat(
                    product.compareAtPriceRange?.minVariantPrice?.amount || 0,
                  );
                  const currency =
                    product.priceRange.minVariantPrice.currencyCode;

                  return (
                    <Link
                      href={`/products/${product.handle}`}
                      key={product.id}
                      className="group"
                    >
                      <article
                        className={`flex h-full flex-col overflow-hidden rounded-2xl border shadow-lg transition-all duration-300 hover:-translate-y-1 ${cardBg} ${cardHover}`}
                      >
                        {/* Image container */}
                        <div className="relative aspect-square w-full overflow-hidden bg-slate-900">
                          {product.featuredImage && (
                            <Image
                              src={product.featuredImage.url}
                              alt={
                                product.featuredImage.altText || product.title
                              }
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                          )}

                          {/* Badges */}
                          <div className="absolute left-2 top-2 flex flex-col gap-1.5">
                            {!product.availableForSale && (
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${saleBadge}`}
                              >
                                Sold Out
                              </span>
                            )}
                            {isOnSale && (
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${saleBadge}`}
                              >
                                {discount}% OFF
                              </span>
                            )}
                          </div>

                          {/* Quick view overlay (on hover) */}
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/0 opacity-0 transition-all duration-300 group-hover:bg-slate-950/40 group-hover:opacity-100">
                            <span
                              className={`rounded-full px-4 py-2 text-xs font-semibold shadow-lg transition ${btnPrimary}`}
                            >
                              View Details →
                            </span>
                          </div>
                        </div>

                        {/* Product info */}
                        <div className="flex flex-1 flex-col gap-2 p-4">
                          {/* Category/vendor */}
                          {product.vendor && (
                            <p
                              className={`text-[11px] font-semibold uppercase tracking-wider ${textMuted}`}
                            >
                              {product.vendor}
                            </p>
                          )}

                          {/* Title */}
                          <h2
                            className={`line-clamp-2 text-base font-semibold leading-snug transition-colors group-hover:${textAccent}`}
                          >
                            {product.title}
                          </h2>

                          {/* Type tag */}
                          {product.productType && (
                            <span
                              className={`w-fit rounded-full border px-2 py-0.5 text-[10px] font-medium ${badge}`}
                            >
                              {product.productType}
                            </span>
                          )}

                          {/* Price */}
                          <div className="mt-auto flex items-baseline gap-2">
                            <span className="text-lg font-bold">
                              {price.toLocaleString("en-US", {
                                style: "currency",
                                currency,
                              })}
                            </span>
                            {isOnSale && (
                              <span
                                className={`text-sm line-through ${textMuted}`}
                              >
                                {comparePrice.toLocaleString("en-US", {
                                  style: "currency",
                                  currency,
                                })}
                              </span>
                            )}
                          </div>

                          {/* Availability */}
                          {product.availableForSale ? (
                            <p className="text-[11px] text-emerald-500">
                              ✓ In Stock
                            </p>
                          ) : (
                            <p className={`text-[11px] ${textMuted}`}>
                              Out of Stock
                            </p>
                          )}
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}