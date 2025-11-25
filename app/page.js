// import Image from "next/image";
// import Link from "next/link";
// import Pagination from "@/components/Pagination";
// import { headers } from "next/headers"; // ← ADD THIS


// const PRODUCTS_QUERY = `
//   query Products($first: Int, $after: String, $last: Int, $before: String) {
//     products(first: $first, after: $after, last: $last, before: $before) {
//       edges {
//         cursor
//         node {
//           id
//           title
//           handle
//           featuredImage {
//             url
//             altText
//           }
//           priceRange {
//             minVariantPrice {
//               amount
//               currencyCode
//             }
//           }
//         }
//       }
//       pageInfo {
//         hasNextPage
//         hasPreviousPage
//         startCursor
//         endCursor
//       }
//     }
//   }
// `;

// async function getProducts({ first, after, last, before }) {
//   console.log("🔍 Fetching products with params:", { first, after, last, before });

//   const URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;
//   const variables = {};

//   if (before) {
//     variables.last = last || 9;
//     variables.before = before;
//   } else if (after) {
//     variables.first = first || 9;
//     variables.after = after;
//   } else {
//     variables.first = first || 9;
//   }

//   console.log("📤 GraphQL variables:", variables);

//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "X-Shopify-Storefront-Access-Token":
//         process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
//     },
//     body: JSON.stringify({
//       query: PRODUCTS_QUERY,
//       variables,
//     }),
//   };

//   try {
//     const response = await fetch(URL, options);

//     if (!response.ok) {
//       const text = await response.text();
//       throw new Error(`Shopify error: ${response.status} ${text}`);
//     }

//     const data = await response.json();

//     if (!data || !data.data || !data.data.products) {
//       console.error("❌ Invalid response from Shopify:", data);
//       return {
//         edges: [],
//         pageInfo: { hasNextPage: false, hasPreviousPage: false },
//       };
//     }

//     console.log("✅ Shopify returned", data.data.products.edges.length, "products");

