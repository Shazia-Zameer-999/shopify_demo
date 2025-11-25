// "use client";

// import Link from "next/link";
// import { usePathname, useSearchParams, useRouter } from "next/navigation";
// import { useState } from "react";
// // import SearchBar from "./SearchBar";

// export default function Header() {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [menuOpen, setMenuOpen] = useState(false);

//   const currentTheme = searchParams.get("theme") === "light" ? "light" : "dark"; // default dark
//   const isDark = currentTheme === "dark";

//   function toggleTheme() {
//     const params = new URLSearchParams(searchParams.toString());

//     params.set("theme", isDark ? "light" : "dark");

//     const qs = params.toString();
//     const url = qs ? `${pathname}?${qs}` : pathname;
//     router.push(url);
//   }

//   function navUrl(path) {
//     const params = new URLSearchParams(searchParams.toString());
//     const qs = params.toString();
//     return qs ? `${path}?${qs}` : path;
//   }

//   return (
//     <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-sm">
//       <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
//         {/* Logo */}
//         <Link
//           href={navUrl("/")}
//           className="text-base font-semibold tracking-tight text-slate-100 sm:text-lg"
//         >
//           Snowboard Store 🏂
//         </Link>

//         {/* Desktop: right side */}
//         <div className="ml-auto hidden items-center gap-3 sm:flex">
//           {/* Optional search */}
//           {/* <div className="hidden flex-1 max-w-md md:block">
//             <SearchBar />
//           </div> */}

//           {/* Theme toggle */}
//           <button
//             type="button"
//             onClick={toggleTheme}
//             className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] font-medium text-slate-200 shadow-sm shadow-slate-900/60 hover:border-sky-400 hover:text-sky-200 transition"
//           >
//             {isDark ? (
//               <>
//                 <span className="text-xs">☀️</span>
//                 <span>Light mode</span>
//               </>
//             ) : (
//               <>
//                 <span className="text-xs">🌙</span>
//                 <span>Dark mode</span>
//               </>
//             )}
//           </button>

//           {/* Cart */}
//           <Link
//             href={navUrl("/cart")}
//             className="inline-flex items-center gap-1 rounded-full bg-sky-500 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-sm shadow-sky-500/60 hover:bg-sky-400"
//           >
//             🛒 Cart
//           </Link>
//         </div>

//         {/* Mobile: theme + hamburger */}
//         <div className="ml-auto flex items-center gap-2 sm:hidden">
//           <button
//             type="button"
//             onClick={toggleTheme}
//             className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-[11px] font-medium text-slate-200 shadow-sm shadow-slate-900/60 hover:border-sky-400 hover:text-sky-200 transition"
//           >
//             {isDark ? "☀️" : "🌙"}
//           </button>

//           <button
//             type="button"
//             onClick={() => setMenuOpen((o) => !o)}
//             className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-slate-200 shadow-sm shadow-slate-900/60 hover:border-sky-400 hover:text-sky-200 transition"
//             aria-label="Toggle navigation"
//           >
//             <span className="sr-only">Toggle navigation</span>
//             <span className="flex flex-col gap-[3px]">
//               <span
//                 className={`h-[2px] w-4 rounded-full bg-current transition-transform ${
//                   menuOpen ? "translate-y-[5px] rotate-45" : ""
//                 }`}
//               />
//               <span
//                 className={`h-[2px] w-4 rounded-full bg-current transition-opacity ${
//                   menuOpen ? "opacity-0" : "opacity-100"
//                 }`}
//               />
//               <span
//                 className={`h-[2px] w-4 rounded-full bg-current transition-transform ${
//                   menuOpen ? "-translate-y-[5px] -rotate-45" : ""
//                 }`}
//               />
//             </span>
//           </button>
//         </div>
//       </div>

//       {/* Mobile dropdown */}
//       <div
//         className={`sm:hidden transition-[max-height,opacity,transform] duration-250 ease-out ${
//           menuOpen ? "max-h-80 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-1"
//         } overflow-hidden`}
//       >
//         <div className="mx-auto max-w-6xl px-4 pb-3 sm:px-6 lg:px-8">
//           <nav className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/95 px-4 py-3 text-sm text-slate-100 shadow-lg shadow-slate-950/80">
//             {/* Primary links */}
//             <Link
//               href={navUrl("/")}
//               onClick={() => setMenuOpen(false)}
//               className="flex items-center justify-between rounded-xl px-2 py-2 hover:bg-slate-900/80"
//             >
//               <span>Shop boards</span>
//               <span className="text-xs text-slate-500">Home</span>
//             </Link>

//             <Link
//               href={navUrl("/cart")}
//               onClick={() => setMenuOpen(false)}
//               className="flex items-center justify-between rounded-xl px-2 py-2 hover:bg-slate-900/80"
//             >
//               <span>Cart</span>
//               <span className="text-xs text-slate-500">View items</span>
//             </Link>

