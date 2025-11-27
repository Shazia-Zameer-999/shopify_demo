// import Image from "next/image";
// import Link from "next/link";
// import Pagination from "@/components/Pagination";
// import { headers } from "next/headers";
// import ProductCard from "@/components/ProductCard";


// const PRODUCTS_QUERY = `
//   query Products($first: Int, $after: String, $last: Int, $before: String) {
//     products(first: $first, after: $after, last: $last, before: $before) {
//       edges {
//         cursor
//         node {
//           id
//           title
//           handle
//           vendor
//           productType
//           availableForSale
//           featuredImage {
//             url
//             altText
//           }
//           priceRange {
//             minVariantPrice {
//               amount
//               currencyCode
//             }
//             maxVariantPrice {
//               amount
//               currencyCode
//             }
//           }
//           compareAtPriceRange {
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

//     return data.data.products;
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return {
//       edges: [],
//       pageInfo: { hasNextPage: false, hasPreviousPage: false },
//     };
//   }
// }

// function getDiscount(product) {
//   const current = parseFloat(product.priceRange.minVariantPrice.amount);
//   const compare = parseFloat(
//     product.compareAtPriceRange?.minVariantPrice?.amount || 0
//   );
//   if (compare > current) {
//     return Math.round(((compare - current) / compare) * 100);
//   }
//   return 0;
// }



// function DarkLayout({ products, pageInfo }) {
//   return (
//     <main className="min-h-screen bg-slate-950 text-slate-900">

//       <div className="pointer-events-none fixed inset-0 -z-20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900" />
//       <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.20),transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),transparent_55%)]" />


//       <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pt-16">

//         <section className="mb-12 flex flex-col gap-10 lg:mb-16 lg:flex-row lg:items-center lg:justify-between">

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

//         <ProductsSection products={products} pageInfo={pageInfo} dark />
//       </div>
//     </main>
//   );
// }

// function LightLayout({ products, pageInfo }) {
//   return (
//     <main className="min-h-screen bg-slate-50 text-slate-900">

//       <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-slate-100 via-white to-slate-100" />


//       <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pt-16">

//         <section className="mb-10 flex flex-col gap-8 lg:mb-14 lg:flex-row lg:items-center lg:justify-between">
//           <div className="max-w-xl space-y-4">
//             <div className="flex items-center gap-3">
//               <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
//                 Winter 24 / 25 Collection
//               </p>


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


//         <ProductsSection products={products} pageInfo={pageInfo} dark={false} />
//       </div>
//     </main>
//   );
// }


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

//   const footerBorder = dark ? "border-slate-800" : "border-slate-100";
//   const footerText = dark ? "text-slate-500" : "text-slate-400";
//   const footerBrand = dark ? "text-slate-300" : "text-slate-700";

//   return (
//     <section className={cardShellClasses}>
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

//       {/* Products Grid */}
//       <div aria-label="Snowboards" className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
//         {products.map(({ node: product }) => (
//           <ProductCard key={product.id} product={product} dark={dark} />
//         ))}
//       </div>

//       {/* Footer with Pagination */}
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


//   let theme = "dark"; 
//   try {
//     const headersList = await headers();
//     const cookieHeader = headersList.get("cookie") || "";
//     const themeMatch = cookieHeader.match(/theme=([^;]+)/);
//     if (themeMatch && (themeMatch[1] === "light" || themeMatch[1] === "dark")) {
//       theme = themeMatch[1];
//     }
//   } catch (e) {

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

//3

// import Image from "next/image";
// import Link from "next/link";
// import Pagination from "@/components/Pagination";
// import { headers } from "next/headers";
// import ProductCard from "@/components/ProductCard";
// import HeroSlider from "@/components/HeroSlider";


// const PRODUCTS_QUERY = `
//   query Products($first: Int, $after: String, $last: Int, $before: String) {
//     products(first: $first, after: $after, last: $last, before: $before) {
//       edges {
//         cursor
//         node {
//           id
//           title
//           handle
//           vendor
//           productType
//           availableForSale
//           featuredImage {
//             url
//             altText
//           }
//           priceRange {
//             minVariantPrice {
//               amount
//               currencyCode
//             }
//             maxVariantPrice {
//               amount
//               currencyCode
//             }
//           }
//           compareAtPriceRange {
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

//     return data.data.products;
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return {
//       edges: [],
//       pageInfo: { hasNextPage: false, hasPreviousPage: false },
//     };
//   }
// }

// function getDiscount(product) {
//   const current = parseFloat(product.priceRange.minVariantPrice.amount);
//   const compare = parseFloat(
//     product.compareAtPriceRange?.minVariantPrice?.amount || 0
//   );
//   if (compare > current) {
//     return Math.round(((compare - current) / compare) * 100);
//   }
//   return 0;
// }



// function DarkLayout({ products, pageInfo }) {
//   return (
    
//     <main className="min-h-screen bg-slate-950 text-slate-900">
// <HeroSlider theme="dark" />
//       <div className="pointer-events-none fixed inset-0 -z-20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900" />
//       <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.20),transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),transparent_55%)]" />


//       <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pt-16">

//         {/* HERO SECTION WITH IMAGE */}
//         <section className="relative mb-12 overflow-hidden rounded-3xl border border-sky-400/30 shadow-2xl shadow-sky-500/20 lg:mb-16">
//           <div className="absolute inset-0 ">
//             <Image
//               src="https://i.pinimg.com/1200x/72/70/21/7270215c42fa432dc04bd88feb856a8a.jpg"
//               alt="Snowboarding Hero"
//               fill
//               className="object-cover"
//               priority
//             />
//             <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/40" />
//           </div>

//           <div className="relative flex flex-col gap-10 py-20 px-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-24">

//             <div className="max-w-xl space-y-5">
//               <div className="flex items-center gap-3">
//                 <p className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-200">
//                   Winter 24 / 25 · Live Inventory
//                 </p>
//               </div>

//               <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-[2.9rem]">
//                 Boards for{" "}
//                 <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
//                   real mountain days.
//                 </span>
//               </h1>

//               <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
//                 A focused lineup of all‑mountain, freestyle and powder decks. Fast
//                 Shopify‑backed checkout, rider‑tested gear, and shipping that
//                 actually keeps up with the snow report.
//               </p>


//               <dl className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-200 sm:text-sm sm:max-w-md">
//                 <div className="rounded-2xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 shadow-sm shadow-slate-900/70 backdrop-blur">
//                   <dt className="font-medium text-slate-50">48‑hour shipping</dt>
//                   <dd className="mt-0.5 text-[11px] text-slate-400 sm:text-xs">
//                     Dispatch from EU &amp; US fulfillment hubs.
//                   </dd>
//                 </div>
//                 <div className="rounded-2xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 shadow-sm shadow-slate-900/70 backdrop-blur">
//                   <dt className="font-medium text-slate-50">Rider‑vetted</dt>
//                   <dd className="mt-0.5 text-[11px] text-slate-400 sm:text-xs">
//                     Every board logged 20+ test days this season.
//                   </dd>
//                 </div>
//               </dl>
//             </div>


//             <div className="hidden min-w-[260px] max-w-xs flex-1 rounded-3xl border border-sky-400/50 bg-gradient-to-br from-sky-500 via-cyan-400 to-emerald-400 p-[1px] shadow-[0_20px_60px_rgba(8,47,73,0.9)] sm:block">
//               <div className="flex h-full flex-col justify-between rounded-[22px] bg-slate-950 px-6 py-6 text-slate-100">
//                 <div className="space-y-3">
//                   <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
//                     Editors&apos; Pick
//                   </p>
//                   <h2 className="text-lg font-semibold leading-snug">
//                     Ghost Line 158 All‑Mountain
//                   </h2>
//                   <p className="text-xs text-slate-300">
//                     Directional twin with enough backbone for hardpack but still
//                     surfy on storm days. Our do‑everything daily driver.
//                   </p>
//                 </div>
//                 <div className="mt-5 flex items-end justify-between">
//                   <div>
//                     <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
//                       From
//                     </p>
//                     <p className="text-2xl font-semibold text-slate-50">$549</p>
//                   </div>
//                   <span className="rounded-full bg-sky-500/20 px-3 py-1 text-[11px] font-medium text-sky-200">
//                     Staff favorite
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         <ProductsSection products={products} pageInfo={pageInfo} dark />
//       </div>
//     </main>
//   );
// }

// function LightLayout({ products, pageInfo }) {
//   return (
//     <main className="min-h-screen bg-slate-50 text-slate-900">
// <HeroSlider theme="light" />
//       <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-slate-100 via-white to-slate-100" />


//       <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pt-16">

//         {/* HERO SECTION WITH IMAGE */}
//         <section className="relative mb-10 overflow-hidden rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 lg:mb-14">
//           <div className="absolute inset-0">
//             <Image
//               src="https://i.pinimg.com/1200x/72/70/21/7270215c42fa432dc04bd88feb856a8a.jpg"
//               alt="Snowboarding Hero"
//               fill
//               className="object-cover"
//               priority
//             />
//             <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/40" />
//           </div>

//           <div className="relative flex flex-col gap-8 py-16 px-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-20">
//             <div className="max-w-xl space-y-4">
//               <div className="flex items-center gap-3">
//                 <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
//                   Winter 24 / 25 Collection
//                 </p>


//               </div>

//               <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
//                 Built for real lines,
//                 <span className="block text-sky-600">not just the gram.</span>
//               </h1>
//               <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
//                 A tight edit of boards, tuned for park laps, side‑country missions
//                 and everything in between. Free returns, fast shipping, and gear
//                 that&apos;s actually in stock.
//               </p>

//               <dl className="mt-4 grid grid-cols-2 gap-4 text-xs text-slate-500 sm:text-sm sm:max-w-md">
//                 <div className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 shadow-sm">
//                   <dt className="font-medium text-slate-800">48‑hour shipping</dt>
//                   <dd className="mt-0.5 text-[11px] sm:text-xs">
//                     From our EU &amp; US warehouses.
//                   </dd>
//                 </div>
//                 <div className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 shadow-sm">
//                   <dt className="font-medium text-slate-800">Rider‑tested</dt>
//                   <dd className="mt-0.5 text-[11px] sm:text-xs">
//                     Every deck vetted by real riders.
//                   </dd>
//                 </div>
//               </dl>
//             </div>

//             <div className="hidden min-w-[260px] max-w-xs flex-1 rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-500 via-cyan-400 to-slate-900 p-[1px] shadow-lg shadow-sky-500/20 sm:block">
//               <div className="flex h-full flex-col justify-between rounded-[22px] bg-slate-950 px-6 py-6 text-slate-100">
//                 <div className="space-y-3">
//                   <p className="text-xs font-medium uppercase tracking-[0.24em] text-sky-300">
//                     Editors&apos; Pick
//                   </p>
//                   <h2 className="text-lg font-semibold leading-snug">
//                     Ghost Line 158 All‑Mountain
//                   </h2>
//                   <p className="text-xs text-slate-300">
//                     Damp, stable and still playful. Our go‑to for 90% of days on
//                     the hill.
//                   </p>
//                 </div>
//                 <div className="mt-5 flex items-end justify-between">
//                   <div>
//                     <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
//                       From
//                     </p>
//                     <p className="text-xl font-semibold text-white">$549</p>
//                   </div>
//                   <span className="rounded-full bg-sky-500/20 px-3 py-1 text-[11px] font-medium text-sky-200">
//                     Staff favorite
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>


//         <ProductsSection products={products} pageInfo={pageInfo} dark={false} />
//       </div>
//     </main>
//   );
// }


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

//   const footerBorder = dark ? "border-slate-800" : "border-slate-100";
//   const footerText = dark ? "text-slate-500" : "text-slate-400";
//   const footerBrand = dark ? "text-slate-300" : "text-slate-700";

//   return (
//     <section className={cardShellClasses}>
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

//       {/* Products Grid */}
//       <div aria-label="Snowboards" className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
//         {products.map(({ node: product }) => (
//           <ProductCard key={product.id} product={product} dark={dark} />
//         ))}
//       </div>

//       {/* Footer with Pagination */}
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


//   let theme = "dark"; 
//   try {
//     const headersList = await headers();
//     const cookieHeader = headersList.get("cookie") || "";
//     const themeMatch = cookieHeader.match(/theme=([^;]+)/);
//     if (themeMatch && (themeMatch[1] === "light" || themeMatch[1] === "dark")) {
//       theme = themeMatch[1];
//     }
//   } catch (e) {

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
import { headers } from "next/headers";
import ProductCard from "@/components/ProductCard";
import HeroSlider from "@/components/HeroSlider";


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



async function getProducts({ first, after, last, before }) {

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

    return data.data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      edges: [],
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
    };
  }
}

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