//     return data.data.products;
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return {
//       edges: [],
//       pageInfo: { hasNextPage: false, hasPreviousPage: false },
//     };
//   }
// }

// // --- THEME-SPECIFIC LAYOUTS (styling only) -----------------------------

// function DarkLayout({ products, pageInfo }) {
//   return (
//     <main className="min-h-screen bg-slate-950 text-slate-900">
//       {/* Global background + vignette */}
//       <div className="pointer-events-none fixed inset-0 -z-20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900" />
//       <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.20),transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),transparent_55%)]" />

//       {/* Page shell */}
//       <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pt-16">
//         {/* HERO SECTION */}
//         <section className="mb-12 flex flex-col gap-10 lg:mb-16 lg:flex-row lg:items-center lg:justify-between">
//           {/* Left: headline / copy */}
//           <div className="max-w-xl space-y-5">
//             <div className="flex items-center gap-3">
//               <p className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-200">
//                 Winter 24 / 25 · Live Inventory
//               </p>
//             </div>

//             <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-[2.9rem]">
//               Boards for{" "}
//               <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
//                 real mountain days.
//               </span>
//             </h1>

//             <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
//               A focused lineup of all‑mountain, freestyle and powder decks. Fast
//               Shopify‑backed checkout, rider‑tested gear, and shipping that
//               actually keeps up with the snow report.
//             </p>

//             {/* Trust bar */}
//             <dl className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-200 sm:text-sm sm:max-w-md">
//               <div className="rounded-2xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 shadow-sm shadow-slate-900/70 backdrop-blur">
//                 <dt className="font-medium text-slate-50">48‑hour shipping</dt>
//                 <dd className="mt-0.5 text-[11px] text-slate-400 sm:text-xs">
//                   Dispatch from EU &amp; US fulfillment hubs.
//                 </dd>
//               </div>
//               <div className="rounded-2xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 shadow-sm shadow-slate-900/70 backdrop-blur">
//                 <dt className="font-medium text-slate-50">Rider‑vetted</dt>
//                 <dd className="mt-0.5 text-[11px] text-slate-400 sm:text-xs">
//                   Every board logged 20+ test days this season.
//                 </dd>
//               </div>
//             </dl>
//           </div>

//           {/* Right: hero product card */}
//           <div className="hidden min-w-[260px] max-w-xs flex-1 rounded-3xl border border-sky-400/50 bg-gradient-to-br from-sky-500 via-cyan-400 to-emerald-400 p-[1px] shadow-[0_20px_60px_rgba(8,47,73,0.9)] sm:block">
//             <div className="flex h-full flex-col justify-between rounded-[22px] bg-slate-950 px-6 py-6 text-slate-100">
//               <div className="space-y-3">
//                 <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
//                   Editors&apos; Pick
//                 </p>
//                 <h2 className="text-lg font-semibold leading-snug">
//                   Ghost Line 158 All‑Mountain
//                 </h2>
//                 <p className="text-xs text-slate-300">
//                   Directional twin with enough backbone for hardpack but still
//                   surfy on storm days. Our do‑everything daily driver.
//                 </p>
//               </div>
//               <div className="mt-5 flex items-end justify-between">
//                 <div>
//                   <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
//                     From
//                   </p>
//                   <p className="text-2xl font-semibold text-slate-50">$549</p>
//                 </div>
//                 <span className="rounded-full bg-sky-500/20 px-3 py-1 text-[11px] font-medium text-sky-200">
//                   Staff favorite
//                 </span>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* MAIN CONTENT CARD */}
//         <ProductsSection products={products} pageInfo={pageInfo} dark />
//       </div>
//     </main>
//   );
// }

// function LightLayout({ products, pageInfo }) {
//   return (
//     <main className="min-h-screen bg-slate-50 text-slate-900">
//       {/* Top gradient / hero backdrop */}
//       <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-slate-100 via-white to-slate-100" />

//       {/* Page shell */}
//       <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pt-16">
//         {/* HERO SECTION */}
//         <section className="mb-10 flex flex-col gap-8 lg:mb-14 lg:flex-row lg:items-center lg:justify-between">
//           <div className="max-w-xl space-y-4">
//             <div className="flex items-center gap-3">
//               <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
//                 Winter 24 / 25 Collection
//               </p>
//               {/* Theme toggle */}

//             </div>

//             <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
//               Built for real lines,
//               <span className="block text-sky-600">not just the gram.</span>
//             </h1>
//             <p className="text-sm leading-relaxed text-slate-500 sm:text-base">
//               A tight edit of boards, tuned for park laps, side‑country missions
//               and everything in between. Free returns, fast shipping, and gear
//               that&apos;s actually in stock.
//             </p>

//             <dl className="mt-4 grid grid-cols-2 gap-4 text-xs text-slate-500 sm:text-sm sm:max-w-md">
//               <div className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 shadow-sm">
//                 <dt className="font-medium text-slate-800">48‑hour shipping</dt>
//                 <dd className="mt-0.5 text-[11px] sm:text-xs">
//                   From our EU &amp; US warehouses.
//                 </dd>
//               </div>
//               <div className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 shadow-sm">
//                 <dt className="font-medium text-slate-800">Rider‑tested</dt>
//                 <dd className="mt-0.5 text-[11px] sm:text-xs">
//                   Every deck vetted by real riders.
//                 </dd>
//               </div>
//             </dl>
//           </div>

//           <div className="hidden min-w-[260px] max-w-xs flex-1 rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-500 via-cyan-400 to-slate-900 p-[1px] shadow-lg shadow-sky-500/20 sm:block">
//             <div className="flex h-full flex-col justify-between rounded-[22px] bg-slate-950 px-6 py-6 text-slate-100">
//               <div className="space-y-3">
//                 <p className="text-xs font-medium uppercase tracking-[0.24em] text-sky-300">
//                   Editors&apos; Pick
//                 </p>
//                 <h2 className="text-lg font-semibold leading-snug">
//                   Ghost Line 158 All‑Mountain
//                 </h2>
//                 <p className="text-xs text-slate-300">
//                   Damp, stable and still playful. Our go‑to for 90% of days on
//                   the hill.
//                 </p>
//               </div>
//               <div className="mt-5 flex items-end justify-between">
//                 <div>
//                   <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
//                     From
//                   </p>
//                   <p className="text-xl font-semibold text-white">$549</p>
//                 </div>
//                 <span className="rounded-full bg-sky-500/20 px-3 py-1 text-[11px] font-medium text-sky-200">
//                   Staff favorite
//                 </span>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* MAIN CONTENT CARD */}
//         <ProductsSection products={products} pageInfo={pageInfo} dark={false} />
//       </div>
//     </main>
//   );
// }

// // Shared products grid + pagination, theme aware via `dark` flag
// function ProductsSection({ products, pageInfo, dark }) {
//   const cardShellClasses = dark
//     ? "rounded-3xl border border-slate-800/60 bg-slate-950/70 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur-sm sm:p-6 lg:p-8"
//     : "rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm shadow-slate-200 sm:p-6 lg:p-8";

//   const headerBorder = dark ? "border-slate-800" : "border-slate-100";
//   const headerTitle = dark
//     ? "text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 sm:text-[11px]"
//     : "text-sm font-semibold uppercase tracking-[0.2em] text-slate-500";
//   const headerSubtitle = dark
//     ? "mt-1 text-xs text-slate-500 sm:text-sm"
//     : "mt-1 text-xs text-slate-400 sm:text-sm";

//   const filterButtonBase = "rounded-full px-3 py-1.5 text-xs sm:text-[13px] transition";
//   const filterPrimary = dark
//     ? "border border-slate-700 bg-slate-900 text-slate-200 hover:border-sky-500 hover:text-sky-200"
//     : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white";
//   const filterSecondary = dark
//     ? "border border-slate-800 bg-slate-950 text-slate-400 hover:border-sky-500/60 hover:text-sky-200"
//     : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white";

//   const gridItemBorder = dark ? "border-slate-800 bg-slate-950/80" : "border-slate-200/80 bg-white";
//   const gridShadow = dark
//     ? "shadow-sm shadow-slate-900/80 hover:shadow-[0_18px_40px_rgba(8,47,73,0.9)]"
//     : "shadow-sm shadow-slate-100 hover:shadow-lg hover:shadow-slate-200";
//   const gridHoverBorder = dark ? "hover:border-sky-500/70" : "hover:border-slate-300";
//   const titleColor = dark ? "text-slate-50" : "text-slate-900";
//   const titleHover = dark ? "group-hover:text-sky-300" : "group-hover:text-sky-700";
//   const metaColor = dark ? "text-slate-500" : "text-slate-400";
//   const priceColor = dark ? "text-slate-50" : "text-slate-900";
//   const stockTint = dark ? "text-emerald-400" : "text-emerald-500";
//   const stockMuted = dark ? "text-slate-500" : "text-slate-400";

//   const ctaButton = dark
//     ? "border border-sky-400/70 bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/60 hover:bg-sky-400 hover:border-sky-300 focus-visible:ring-sky-400 focus-visible:ring-offset-slate-950"
//     : "border border-slate-900/10 bg-slate-900 text-white shadow-sm shadow-slate-900/20 hover:bg-sky-700 hover:border-sky-700 focus-visible:ring-sky-500 focus-visible:ring-offset-white";

//   const footerBorder = dark ? "border-slate-800" : "border-slate-100";
//   const footerText = dark ? "text-slate-500" : "text-slate-400";
//   const footerBrand = dark ? "text-slate-300" : "text-slate-700";

//   return (
//     <section className={cardShellClasses}>
//       {/* Section header row */}
//       <div className={`mb-6 flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between ${headerBorder}`}>
//         <div>
//           <h2 className={headerTitle}>Snowboards</h2>
//           <p className={headerSubtitle}>
//             Showing {products.length} products · Server‑rendered from Shopify Storefront API.
//           </p>
//         </div>

//         <div className="flex flex-wrap gap-2">
//           <button className={`${filterButtonBase} ${filterPrimary}`}>All styles</button>
//           <button className={`${filterButtonBase} ${filterSecondary}`}>Freestyle</button>
//           <button className={`${filterButtonBase} ${filterSecondary}`}>All‑Mountain</button>
//         </div>
//       </div>

//       {/* PRODUCT GRID */}
//       <div
//         aria-label="Snowboards"
//         className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3"
//       >
//         {products.map(({ node: product }) => {
//           const price = Number(
//             product.priceRange.minVariantPrice.amount
//           ).toLocaleString("en-US", {
//             style: "currency",
//             currency: product.priceRange.minVariantPrice.currencyCode,
//           });

//           return (
//             <Link
//               href={`/products/${product.handle}`}
//               key={product.id}
//               className={`group relative flex flex-col overflow-hidden rounded-2xl border ${gridItemBorder} ${gridShadow} transition
//                           hover:-translate-y-1 ${gridHoverBorder}
//                           focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 ${
//                             dark ? "focus-visible:ring-offset-slate-950" : "focus-visible:ring-offset-slate-50"
//                           }`}
//             >
//               {/* Image */}
//               <div className={`relative h-64 w-full overflow-hidden ${dark ? "bg-slate-900" : "bg-slate-100"}`}>
//                 {product.featuredImage && (
//                   <Image
//                     src={product.featuredImage.url}
//                     alt={product.featuredImage.altText || product.title}
//                     fill
//                     className="object-cover transition duration-700 ease-out group-hover:scale-105 group-hover:rotate-[0.3deg]"
//                     sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//                   />
//                 )}
//                 <div
//                   className={`pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t ${
//                     dark ? "from-black/55 via-black/0 to-transparent" : "from-black/35 to-transparent"
//                   }`}
//                 />
//               </div>

//               {/* Body */}
//               <div className="flex flex-1 flex-col justify-between px-4 pb-4 pt-4 sm:px-5 sm:pt-5 sm:pb-5">
//                 <div className="space-y-1.5">
//                   <h3 className={`text-base font-semibold tracking-tight line-clamp-2 ${titleColor} ${titleHover}`}>
//                     {product.title}
//                   </h3>
//                   <p className={`text-[11px] uppercase tracking-[0.18em] ${metaColor}`}>
//                     All‑Mountain • Freestyle • Powder
//                   </p>
//                 </div>

//                 <div className="mt-4 flex items-end justify-between gap-3">
//                   <div className="space-y-0.5">
//                     <p className={`text-lg font-semibold ${priceColor}`}>{price}</p>
//                     <p className={`text-[11px] uppercase tracking-[0.18em] ${stockTint}`}>
//                       In stock
//                       <span className={`ml-1 ${stockMuted}`}>· Ships in 24h</span>
//                     </p>
//                   </div>

//                   <button
//                     type="button"
//                     className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${ctaButton}`}
//                   >
//                     View details
//                   </button>
//                 </div>
//               </div>

//               {/* Accent bar */}
//               <span className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 opacity-0 transition-opacity group-hover:opacity-100" />
//             </Link>
//           );
//         })}
//       </div>

//       {/* FOOTER TOOLBAR / PAGINATION */}
//       <div className={`mt-10 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between ${footerBorder}`}>
//         <p className={`text-xs ${footerText}`}>
//           Powered by{" "}
//           <span className={`font-semibold ${footerBrand}`}>Shopify Storefront API</span>. Cursor‑based
//           pagination keeps responses fast even with large catalogs.
//         </p>
//         <Pagination
//           hasNextPage={pageInfo.hasNextPage}
//           hasPreviousPage={pageInfo.hasPreviousPage}
//           endCursor={pageInfo.endCursor}
//           startCursor={pageInfo.startCursor}
//         />
//       </div>
//     </section>
//   );
// }

// // --- MAIN PAGE ---------------------------------------------------------

// export default async function Home({ searchParams }) {
//   const params = await searchParams;
//   const after = params?.after || null;
//   const before = params?.before || null;
//   const perPage = 9;

//   // Read theme from Cookie header (Next.js 15+ syntax)
//   let theme = "dark"; // default
//   try {
//     const headersList = await headers();
//     const cookieHeader = headersList.get("cookie") || "";
//     const themeMatch = cookieHeader.match(/theme=([^;]+)/);
//     if (themeMatch && (themeMatch[1] === "light" || themeMatch[1] === "dark")) {
//       theme = themeMatch[1];
//     }
//   } catch (e) {
//     // If headers() fails, use default
//     console.log("Could not read cookie, using default theme");
//   }

//   const productsData = await getProducts({
//     first: !before ? perPage : undefined,
//     after,
//     last: before ? perPage : undefined,
//     before,
//   });

//   const products = productsData.edges;
//   const pageInfo = productsData.pageInfo;

//   if (theme === "light") {
//     return <LightLayout products={products} pageInfo={pageInfo} />;
//   }

//   return <DarkLayout products={products} pageInfo={pageInfo} />;
// }


import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import { headers } from "next/headers"; // ← ADD THIS


const PRODUCTS_QUERY = `
  query Products($first: Int, $after: String, $last: Int, $before: String) {
    products(first: $first, after: $after, last: $last, before: $before) {
      edges {
        cursor
        node {
          id
          title
          handle
          vendor
          productType
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
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

// Helper to calculate discount percentage
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

// ...existing getProducts function...
async function getProducts({ first, after, last, before }) {
  console.log("🔍 Fetching products with params:", { first, after, last, before });

  const URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;
  const variables = {};

  if (before) {
    variables.last = last || 9;
    variables.before = before;
  } else if (after) {
    variables.first = first || 9;
    variables.after = after;
  } else {
    variables.first = first || 9;
  }

  console.log("📤 GraphQL variables:", variables);

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token":
        process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query: PRODUCTS_QUERY,
      variables,
    }),
  };

  try {
    const response = await fetch(URL, options);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Shopify error: ${response.status} ${text}`);
    }

    const data = await response.json();

    if (!data || !data.data || !data.data.products) {
      console.error("❌ Invalid response from Shopify:", data);
      return {
        edges: [],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
      };
    }

    console.log("✅ Shopify returned", data.data.products.edges.length, "products");

    return data.data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      edges: [],
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
    };
  }
}