//             {/* Extra nav items (placeholders for now) */}
//             <button
//               type="button"
//               className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-left text-slate-300 hover:bg-slate-900/80"
//             >
//               <span>Size guide</span>
//               <span className="text-xs text-slate-500">Find your length</span>
//             </button>

//             <button
//               type="button"
//               className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-left text-slate-300 hover:bg-slate-900/80"
//             >
//               <span>Support</span>
//               <span className="text-xs text-slate-500">FAQs &amp; contact</span>
//             </button>

//             {/* Divider + quick meta */}
//             <div className="mt-2 border-t border-slate-800 pt-2 text-[11px] text-slate-500">
//               <p className="flex items-center justify-between">
//                 <span>Winter 24 / 25 collection</span>
//                 <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300 border border-emerald-400/30">
//                   Live stock
//                 </span>
//               </p>
//             </div>
//           </nav>
//         </div>
//       </div>
//     </header>
//   );
// }

// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { getCookie, setCookie, THEME_COOKIE } from "../utils/storage.client";
// import SearchBar from "./SearchBar";

// export default function Header() {
//   const router = useRouter();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [theme, setTheme] = useState("dark"); // default theme
//   const [mounted, setMounted] = useState(false);

//   // On mount (client-only), read theme from cookie
//   useEffect(() => {
//     const stored = getCookie(THEME_COOKIE);
//     if (stored === "light" || stored === "dark") {
//       setTheme(stored);
//     }
//     setMounted(true);
//   }, []);

//   // Don't render until we've read the cookie (avoids flash)
//   if (!mounted) return null;

//   const isDark = theme === "dark";

//   function toggleTheme() {
//     const next = isDark ? "light" : "dark";
//     setTheme(next);           // Update local state
//     setCookie(THEME_COOKIE, next); // Save to cookie
//     router.refresh();         // Tell Next.js to re-render server components
//   }

//   return (
//     <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-sm">
//       <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
//         {/* Logo */}
//         <Link
//           href="/"
//           className="text-base font-semibold tracking-tight text-slate-100 sm:text-lg"
//         >
//           Snowboard Store 
//         </Link>

//         {/* Search bar - hidden on mobile, shown on md+ */}
//         <div className="hidden flex-1 max-w-md md:block">
//           <SearchBar />
//         </div>

//         {/* Desktop: theme + cart */}
//         <div className="ml-auto hidden items-center gap-3 sm:flex">
//           <button
//             type="button"
//             onClick={toggleTheme}
//             className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] font-medium text-slate-200 shadow-sm shadow-slate-900/60 hover:border-sky-400 hover:text-sky-200 transition"
//           >
//             {isDark ? (
//               <>
//                 <span className="text-xs">☀️</span>
//                 <span>Light mode</span>
//               </>
//             ) : (
//               <>
//                 <span className="text-xs">🌙</span>
//                 <span>Dark mode</span>
//               </>
//             )}
//           </button>

//           <Link
//             href="/cart"
//             className="inline-flex items-center gap-1 rounded-full bg-sky-500 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-sm shadow-sky-500/60 hover:bg-sky-400"
//           >
//             🛒 Cart
//           </Link>
//         </div>

//         {/* Mobile: theme + hamburger */}
//         <div className="ml-auto flex items-center gap-2 sm:hidden">
//           <button
//             type="button"
//             onClick={toggleTheme}
//             className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-[11px] font-medium text-slate-200 shadow-sm shadow-slate-900/60 hover:border-sky-400 hover:text-sky-200 transition"
//           >
//             {isDark ? "☀️" : "🌙"}
//           </button>

//           <button
//             type="button"
//             onClick={() => setMenuOpen((o) => !o)}
//             className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-slate-200 shadow-sm shadow-slate-900/60 hover:border-sky-400 hover:text-sky-200 transition"
//             aria-label="Toggle navigation"
//           >
//             <span className="sr-only">Toggle navigation</span>
//             <span className="flex flex-col gap-[3px]">
//               <span
//                 className={`h-[2px] w-4 rounded-full bg-current transition-transform ${menuOpen ? "translate-y-[5px] rotate-45" : ""
//                   }`}
//               />
//               <span
//                 className={`h-[2px] w-4 rounded-full bg-current transition-opacity ${menuOpen ? "opacity-0" : "opacity-100"
//                   }`}
//               />
//               <span
//                 className={`h-[2px] w-4 rounded-full bg-current transition-transform ${menuOpen ? "-translate-y-[5px] -rotate-45" : ""
//                   }`}
//               />
//             </span>
//           </button>
//         </div>
//       </div>

//       {/* Mobile dropdown */}
//       <div
//         className={`sm:hidden transition-[max-height,opacity,transform] duration-250 ease-out ${menuOpen ? "max-h-80 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-1"
//           } overflow-hidden`}
//       >
//         <div className="mx-auto max-w-6xl px-4 pb-3 sm:px-6 lg:px-8">
//           <nav className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/95 px-4 py-3 text-sm text-slate-100 shadow-lg shadow-slate-950/80">
//             <Link
//               href="/"
//               onClick={() => setMenuOpen(false)}
//               className="flex items-center justify-between rounded-xl px-2 py-2 hover:bg-slate-900/80"
//             >
//               <span>Shop boards</span>
//               <span className="text-xs text-slate-500">Home</span>
//             </Link>