function DarkLayout({ products, pageInfo }) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-900">
      <HeroSlider theme="dark" />

      {/* same background as before */}
      <div className="pointer-events-none fixed inset-0 -z-20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.20),transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),transparent_55%)]" />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        
        {/* UNIFIED CARD SHELL - Bridge + Products in ONE */}
        <div className="rounded-3xl border border-slate-800/60 bg-slate-950/70 shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur-sm overflow-hidden">
          
          {/* BRIDGE SECTION INSIDE CARD */}
          <section className="border-b border-slate-800/50 px-5 py-8 sm:px-7 sm:py-9 lg:px-9 lg:py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
              {/* Text column */}
              <div className="max-w-2xl space-y-4 flex-1">
                <p className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-200 w-fit">
                  Winter 24 / 25 · Live Inventory
                </p>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-50 leading-tight">
                  Boards for{" "}
                  <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                    real mountain days.
                  </span>
                </h2>

                <p className="text-xs sm:text-sm leading-relaxed text-slate-300 max-w-lg">
                  A focused lineup of all‑mountain, freestyle and powder decks. Fast
                  Shopify‑backed checkout, rider‑tested gear, and shipping that
                  actually keeps up with the snow report.
                </p>

                <dl className="mt-2 grid grid-cols-2 gap-3 text-[11px] sm:text-xs text-slate-200 max-w-md">
                  <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 px-3 py-2.5 shadow-sm">
                    <dt className="font-semibold text-slate-50">48‑hour shipping</dt>
                    <dd className="mt-1 text-[10px] sm:text-[11px] text-slate-400 leading-tight">
                      Dispatch from EU &amp; US fulfillment hubs.
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 px-3 py-2.5 shadow-sm">
                    <dt className="font-semibold text-slate-50">Rider‑vetted</dt>
                    <dd className="mt-1 text-[10px] sm:text-[11px] text-slate-400 leading-tight">
                      Every board logged 20+ test days this season.
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Small highlight card - aligned to top */}
              <div className="hidden sm:block min-w-[240px] max-w-xs flex-shrink-0">
                <div className="rounded-2xl border border-sky-400/40 bg-gradient-to-br from-sky-500 via-cyan-400 to-emerald-400 p-[1px] shadow-[0_16px_40px_rgba(8,47,73,0.9)] h-full">
                  <div className="flex flex-col justify-between rounded-[18px] bg-slate-950 px-5 py-5 text-slate-100 h-full min-h-[260px]">
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-sky-300">
                        Editors' Pick
                      </p>
                      <h3 className="text-base font-bold leading-snug">
                        Ghost Line 158 All‑Mountain
                      </h3>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Directional twin with enough backbone for hardpack but still
                        surfy on storm days. Our do‑everything daily driver.
                      </p>
                    </div>
                    <div className="mt-auto pt-4 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400 font-medium">
                          From
                        </p>
                        <p className="text-2xl font-bold text-slate-50 mt-0.5">$549</p>
                      </div>
                      <span className="rounded-full bg-sky-500/20 border border-sky-500/30 px-2.5 py-1 text-[10px] font-semibold text-sky-200">
                        Staff Pick
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* PRODUCTS SECTION INSIDE SAME CARD */}
          <section className="px-5 py-8 sm:px-7 sm:py-9 lg:px-9 lg:py-10">
            <div className="mb-6 flex flex-col gap-3 border-b border-slate-800/50 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400 sm:text-[11px]">
                  Snowboards Collection
                </h2>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Showing {products.length} products · Server‑rendered from Shopify Storefront API.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 transition hover:border-sky-500 hover:text-sky-200 sm:text-[13px]">
                  All styles
                </button>
                <button className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-400 transition hover:border-sky-500/60 hover:text-sky-200 sm:text-[13px]">
                  Freestyle
                </button>
                <button className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-400 transition hover:border-sky-500/60 hover:text-sky-200 sm:text-[13px]">
                  All‑Mountain
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div aria-label="Snowboards" className="grid gap-6 sm:gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {products.map(({ node: product }) => (
                <ProductCard key={product.id} product={product} dark={true} />
              ))}
            </div>

            {/* Footer with Pagination */}
            <div className="mt-10 flex flex-col gap-4 border-t border-slate-800/50 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Powered by{" "}
                <span className="font-semibold text-slate-300">Shopify Storefront API</span>. Cursor‑based
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
        </div>
      </div>
    </main>
  );
}