// --- THEME-SPECIFIC LAYOUTS (styling only) -----------------------------

function DarkLayout({ products, pageInfo }) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-900">
      {/* Global background + vignette */}
      <div className="pointer-events-none fixed inset-0 -z-20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.20),transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),transparent_55%)]" />

      {/* Page shell */}
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pt-16">
        {/* HERO SECTION */}
        <section className="mb-12 flex flex-col gap-10 lg:mb-16 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: headline / copy */}
          <div className="max-w-xl space-y-5">
            <div className="flex items-center gap-3">
              <p className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-200">
                Winter 24 / 25 · Live Inventory
              </p>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-[2.9rem]">
              Boards for{" "}
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                real mountain days.
              </span>
            </h1>

            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
              A focused lineup of all‑mountain, freestyle and powder decks. Fast
              Shopify‑backed checkout, rider‑tested gear, and shipping that
              actually keeps up with the snow report.
            </p>

            {/* Trust bar */}
            <dl className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-200 sm:text-sm sm:max-w-md">
              <div className="rounded-2xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 shadow-sm shadow-slate-900/70 backdrop-blur">
                <dt className="font-medium text-slate-50">48‑hour shipping</dt>
                <dd className="mt-0.5 text-[11px] text-slate-400 sm:text-xs">
                  Dispatch from EU &amp; US fulfillment hubs.
                </dd>
              </div>
              <div className="rounded-2xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 shadow-sm shadow-slate-900/70 backdrop-blur">
                <dt className="font-medium text-slate-50">Rider‑vetted</dt>
                <dd className="mt-0.5 text-[11px] text-slate-400 sm:text-xs">
                  Every board logged 20+ test days this season.
                </dd>
              </div>
            </dl>
          </div>

          {/* Right: hero product card */}
          <div className="hidden min-w-[260px] max-w-xs flex-1 rounded-3xl border border-sky-400/50 bg-gradient-to-br from-sky-500 via-cyan-400 to-emerald-400 p-[1px] shadow-[0_20px_60px_rgba(8,47,73,0.9)] sm:block">
            <div className="flex h-full flex-col justify-between rounded-[22px] bg-slate-950 px-6 py-6 text-slate-100">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
                  Editors&apos; Pick
                </p>
                <h2 className="text-lg font-semibold leading-snug">
                  Ghost Line 158 All‑Mountain
                </h2>
                <p className="text-xs text-slate-300">
                  Directional twin with enough backbone for hardpack but still
                  surfy on storm days. Our do‑everything daily driver.
                </p>
              </div>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                    From
                  </p>
                  <p className="text-2xl font-semibold text-slate-50">$549</p>
                </div>
                <span className="rounded-full bg-sky-500/20 px-3 py-1 text-[11px] font-medium text-sky-200">
                  Staff favorite
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT CARD */}
        <ProductsSection products={products} pageInfo={pageInfo} dark />
      </div>
    </main>
  );
}