//             <Link
//               href="/cart"
//               onClick={() => setMenuOpen(false)}
//               className="flex items-center justify-between rounded-xl px-2 py-2 hover:bg-slate-900/80"
//             >
//               <span>Cart</span>
//               <span className="text-xs text-slate-500">View items</span>
//             </Link>

//             <button
//               type="button"
//               className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-left text-slate-300 hover:bg-slate-900/80"
//             >
//               <span>Size guide</span>
//               <span className="text-xs text-slate-500">Find your length</span>
//             </button>

//             <button
//               type="button"
//               className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-left text-slate-300 hover:bg-slate-900/80"
//             >
//               <span>Support</span>
//               <span className="text-xs text-slate-500">FAQs &amp; contact</span>
//             </button>

//             <div className="mt-2 border-t border-slate-800 pt-2 text-[11px] text-slate-500">
//               <p className="flex items-center justify-between">
//                 <span>Winter 24 / 25 collection</span>
//                 <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300 border border-emerald-400/30">
//                   Live stock
//                 </span>
//               </p>
//             </div>
//           </nav>
//         </div>
//       </div>
//     </header>
//   );
// }

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCookie, setCookie, THEME_COOKIE } from "../utils/storage.client";
import SearchBar from "./SearchBar";

export default function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = getCookie(THEME_COOKIE);
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    }
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  function toggleTheme() {
    const next = isDark ? "light" : "dark";
    setTheme(next);
    setCookie(THEME_COOKIE, next);
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/95 backdrop-blur-md">
      {/* Main header row */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left: Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-100 whitespace-nowrap"
          >
            <span className="text-2xl">🏂</span>
            <span className="hidden sm:inline">Snowboard Store</span>
            <span className="sm:hidden">Snow</span>
          </Link>

          {/* Center: Search (desktop) */}
          <div className="hidden flex-1 max-w-2xl md:block">
            <SearchBar />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Search toggle (mobile) */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-slate-200 shadow-sm hover:border-sky-400 hover:text-sky-200 transition"
              aria-label="Search"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-200 shadow-sm hover:border-sky-400 hover:text-sky-200 transition"
            >
              <span className="text-sm">{isDark ? "☀️" : "🌙"}</span>
              <span className="hidden lg:inline">{isDark ? "Light" : "Dark"}</span>
            </button>

            {/* Mobile theme (icon only) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="sm:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-slate-200 shadow-sm hover:border-sky-400 hover:text-sky-200 transition"
              aria-label="Toggle theme"
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 rounded-full bg-sky-500 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-lg shadow-sky-500/50 hover:bg-sky-400 transition"
            >
              <span className="text-sm">🛒</span>
              <span className="hidden sm:inline">Cart</span>
            </Link>

            {/* Hamburger menu (mobile) */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-slate-200 shadow-sm hover:border-sky-400 hover:text-sky-200 transition"
              aria-label="Menu"
            >
              <span className="flex flex-col gap-[3px]">
                <span
                  className={`h-[2px] w-4 rounded-full bg-current transition-transform ${
                    menuOpen ? "translate-y-[5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-[2px] w-4 rounded-full bg-current transition-opacity ${
                    menuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`h-[2px] w-4 rounded-full bg-current transition-transform ${
                    menuOpen ? "-translate-y-[5px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile search bar (slides down) */}
        {searchOpen && (
          <div className="md:hidden pb-3 pt-1 animate-in slide-in-from-top-2 duration-200">
            <SearchBar />
          </div>
        )}
      </div>

      {/* Mobile navigation menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-out ${
          menuOpen
            ? "max-h-96 opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2"
        } overflow-hidden`}
      >
        <div className="mx-auto max-w-7xl px-4 pb-4">
          <nav className="space-y-1 rounded-2xl border border-slate-800 bg-slate-950/95 p-3 shadow-2xl shadow-slate-950/80">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-900/80 transition"
            >
              <span>Shop Boards</span>
              <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/cart"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-900/80 transition"
            >
              <span>Shopping Cart</span>
              <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <div className="my-2 border-t border-slate-800" />

            <button
              type="button"
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-900/80 transition"
            >
              <span>Size Guide</span>
              <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              type="button"
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-900/80 transition"
            >
              <span>Support & FAQs</span>
              <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="mt-3 rounded-xl bg-slate-900/60 px-3 py-2 border border-slate-800/50">
              <p className="flex items-center justify-between text-xs text-slate-400">
                <span>Winter 24/25 Collection</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-300 border border-emerald-400/30">
                  In Stock
                </span>
              </p>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}