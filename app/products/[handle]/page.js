import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCart from "@/components/AddToCart";
import { headers } from "next/headers";
import ImageGallery from "@/components/ImageGallery";


const SINGLE_PRODUCT_QUERY = `
  query SingleProduct($handle: String!) {
    product(handle: $handle) {
      title
      descriptionHtml
      vendor
      productType
      availableForSale
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
      featuredImage {
        url
        altText
      }
      images(first: 4) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 1) {
        edges {
          node {
            id
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

function getDiscount(product) {
  const current = parseFloat(product.priceRange.minVariantPrice.amount);
  const compare = parseFloat(
    product.compareAtPriceRange?.minVariantPrice?.amount || 0
  );
  if (compare > current) {
    return Math.round(((compare - current) / compare) * 100);
  }
  return 0;
}



async function getProduct(handle) {
  const URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token":
        process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query: SINGLE_PRODUCT_QUERY,
      variables: { handle },
    }),
  };

  try {
    const response = await fetch(URL, options);
    const data = await response.json();
    return data.data.product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductPage({ params }) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    notFound();
  }

  // Read theme from cookie
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


  // Calculate discount
  const discount = getDiscount(product);
  const isOnSale = discount > 0;
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const comparePrice = parseFloat(
    product.compareAtPriceRange?.minVariantPrice?.amount || 0
  );
  const currency = product.priceRange.minVariantPrice.currencyCode;

  const isDark = theme === "dark";

  // Theme-aware styles
  const pageBg = isDark
    ? "bg-slate-950 text-slate-50"
    : "bg-slate-50 text-slate-900";

  const shellBg = isDark
    ? "bg-slate-950/80 border-slate-800/70 shadow-[0_24px_70px_rgba(15,23,42,0.95)]"
    : "bg-white border-slate-200 shadow-[0_18px_45px_rgba(15,23,42,0.08)]";

  const subText = isDark ? "text-slate-400" : "text-slate-500";
  const priceText = isDark ? "text-slate-50" : "text-slate-900";

  const stockBadge = product.availableForSale
    ? isDark
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/40"
      : "bg-emerald-50 text-emerald-700 border-emerald-200"
    : isDark
      ? "bg-red-500/15 text-red-300 border-red-400/40"
      : "bg-red-50 text-red-700 border-red-200";

  const saleBadge = isDark
    ? "bg-red-500/20 text-red-300 border-red-400/30"
    : "bg-red-50 text-red-600 border-red-200";

  return (
    <main className={`min-h-screen ${pageBg}`}>
      {/* Background gradients */}
      {isDark ? (
        <>
          <div className="pointer-events-none fixed inset-0 -z-20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900" />
          <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),transparent_55%)]" />
        </>
      ) : (
        <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-slate-100 via-white to-slate-100" />
      )}

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-8 lg:pt-14">
        {/* Breadcrumb / meta row */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-[13px]">
          <div className="flex flex-wrap items-center gap-2">
            <span className={subText}>Snowboards</span>
            <span className={subText}>/</span>
            {product.vendor && (
              <>
                <span className={subText}>{product.vendor}</span>
                <span className={subText}>/</span>
              </>
            )}
            <span className="font-medium">
              {product.title.length > 40
                ? product.title.slice(0, 40) + "…"
                : product.title}
            </span>
          </div>

          {/* Stock + Sale badges */}
          <div className="flex flex-wrap gap-2">
            {isOnSale && (
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${saleBadge}`}
              >
                🔥 {discount}% OFF
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium ${stockBadge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${product.availableForSale ? "bg-emerald-400" : "bg-red-400"}`} />
              {product.availableForSale ? "In stock · Ships in 24h" : "Out of Stock"}
            </span>
          </div>
        </div>

        {/* Main product shell */}
        <section
          className={`grid gap-10 rounded-3xl border p-5 sm:p-7 lg:grid-cols-[minmax(0,_1.2fr)_minmax(0,_1fr)] lg:gap-12 lg:p-9 ${shellBg}`}
        >
          {/* LEFT: Gallery - REPLACE ENTIRE SECTION WITH THIS: */}
          <ImageGallery
            images={product.images?.edges || []}
            featuredImage={product.featuredImage}
            productTitle={product.title}
            isDark={isDark}
          />

          {/* RIGHT: Details */}
          <div className="flex flex-col gap-6 lg:gap-7">
            {/* Vendor badge */}
            {product.vendor && (
              <div>
                <span className={`text-[11px] font-semibold uppercase tracking-wider ${subText}`}>
                  {product.vendor}
                </span>
              </div>
            )}

            {/* Title + price */}
            <div className="space-y-3">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-[2rem]">
                {product.title}
              </h1>

              <div className="flex flex-wrap items-baseline gap-3">
                <p className={`text-3xl font-bold ${priceText}`}>
                  {price.toLocaleString("en-US", {
                    style: "currency",
                    currency,
                  })}
                </p>
                {isOnSale && (
                  <p className={`text-xl line-through ${subText}`}>
                    {comparePrice.toLocaleString("en-US", {
                      style: "currency",
                      currency,
                    })}
                  </p>
                )}
                {isOnSale && (
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${saleBadge}`}>
                    Save {discount}%
                  </span>
                )}
              </div>

              <span className={`text-xs uppercase tracking-[0.2em] ${subText}`}>
                Tax included · {product.availableForSale ? "Ships in 24h" : "Currently unavailable"}
              </span>
            </div>

            {/* Selling points */}
            <div className="flex flex-wrap gap-2 text-[11px] sm:text-xs">
              {product.productType && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 ${isDark
                    ? "border-slate-700 bg-slate-900/80 text-slate-200"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                >
                  🏂 {product.productType}
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 ${isDark
                  ? "border-slate-700 bg-slate-900/80 text-slate-200"
                  : "border-slate-200 bg-slate-50 text-slate-700"
                  }`}
              >
                ⭐ Rider‑tested
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 ${isDark
                  ? "border-slate-700 bg-slate-900/80 text-slate-200"
                  : "border-slate-200 bg-slate-50 text-slate-700"
                  }`}
              >
                🚚 Free returns (30 days)
              </span>
            </div>

            {/* Description */}
            <div
              className={`prose prose-sm max-w-none ${isDark ? "prose-invert prose-slate" : "prose-slate"}`}
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />

            {/* Divider */}
            <hr className={isDark ? "border-slate-800/80" : "border-slate-200/80"} />

            {/* Add to cart block */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-[13px]">
                <div className={subText}>
                  Secure checkout with{" "}
                  <span className="font-medium">Shopify · SSL · Encrypted</span>
                </div>
                <div
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] ${product.availableForSale
                      ? isDark
                        ? "border-emerald-700 bg-emerald-900/30 text-emerald-300"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : isDark
                        ? "border-red-700 bg-red-900/30 text-red-300"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                >
                  {product.availableForSale ? "✅ Ready to ship" : "❌ Out of stock"}
                </div>
              </div>

              {/* Add to cart button */}
              <div className="mt-1">
                {product.availableForSale ? (
                  <AddToCart variantId={product.variants.edges[0].node.id} />
                ) : (
                  <button
                    disabled
                    className={`w-full rounded-full border px-6 py-3 text-sm font-semibold opacity-50 cursor-not-allowed ${isDark
                      ? "border-slate-700 bg-slate-900/80 text-slate-400"
                      : "border-slate-300 bg-slate-100 text-slate-500"
                      }`}
                  >
                    Out of Stock - Notify Me
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