function LightLayout({ products, pageInfo }) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top gradient / hero backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-slate-100 via-white to-slate-100" />

      {/* Page shell */}
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pt-16">
        {/* HERO SECTION */}
        <section className="mb-10 flex flex-col gap-8 lg:mb-14 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-4">
            <div className="flex items-center gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                Winter 24 / 25 Collection
              </p>
              {/* Theme toggle */}

            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Built for real lines,
              <span className="block text-sky-600">not just the gram.</span>
            </h1>
            <p className="text-sm leading-relaxed text-slate-500 sm:text-base">
              A tight edit of boards, tuned for park laps, side‑country missions
              and everything in between. Free returns, fast shipping, and gear
              that&apos;s actually in stock.
            </p>

            <dl className="mt-4 grid grid-cols-2 gap-4 text-xs text-slate-500 sm:text-sm sm:max-w-md">
              <div className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 shadow-sm">
                <dt className="font-medium text-slate-800">48‑hour shipping</dt>
                <dd className="mt-0.5 text-[11px] sm:text-xs">
                  From our EU &amp; US warehouses.
                </dd>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 shadow-sm">
                <dt className="font-medium text-slate-800">Rider‑tested</dt>
                <dd className="mt-0.5 text-[11px] sm:text-xs">
                  Every deck vetted by real riders.
                </dd>
              </div>
            </dl>
          </div>

          <div className="hidden min-w-[260px] max-w-xs flex-1 rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-500 via-cyan-400 to-slate-900 p-[1px] shadow-lg shadow-sky-500/20 sm:block">
            <div className="flex h-full flex-col justify-between rounded-[22px] bg-slate-950 px-6 py-6 text-slate-100">
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-sky-300">
                  Editors&apos; Pick
                </p>
                <h2 className="text-lg font-semibold leading-snug">
                  Ghost Line 158 All‑Mountain
                </h2>
                <p className="text-xs text-slate-300">
                  Damp, stable and still playful. Our go‑to for 90% of days on
                  the hill.
                </p>
              </div>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    From
                  </p>
                  <p className="text-xl font-semibold text-white">$549</p>
                </div>
                <span className="rounded-full bg-sky-500/20 px-3 py-1 text-[11px] font-medium text-sky-200">
                  Staff favorite
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT CARD */}
        <ProductsSection products={products} pageInfo={pageInfo} dark={false} />
      </div>
    </main>
  );
}