function LightLayout({ products, pageInfo }) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <HeroSlider theme="light" />

      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-slate-100 via-white to-slate-100" />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        
        {/* UNIFIED CARD SHELL - Bridge + Products in ONE */}
        <div className="rounded-3xl border border-slate-200 bg-white/95 shadow-sm shadow-slate-200 overflow-hidden">
          
          {/* BRIDGE SECTION INSIDE CARD */}
          <section className="border-b border-slate-100 px-5 py-8 sm:px-7 sm:py-9 lg:px-9 lg:py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
              {/* Text column */}
              <div className="max-w-2xl space-y-4 flex-1">
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.28em] text-slate-600 w-fit">
                  Winter 24 / 25 Collection
                </p>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                  Built for real lines,
                  <span className="block text-sky-600">not just the gram.</span>
                </h2>

                <p className="text-xs sm:text-sm leading-relaxed text-slate-600 max-w-lg">
                  A tight edit of boards, tuned for park laps, side‑country missions
                  and everything in between. Free returns, fast shipping, and gear
                  that&apos;s actually in stock.
                </p>

                <dl className="mt-2 grid grid-cols-2 gap-3 text-[11px] sm:text-xs text-slate-600 max-w-md">
                  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
                    <dt className="font-semibold text-slate-800">48‑hour shipping</dt>
                    <dd className="mt-1 text-[10px] sm:text-[11px] text-slate-500 leading-tight">
                      From our EU &amp; US warehouses.
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
                    <dt className="font-semibold text-slate-800">Rider‑tested</dt>
                    <dd className="mt-1 text-[10px] sm:text-[11px] text-slate-500 leading-tight">
                      Every deck vetted by real riders.
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Small highlight card - aligned to top */}
              <div className="hidden sm:block min-w-[240px] max-w-xs flex-shrink-0">
                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-500 via-cyan-400 to-slate-900 p-[1px] shadow-lg shadow-sky-500/20 h-full">
                  <div className="flex flex-col justify-between rounded-[18px] bg-slate-950 px-5 py-5 text-slate-100 h-full min-h-[260px]">
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-sky-300">
                        Editors' Pick
                      </p>
                      <h3 className="text-base font-bold leading-snug">
                        Ghost Line 158 All‑Mountain
                      </h3>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Damp, stable and still playful. Our go‑to for 90% of days on
                        the hill.
                      </p>
                    </div>
                    <div className="mt-auto pt-4 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400 font-medium">
                          From
                        </p>
                        <p className="text-2xl font-bold text-white mt-0.5">$549</p>
                      </div>
                      <span className="rounded-full bg-sky-500/20 border border-sky-500/30 px-2.5 py-1 text-[10px] font-semibold text-sky-200">
                        Staff Pick
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* PRODUCTS SECTION INSIDE SAME CARD */}
          <section className="px-5 py-8 sm:px-7 sm:py-9 lg:px-9 lg:py-10">
            <div className="mb-6 flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500 sm:text-[11px]">
                  Snowboards Collection
                </h2>
                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Showing {products.length} products · Server‑rendered from Shopify Storefront API.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 transition hover:border-slate-300 hover:bg-white sm:text-[13px]">
                  All styles
                </button>
                <button className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 transition hover:border-slate-300 hover:bg-white sm:text-[13px]">
                  Freestyle
                </button>
                <button className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 transition hover:border-slate-300 hover:bg-white sm:text-[13px]">
                  All‑Mountain
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div aria-label="Snowboards" className="grid gap-6 sm:gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {products.map(({ node: product }) => (
                <ProductCard key={product.id} product={product} dark={false} />
              ))}
            </div>

            {/* Footer with Pagination */}
            <div className="mt-10 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-400">
                Powered by{" "}
                <span className="font-semibold text-slate-700">Shopify Storefront API</span>. Cursor‑based
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
        </div>
      </div>
    </main>
  );
}

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

  const footerBorder = dark ? "border-slate-800" : "border-slate-100";
  const footerText = dark ? "text-slate-500" : "text-slate-400";
  const footerBrand = dark ? "text-slate-300" : "text-slate-700";

  return (
    <section className={cardShellClasses}>
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

      {/* Products Grid */}
      <div aria-label="Snowboards" className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {products.map(({ node: product }) => (
          <ProductCard key={product.id} product={product} dark={dark} />
        ))}
      </div>

      {/* Footer with Pagination */}
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


  let theme = "dark"; 
  try {
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie") || "";
    const themeMatch = cookieHeader.match(/theme=([^;]+)/);
    if (themeMatch && (themeMatch[1] === "light" || themeMatch[1] === "dark")) {
      theme = themeMatch[1];
    }
  } catch (e) {

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