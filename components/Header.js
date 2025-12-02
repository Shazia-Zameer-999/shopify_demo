"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { getCookie, setCookie, THEME_COOKIE } from "../utils/storage.client";
import { getCartId } from "../utils/storage.client";
import SearchBar from "./SearchBar";
import { useSession, signIn, signOut } from "next-auth/react";

const ANNOUNCEMENTS = [
  { text: "🎿 Winter Sale: Up to 40% off selected boards", highlight: "40% off" },
  { text: "🚚 Free shipping on orders over $99", highlight: "Free shipping" },
  { text: "⭐ New 2025 collection now available", highlight: "New 2025" },
  { text: "🎁 Sign up for 15% off your first order", highlight: "15% off" },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [showCartNotification, setShowCartNotification] = useState(false);

  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const userName = session?.user?.name || "Account";

const fetchCartCount = useCallback(async () => {
  try {
    const response = await fetch("/api/cart/count", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      setCartCount(0);
      return;
    }

    const data = await response.json();
    const totalItems =
      data.cart?.lines?.edges?.reduce(
        (sum, edge) => sum + (edge.node.quantity || 0),
        0,
      ) || 0;

    setCartCount(totalItems);
  } catch (error) {
    console.error("Error fetching cart count:", error);
    setCartCount(0);
  }
}, []);


  const fetchWishlistCount = useCallback(() => {
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlistCount(wishlist.length);
    } catch {
      setWishlistCount(0);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  

  // Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const stored = getCookie(THEME_COOKIE);
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    }
    setMounted(true);
    fetchCartCount();
    fetchWishlistCount();

    const handleCartUpdate = () => {
      fetchCartCount();
      setShowCartNotification(true);
      setTimeout(() => setShowCartNotification(false), 3000);
    };

    const handleWishlistUpdate = () => {
      fetchWishlistCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("wishlistUpdated", handleWishlistUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
    };
  }, [fetchCartCount, fetchWishlistCount]);

  useEffect(() => {
    const interval = setInterval(fetchCartCount, 3000);
    return () => clearInterval(interval);
  }, [fetchCartCount]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);
  

  if (!mounted) return null;

  const isDark = theme === "dark";

  function toggleTheme() {
    const next = isDark ? "light" : "dark";
    setTheme(next);
    setCookie(THEME_COOKIE, next);
    router.refresh();
  }
  

  return (
    <header className="sticky top-0 z-50">
      <div
        className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600 transition-all duration-150 z-[51]"
        style={{ width: `${scrollProgress}%` }}
      />

      {showCartNotification && (
        <div className="fixed top-20 right-4 z-[60] animate-in slide-in-from-top-5 fade-in duration-300">
          <div className="rounded-xl border border-emerald-400/50 bg-emerald-500/20 backdrop-blur-xl px-4 py-3 shadow-xl shadow-emerald-500/30">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/30">
                <svg className="h-4 w-4 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-100">Item added to cart!</p>
                <p className="text-xs text-emerald-200/80">Cart updated successfully</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

        <div className="relative mx-auto max-w-7xl px-4 py-2">
          <div className="flex items-center justify-between gap-4 text-xs">
            <div className="flex-1 flex items-center justify-center gap-2 overflow-hidden">
              <div
                key={currentAnnouncement}
                className="animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                <span className="text-slate-300">
                  {ANNOUNCEMENTS[currentAnnouncement].text.split(ANNOUNCEMENTS[currentAnnouncement].highlight)[0]}
                  <span className="font-bold text-sky-300">
                    {ANNOUNCEMENTS[currentAnnouncement].highlight}
                  </span>
                  {ANNOUNCEMENTS[currentAnnouncement].text.split(ANNOUNCEMENTS[currentAnnouncement].highlight)[1]}
                </span>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-4 text-slate-400">
              <button className="hover:text-sky-300 transition-colors flex items-center gap-1 group">
                <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>24/7 Support</span>
              </button>
              <span className="text-slate-600">|</span>
              <button className="hover:text-sky-300 transition-colors flex items-center gap-1 group">
                <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Store Locator</span>
              </button>
              <span className="text-slate-600">|</span>
              <select className="bg-transparent border-none text-xs cursor-pointer hover:text-sky-300 transition-colors focus:outline-none">
                <option value="USD">USD $</option>
                <option value="EUR">EUR €</option>
                <option value="GBP">GBP £</option>
                <option value="CAD">CAD $</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-slate-800/70 bg-gradient-to-b from-slate-950/98 via-slate-950/95 to-slate-950/90 backdrop-blur-xl shadow-xl shadow-black/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top bar */}
          <div className="flex h-20 items-center justify-between gap-4">
            {/* Left: Logo */}
            <Link
              href="/"
              className="group flex items-center gap-3 whitespace-nowrap"
              aria-label="Snowline Outfitters home"
            >
              <div
                className="relative flex h-12 w-12 items-center justify-center rounded-full
                           bg-gradient-to-br from-sky-400 via-sky-500 to-slate-900
                           shadow-xl shadow-sky-500/50 ring-2 ring-sky-400/60
                           transition-all duration-700 ease-out
                           group-hover:rotate-[360deg] group-hover:scale-110 group-hover:shadow-sky-400/70"
              >
                <div className="absolute inset-[3px] rounded-full bg-slate-950/90" />
                <svg
                  className="relative h-6 w-6 text-sky-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.9)]"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 22C7 19 11 18 16 18C21 18 25 19 28 22"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 21L14 9L18 15L22 11L26 19"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="22.5" cy="7.5" r="1.5" fill="currentColor" />
                </svg>
              </div>

              <div className="flex flex-col leading-tight">
                <span className="text-base font-bold tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-sky-300 to-blue-400">
                  Snowline
                </span>
                <span className="text-[0.7rem] font-medium text-slate-400 group-hover:text-sky-300 transition-colors tracking-wide">
                  Alpine Outfitters
                </span>
              </div>
            </Link>

            {/* Center: Search (desktop) */}
            <div className="hidden flex-1 max-w-2xl lg:block">
              <SearchBar />
            </div>

            {/* Right: Actions - FIXED RESPONSIVE CLASSES */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/50 bg-slate-900/60 text-slate-200 shadow-lg hover:border-sky-400/70 hover:bg-slate-800/80 hover:text-sky-300 hover:shadow-sky-500/30 transition-all duration-200"
                aria-label="Search"
              >
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Wishlist - Hidden on xs, shown from sm */}
              <button
                type="button"
                onClick={() => router.push('/wishlist')}
                className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/50 bg-slate-900/60 text-slate-200 shadow-lg hover:border-rose-400/70 hover:bg-slate-800/80 hover:text-rose-300 hover:shadow-rose-500/30 transition-all duration-200 relative group"
                aria-label="Wishlist"
              >
                <svg className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-slate-950 animate-pulse">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </button>

              {/* Account - Hidden on sm and below, shown from md */}
              {/* Account - Hidden on sm and below, shown from md */}
              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated) {
                    // Opens NextAuth sign-in (we'll customize providers/UI later)
                    signIn();
                  } else {
                    router.push("/account");
                  }
                }}
                className="hidden md:inline-flex items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-900/60 px-3 py-2 text-sm font-medium text-slate-200 shadow-lg hover:border-sky-400/70 hover:bg-slate-800/80 hover:text-sky-300 hover:shadow-sky-500/30 transition-all duration-200 group"
              >
                <svg className="h-4.5 w-4.5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden lg:inline">
                  {isAuthenticated ? userName : "Sign In"}
                </span>
              </button>
              {/* Sign Out - desktop only, visible when authenticated */}
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="hidden lg:inline-flex items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-900/60 px-3 py-2 text-sm font-medium text-slate-200 shadow-lg hover:border-rose-400/70 hover:bg-slate-800/80 hover:text-rose-300 hover:shadow-rose-500/30 transition-all duration-200 group"
                >
                  <svg
                    className="h-4.5 w-4.5 group-hover:scale-110 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H9m4 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                    />
                  </svg>
                  <span className="hidden xl:inline">Sign Out</span>
                  <span className="xl:hidden">Logout</span>
                </button>
              )}

              <button
                type="button"
                onClick={toggleTheme}
                className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/50 bg-slate-900/60 text-slate-200 shadow-lg hover:border-amber-400/70 hover:bg-slate-800/80 hover:text-amber-300 hover:shadow-amber-500/30 transition-all duration-200 group"
                aria-label="Toggle theme"
              >
                <span className="text-lg group-hover:scale-110 transition-transform">{isDark ? "☀️" : "🌙"}</span>
              </button>

              {/* Cart - Always visible */}
              <Link
                href="/cart"
                className="relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-xl shadow-sky-500/60 hover:from-sky-400 hover:to-blue-500 hover:shadow-sky-400/70 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sky-500/40 transition-all duration-200 group"
              >
                <svg className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-slate-950 animate-pulse">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Hamburger - ALWAYS VISIBLE ON MOBILE (hidden from md breakpoint) */}
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/50 bg-slate-900/60 text-slate-200 shadow-lg hover:border-sky-400/70 hover:bg-slate-800/80 hover:text-sky-300 transition-all duration-200"
                aria-label="Menu"
              >
                <span className="flex flex-col gap-[3.5px]">
                  <span
                    className={`h-[2.5px] w-5 rounded-full bg-current transition-all duration-300 ${menuOpen ? "translate-y-[6px] rotate-45" : ""
                      }`}
                  />
                  <span
                    className={`h-[2.5px] w-5 rounded-full bg-current transition-all duration-300 ${menuOpen ? "opacity-0 scale-75" : "opacity-100 scale-100"
                      }`}
                  />
                  <span
                    className={`h-[2.5px] w-5 rounded-full bg-current transition-all duration-300 ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""
                      }`}
                  />
                </span>
              </button>
            </div>
          </div>

          {/* Mobile search dropdown */}
          {searchOpen && (
            <div className="lg:hidden pb-4 animate-in slide-in-from-top-3 fade-in duration-300">
              <SearchBar />
            </div>
          )}

          <nav className="hidden md:flex items-center justify-between border-t border-slate-800/50 py-3">
            <div className="flex items-center gap-8">
              <div
                className="relative"
                onMouseEnter={() => setCategoriesOpen(true)}
                onMouseLeave={() => setCategoriesOpen(false)}
              >
                <button className="group relative flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-sky-300 transition-colors overflow-hidden rounded-lg px-3 py-2">
                  <span className="absolute inset-0 bg-gradient-to-r from-sky-500/0 via-sky-500/10 to-sky-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                  <svg className="relative h-4 w-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="relative">Categories</span>
                  <svg
                    className={`relative h-3.5 w-3.5 transition-all duration-300 ${categoriesOpen ? "rotate-180 text-sky-400" : ""
                      }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {categoriesOpen && (
                  <div className="absolute left-0 top-full pt-4 z-50">
                    <div className="w-[680px] rounded-2xl border border-slate-800/80 bg-slate-950/98 backdrop-blur-2xl shadow-2xl shadow-black/80 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
                      <div className="relative bg-gradient-to-r from-sky-500/10 via-blue-500/10 to-purple-500/10 border-b border-slate-800/60 px-7 py-4">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.1),transparent_70%)]" />
                        <h2 className="relative text-sm font-bold text-slate-200">Shop by Category</h2>
                        <p className="relative text-xs text-slate-400 mt-0.5">Explore our complete collection</p>
                      </div>

                      <div className="p-7">
                        <div className="grid grid-cols-3 gap-8">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="h-1 w-1 rounded-full bg-sky-400 animate-pulse" />
                              <h3 className="text-xs font-black uppercase tracking-wider bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                                Snowboards
                              </h3>
                            </div>
                            <ul className="space-y-2.5">
                              {['All Mountain', 'Freestyle', 'Powder', 'Splitboards'].map((item, idx) => (
                                <li key={item}>
                                  <Link
                                    href="/"
                                    className="group/item relative flex items-center gap-3 px-3 py-2 rounded-lg overflow-hidden transition-all duration-300 hover:bg-sky-500/5"
                                  >
                                    <span className="absolute inset-0 bg-gradient-to-r from-sky-500/0 via-sky-500/20 to-sky-500/0 translate-x-[-100%] group-hover/item:translate-x-[100%] transition-transform duration-700" />

                                    <span className="relative flex h-6 w-6 items-center justify-center rounded-md bg-sky-500/10 border border-sky-500/20 group-hover/item:bg-sky-500/20 group-hover/item:border-sky-500/40 group-hover/item:scale-110 transition-all duration-300">
                                      <span className="text-xs font-bold text-sky-400">{idx + 1}</span>
                                    </span>

                                    <span className="relative text-sm text-slate-300 group-hover/item:text-sky-300 group-hover/item:translate-x-1 transition-all duration-300">
                                      {item}
                                    </span>

                                    <svg className="relative ml-auto h-3.5 w-3.5 text-slate-600 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 group-hover/item:text-sky-400 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                              <h3 className="text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                                Equipment
                              </h3>
                            </div>
                            <ul className="space-y-2.5">
                              {['Bindings', 'Boots', 'Helmets', 'Goggles'].map((item, idx) => (
                                <li key={item}>
                                  <Link
                                    href="/"
                                    className="group/item relative flex items-center gap-3 px-3 py-2 rounded-lg overflow-hidden transition-all duration-300 hover:bg-emerald-500/5"
                                  >
                                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 translate-x-[-100%] group-hover/item:translate-x-[100%] transition-transform duration-700" />

                                    <span className="relative flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 border border-emerald-500/20 group-hover/item:bg-emerald-500/20 group-hover/item:border-emerald-500/40 group-hover/item:scale-110 transition-all duration-300">
                                      <span className="text-xs font-bold text-emerald-400">{idx + 1}</span>
                                    </span>

                                    <span className="relative text-sm text-slate-300 group-hover/item:text-emerald-300 group-hover/item:translate-x-1 transition-all duration-300">
                                      {item}
                                    </span>

                                    <svg className="relative ml-auto h-3.5 w-3.5 text-slate-600 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 group-hover/item:text-emerald-400 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="h-1 w-1 rounded-full bg-purple-400 animate-pulse" />
                              <h3 className="text-xs font-black uppercase tracking-wider bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                                Apparel
                              </h3>
                            </div>
                            <ul className="space-y-2.5">
                              {['Jackets', 'Pants', 'Base Layers', 'Accessories'].map((item, idx) => (
                                <li key={item}>
                                  <Link
                                    href="/"
                                    className="group/item relative flex items-center gap-3 px-3 py-2 rounded-lg overflow-hidden transition-all duration-300 hover:bg-purple-500/5"
                                  >
                                    <span className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 translate-x-[-100%] group-hover/item:translate-x-[100%] transition-transform duration-700" />

                                    <span className="relative flex h-6 w-6 items-center justify-center rounded-md bg-purple-500/10 border border-purple-500/20 group-hover/item:bg-purple-500/20 group-hover/item:border-purple-500/40 group-hover/item:scale-110 transition-all duration-300">
                                      <span className="text-xs font-bold text-purple-400">{idx + 1}</span>
                                    </span>

                                    <span className="relative text-sm text-slate-300 group-hover/item:text-purple-300 group-hover/item:translate-x-1 transition-all duration-300">
                                      {item}
                                    </span>

                                    <svg className="relative ml-auto h-3.5 w-3.5 text-slate-600 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 group-hover/item:text-purple-400 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-7 pt-6 border-t border-slate-800/60">
                          <Link
                            href="/"
                            className="group/banner relative block rounded-xl bg-gradient-to-r from-sky-500/10 via-blue-500/10 to-purple-500/10 border border-sky-500/20 p-5 overflow-hidden transition-all duration-300 hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/20"
                          >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.15),transparent_70%)] opacity-0 group-hover/banner:opacity-100 transition-opacity duration-500" />

                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover/banner:translate-x-[100%] transition-transform duration-1000" />

                            <div className="relative flex items-center justify-between">
                              <div>
                                <p className="text-xs font-bold text-sky-300 mb-1 flex items-center gap-2">
                                  <span className="flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-sky-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400"></span>
                                  </span>
                                  Winter Collection 2025
                                </p>
                                <p className="text-xs text-slate-400 group-hover/banner:text-slate-300 transition-colors">
                                  Explore the latest gear & accessories
                                </p>
                              </div>
                              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold shadow-lg shadow-sky-500/50 group-hover/banner:shadow-xl group-hover/banner:shadow-sky-500/60 group-hover/banner:scale-105 transition-all">
                                <span>View All</span>
                                <svg className="h-3.5 w-3.5 group-hover/banner:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/" className="group relative text-sm font-medium text-slate-300 hover:text-sky-300 transition-colors overflow-hidden rounded-lg px-3 py-2 flex items-center gap-1.5">
                <span className="absolute inset-0 bg-gradient-to-r from-sky-500/0 via-sky-500/10 to-sky-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative">New Arrivals</span>
                <span className="relative opacity-0 group-hover:opacity-100 transition-opacity">✨</span>
              </Link>

              <Link href="/" className="group relative text-sm font-medium text-slate-300 hover:text-rose-300 transition-colors overflow-hidden rounded-lg px-3 py-2 flex items-center gap-2">
                <span className="absolute inset-0 bg-gradient-to-r from-rose-500/0 via-rose-500/10 to-rose-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative">Sale</span>
                <span className="relative inline-flex items-center rounded-full bg-gradient-to-r from-rose-500/20 to-pink-500/20 px-2.5 py-1 text-[10px] font-black text-rose-300 ring-1 ring-rose-400/40 animate-pulse">
                  -40%
                </span>
              </Link>

              <Link href="/" className="group relative text-sm font-medium text-slate-300 hover:text-sky-300 transition-colors overflow-hidden rounded-lg px-3 py-2">
                <span className="absolute inset-0 bg-gradient-to-r from-sky-500/0 via-sky-500/10 to-sky-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative">Brands</span>
              </Link>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/50 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-3.5 py-1.5 text-emerald-200 shadow-lg shadow-emerald-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="font-bold">Free shipping over $99</span>
              </span>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMenuOpen(false)}
            style={{
              animation: 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards'
            }}
          />

          <div
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-slate-950 z-50 md:hidden shadow-2xl shadow-black"
            style={{
              animation: 'slideInSmooth 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards'
            }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 p-4">
                <span className="text-lg font-bold text-slate-100">Menu</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 text-slate-200 hover:border-sky-400 hover:text-sky-300 transition-all duration-200 group"
                >
                  <svg className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2 scroll-smooth">
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-100 hover:bg-slate-900/80 transition-all duration-200 group"
                  style={{
                    animation: 'slideInItem 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                    animationDelay: '0.08s',
                    opacity: 0
                  }}
                >
                  <span>🏂 All Snowboards</span>
                  <svg className="h-4 w-4 text-slate-500 group-hover:translate-x-1 group-hover:text-slate-300 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-100 hover:bg-slate-900/80 transition-all duration-200 group"
                  style={{
                    animation: 'slideInItem 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                    animationDelay: '0.12s',
                    opacity: 0
                  }}
                >
                  <span>⭐ New Arrivals</span>
                  <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-300">NEW</span>
                </Link>

                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-100 hover:bg-slate-900/80 transition-all duration-200 group"
                  style={{
                    animation: 'slideInItem 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                    animationDelay: '0.16s',
                    opacity: 0
                  }}
                >
                  <span>🔥 Sale</span>
                  <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300">-40%</span>
                </Link>

                <div
                  className="my-3 border-t border-slate-800"
                  style={{
                    animation: 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                    animationDelay: '0.2s',
                    opacity: 0
                  }}
                />

                {/* Account Section */}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    router.push('/wishlist');
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-900/80 hover:text-rose-300 transition-all duration-200 group"
                  style={{
                    animation: 'slideInItem 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                    animationDelay: '0.24s',
                    opacity: 0
                  }}
                >
                  <span className="flex items-center gap-3">
                    <span>❤️</span>
                    <span>My Wishlist</span>
                  </span>
                  {wishlistCount > 0 && (
                    <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 ring-1 ring-rose-500/30 animate-pulse">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                <Link
                  href="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-slate-900/80 hover:text-sky-300 transition-all duration-200 group"
                  style={{
                    animation: 'slideInItem 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                    animationDelay: '0.28s',
                    opacity: 0
                  }}
                >
                  <span className="flex items-center gap-3">
                    <span>🛒</span>
                    <span>Shopping Cart</span>
                  </span>
                  {cartCount > 0 && (
                    <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-300 ring-1 ring-sky-500/30 animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <div
                  className="my-3 border-t border-slate-800"
                  style={{
                    animation: 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                    animationDelay: '0.32s',
                    opacity: 0
                  }}
                />

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    if (!isAuthenticated) {
                      signIn();
                    } else {
                      router.push("/account");
                    }
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-900/80 hover:text-sky-300 transition-all duration-200 group"
                  style={{
                    animation: 'slideInItem 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                    animationDelay: '0.36s',
                    opacity: 0
                  }}
                >
                  <svg className="h-4.5 w-4.5 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{isAuthenticated ? "Go to Account" : "Sign In / Register"}</span>
                </button>
                {/* Sign Out - mobile menu, only when authenticated */}
                {isAuthenticated && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-900/80 hover:text-rose-300 transition-all duration-200 group"
                    style={{
                      animation: 'slideInItem 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                      animationDelay: '0.40s',
                      opacity: 0
                    }}
                  >
                    <svg
                      className="h-4.5 w-4.5 group-hover:scale-110 transition-transform duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H9m4 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                      />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                )}

                {/* Theme Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    toggleTheme();
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-900/80 hover:text-amber-300 transition-all duration-200 group"
                  style={{
                    animation: 'slideInItem 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                    animationDelay: '0.4s',
                    opacity: 0
                  }}
                  aria-label="Toggle theme"
                >
                  <span className="text-lg group-hover:scale-125 transition-transform duration-200">{isDark ? "☀️" : "🌙"}</span>
                  <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
                </button>

                {/* Special Offer Banner */}
                <div
                  className="mt-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 p-4"
                  style={{
                    animation: 'slideInItem 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                    animationDelay: '0.44s',
                    opacity: 0
                  }}
                >
                  <p className="text-xs text-slate-400 mb-2">🎁 Special Offer</p>
                  <p className="text-sm font-medium text-slate-200 mb-3">Get 15% off your first order!</p>
                  <button className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-bold text-white hover:from-sky-400 hover:to-blue-500 shadow-lg shadow-sky-500/50 hover:shadow-sky-500/60 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                    Claim Discount
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}