// Shared products grid + pagination, theme aware via `dark` flag
function ProductsSection({ products, pageInfo, dark }) {
  const cardShellClasses = dark
    ? "rounded-3xl border border-slate-800/60 bg-slate-950/70 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur-sm sm:p-6 lg:p-8"
    : "rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm shadow-slate-200 sm:p-6 lg:p-8";

  const headerBorder = dark ? "border-slate-800" : "border-slate-100";
  const headerTitle = dark
    ? "text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 sm:text-[11px]"
    : "text-sm font-semibold uppercase tracking-[0.2em] text-slate-500";
  const headerSubtitle = dark
    ? "mt-1 text-xs text-slate-500 sm:text-sm"
    : "mt-1 text-xs text-slate-400 sm:text-sm";

  const filterButtonBase = "rounded-full px-3 py-1.5 text-xs sm:text-[13px] transition";
  const filterPrimary = dark
    ? "border border-slate-700 bg-slate-900 text-slate-200 hover:border-sky-500 hover:text-sky-200"
    : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white";
  const filterSecondary = dark
    ? "border border-slate-800 bg-slate-950 text-slate-400 hover:border-sky-500/60 hover:text-sky-200"
    : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white";

  const gridItemBorder = dark ? "border-slate-800 bg-slate-950/80" : "border-slate-200/80 bg-white";
  const gridShadow = dark
    ? "shadow-sm shadow-slate-900/80 hover:shadow-[0_18px_40px_rgba(8,47,73,0.9)]"
    : "shadow-sm shadow-slate-100 hover:shadow-lg hover:shadow-slate-200";
  const gridHoverBorder = dark ? "hover:border-sky-500/70" : "hover:border-slate-300";
  const titleColor = dark ? "text-slate-50" : "text-slate-900";
  const titleHover = dark ? "group-hover:text-sky-300" : "group-hover:text-sky-700";
  const metaColor = dark ? "text-slate-500" : "text-slate-400";
  const priceColor = dark ? "text-slate-50" : "text-slate-900";
  const stockTint = dark ? "text-emerald-400" : "text-emerald-500";
  const stockMuted = dark ? "text-slate-500" : "text-slate-400";

  const ctaButton = dark
    ? "border border-sky-400/70 bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/60 hover:bg-sky-400 hover:border-sky-300 focus-visible:ring-sky-400 focus-visible:ring-offset-slate-950"
    : "border border-slate-900/10 bg-slate-900 text-white shadow-sm shadow-slate-900/20 hover:bg-sky-700 hover:border-sky-700 focus-visible:ring-sky-500 focus-visible:ring-offset-white";

  const footerBorder = dark ? "border-slate-800" : "border-slate-100";
  const footerText = dark ? "text-slate-500" : "text-slate-400";
  const footerBrand = dark ? "text-slate-300" : "text-slate-700";

  return (
    <section className={cardShellClasses}>
      {/* Section header row */}
      <div className={`mb-6 flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between ${headerBorder}`}>
        <div>
          <h2 className={headerTitle}>Snowboards</h2>
          <p className={headerSubtitle}>
            Showing {products.length} products · Server‑rendered from Shopify Storefront API.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button className={`${filterButtonBase} ${filterPrimary}`}>All styles</button>
          <button className={`${filterButtonBase} ${filterSecondary}`}>Freestyle</button>
          <button className={`${filterButtonBase} ${filterSecondary}`}>All‑Mountain</button>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div
        aria-label="Snowboards"
        className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3"
      >


        {products.map(({ node: product }) => {
          const discount = getDiscount(product);
          const isOnSale = discount > 0;
          const price = parseFloat(product.priceRange.minVariantPrice.amount);
          const comparePrice = parseFloat(
            product.compareAtPriceRange?.minVariantPrice?.amount || 0
          );
          const currency = product.priceRange.minVariantPrice.currencyCode;

          // Theme-aware badge styles
          const saleBadge = dark
            ? "bg-red-500/20 text-red-300 border-red-400/30"
            : "bg-red-50 text-red-600 border-red-200";
          const soldOutBadge = dark
            ? "bg-slate-700/50 text-slate-400 border-slate-600/50"
            : "bg-slate-100 text-slate-600 border-slate-300";

          return (
            <Link
              href={`/products/${product.handle}`}
              key={product.id}
              className="group"
            >
              <article
                className={`flex h-full flex-col overflow-hidden rounded-2xl border shadow-lg transition-all duration-300 hover:-translate-y-1 ${gridItemBorder} ${gridShadow} ${gridHoverBorder}`}
              >
                {/* Image container */}
                <div className={`relative aspect-square w-full overflow-hidden ${dark ? "bg-slate-900" : "bg-slate-100"}`}>
                  {product.featuredImage && (
                    <Image
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText || product.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}

                  {/* Badges overlay */}
                  <div className="absolute left-2 top-2 flex flex-col gap-1.5">
                    {!product.availableForSale && (
                      <span
                        className={`
    inline-flex items-center gap-1.5
    rounded-xl border px-3 py-1.5
    text-[9px] font-extrabold uppercase tracking-[0.22em]
    shadow-md ring-1 ring-red-500/10
    ${dark ? "bg-red-900/60 text-red-200 border-red-500/30" : "bg-red-50 text-red-700 border-red-400"}
  `}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                        Sold Out
                      </span>
                    )}
                    {isOnSale && product.availableForSale && (
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide shadow-sm ${saleBadge}`}
                      >
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* Quick view overlay (on hover) */}
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/0 opacity-0 transition-all duration-300 group-hover:bg-slate-950/40 group-hover:opacity-100">
                    <span
                      className={`rounded-full px-5 py-2.5 text-xs font-semibold shadow-lg transition-all duration-300 scale-95 group-hover:scale-100 ${dark
                        ? "bg-sky-500 text-slate-950 shadow-sky-500/50"
                        : "bg-sky-600 text-white shadow-sky-600/40"
                        }`}
                    >
                      Quick View →
                    </span>
                  </div>

                  <div
                    className={`pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t ${dark ? "from-black/55 via-black/0 to-transparent" : "from-black/35 to-transparent"
                      }`}
                  />
                </div>

                {/* Product info */}
                <div className="flex flex-1 flex-col gap-2 p-4">
                  {/* Vendor/Brand */}
                  {product.vendor && (
                    <p className={`text-[10px] font-semibold uppercase tracking-wider ${metaColor}`}>
                      {product.vendor}
                    </p>
                  )}

                  {/* Title */}
                  <h3
                    className={`line-clamp-2 text-base font-semibold leading-snug transition-colors ${titleColor} ${titleHover}`}
                  >
                    {product.title}
                  </h3>

                  {/* Product type */}
                  <p className={`text-[11px] uppercase tracking-[0.18em] ${metaColor}`}>
                    {product.productType || "All‑Mountain"} • Freestyle • Powder
                  </p>

                  {/* Price section */}
                  <div className="mt-auto space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold">
                        {price.toLocaleString("en-US", {
                          style: "currency",
                          currency,
                        })}
                      </span>
                      {isOnSale && (
                        <span className={`text-sm line-through ${metaColor}`}>
                          {comparePrice.toLocaleString("en-US", {
                            style: "currency",
                            currency,
                          })}
                        </span>
                      )}
                    </div>

                    {/* Stock status */}
                    {product.availableForSale ? (
                      <p className={`text-[11px] uppercase tracking-[0.18em] ${stockTint}`}>
                        ✓ In stock
                        <span className={`ml-1 ${stockMuted}`}>· Ships in 24h</span>
                      </p>
                    ) : (
                      <p className={`text-[11px] uppercase tracking-[0.18em] ${metaColor}`}>
                        Out of stock
                      </p>
                    )}

                    {/* View Details Button - Fixed width with animations */}
                    <button
                      type="button"
                      className={`relative w-full overflow-hidden rounded-full px-4 py-2.5 text-xs font-semibold tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 group/btn ${ctaButton}`}
                    >
                      {/* Animated shine effect */}
                      <span className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.4),transparent)] opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />

                      <span className="relative flex items-center justify-center gap-1.5">
                        View Details
                        <svg
                          className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>

                {/* Accent bar */}
                <span className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </article>
            </Link>
          );
        })}

      </div>

      {/* FOOTER TOOLBAR / PAGINATION */}
      <div className={`mt-10 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between ${footerBorder}`}>
        <p className={`text-xs ${footerText}`}>
          Powered by{" "}
          <span className={`font-semibold ${footerBrand}`}>Shopify Storefront API</span>. Cursor‑based
          pagination keeps responses fast even with large catalogs.
        </p>
        <Pagination
          hasNextPage={pageInfo.hasNextPage}
          hasPreviousPage={pageInfo.hasPreviousPage}
          endCursor={pageInfo.endCursor}
          startCursor={pageInfo.startCursor}
        />
      </div>
    </section>
  );
}

// --- MAIN PAGE ---------------------------------------------------------

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const after = params?.after || null;
  const before = params?.before || null;
  const perPage = 9;

  // Read theme from Cookie header (Next.js 15+ syntax)
  let theme = "dark"; // default
  try {
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie") || "";
    const themeMatch = cookieHeader.match(/theme=([^;]+)/);
    if (themeMatch && (themeMatch[1] === "light" || themeMatch[1] === "dark")) {
      theme = themeMatch[1];
    }
  } catch (e) {
    // If headers() fails, use default
    console.log("Could not read cookie, using default theme");
  }

  const productsData = await getProducts({
    first: !before ? perPage : undefined,
    after,
    last: before ? perPage : undefined,
    before,
  });

  const products = productsData.edges;
  const pageInfo = productsData.pageInfo;

  if (theme === "light") {
    return <LightLayout products={products} pageInfo={pageInfo} />;
  }

  return <DarkLayout products={products} pageInfo={pageInfo} />;
}

