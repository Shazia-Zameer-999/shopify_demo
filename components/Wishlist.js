"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCookie, THEME_COOKIE } from "@/utils/storage.client.js";

export default function WishlistPage({ theme: initialTheme }) {
  const router = useRouter();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const [theme, setTheme] = useState(initialTheme || "dark");
  const [mounted, setMounted] = useState(false);

  // Initialize theme and wishlist on mount
  useEffect(() => {
    const stored = getCookie(THEME_COOKIE);
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    }
    loadWishlist();
    setMounted(true);
  }, []);

  // Listen for real-time theme changes from Header
  useEffect(() => {
    const handleThemeChange = () => {
      const stored = getCookie(THEME_COOKIE);
      if (stored === "light" || stored === "dark") {
        setTheme(stored);
      }
    };

    // Listen for custom theme change event
    window.addEventListener("themeChange", handleThemeChange);
    
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, []); // Empty dependency array - listener stays active

  // Better approach: Use MutationObserver to detect cookie changes
  useEffect(() => {
    const checkThemeChange = () => {
      const stored = getCookie(THEME_COOKIE);
      if (stored === "light" || stored === "dark") {
        setTheme(stored);
      }
    };

    // Check theme every 500ms (lightweight polling)
    const interval = setInterval(checkThemeChange, 100);
    
    return () => clearInterval(interval);
  }, []);

  function loadWishlist() {
    try {
      const stored = localStorage.getItem("wishlist");
      const items = stored ? JSON.parse(stored) : [];
      setWishlist(items);
      setLoading(false);
    } catch (error) {
      console.error("Error loading wishlist:", error);
      setWishlist([]);
      setLoading(false);
    }
  }

  function removeFromWishlist(productId) {
    setRemoving(productId);
    
    setTimeout(() => {
      try {
        const updated = wishlist.filter((item) => item.id !== productId);
        localStorage.setItem("wishlist", JSON.stringify(updated));
        setWishlist(updated);
        
        window.dispatchEvent(
          new CustomEvent("wishlistUpdated", {
            detail: { message: "Item removed from wishlist!" },
          })
        );
      } catch (error) {
        console.error("Error removing from wishlist:", error);
      } finally {
        setRemoving(null);
      }
    }, 300);
  }

  async function addToCart(product) {
    setAddingToCart(product.id);
    
    try {
      const cartId = localStorage.getItem("shopify_cart_id");
      
      if (!cartId) {
        console.error("No cart ID found");
        setAddingToCart(null);
        return;
      }

      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId,
          merchandiseId: product.variantId,
          quantity: 1,
        }),
      });

      if (response.ok) {
        window.dispatchEvent(
          new CustomEvent("cartUpdated", {
            detail: { message: "Added to cart!" },
          })
        );
        
        removeFromWishlist(product.id);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingToCart(null);
    }
  }

  function clearWishlist() {
    if (confirm("Are you sure you want to clear your entire wishlist? This cannot be undone.")) {
      localStorage.setItem("wishlist", JSON.stringify([]));
      setWishlist([]);
      
      window.dispatchEvent(
        new CustomEvent("wishlistUpdated", {
          detail: { message: "Wishlist cleared!" },
        })
      );
    }
  }

  if (!mounted || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === "dark" ? "bg-slate-950" : "bg-white"
      }`}>
        <div className="text-center">
          <div className={`inline-flex h-16 w-16 animate-spin rounded-full border-4 ${
            theme === "dark" 
              ? "border-slate-700 border-t-sky-500" 
              : "border-slate-200 border-t-sky-500"
          } mb-4`} />
          <p className={`text-lg ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
            Loading your wishlist...
          </p>
        </div>
      </div>
    );
  }
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      {/* Hero Section */}
      <div className={`relative overflow-hidden border-b ${
        isDark
          ? "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-slate-800"
          : "bg-gradient-to-b from-slate-100 via-white to-slate-50 border-slate-200"
      }`}>
        <div className={`absolute inset-0 ${
          isDark
            ? "bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.1),transparent_70%)]"
            : "bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.08),transparent_70%)]"
        }`} />
        
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center h-20 w-20 rounded-2xl border mb-6 shadow-xl ${
              isDark
                ? "bg-gradient-to-br from-rose-500/20 to-pink-500/20 border-rose-500/30 shadow-rose-500/20"
                : "bg-gradient-to-br from-rose-100 to-pink-100 border-rose-300/50 shadow-rose-200/30"
            }`}>
              <svg className={`h-10 w-10 ${isDark ? "text-rose-400" : "text-rose-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            
            <h1 className={`text-4xl font-black tracking-tight sm:text-5xl mb-4 ${
              isDark
                ? "text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300"
                : "text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700"
            }`}>
              My Wishlist
            </h1>
            
            <p className={`text-lg max-w-2xl mx-auto ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}>
              {wishlist.length === 0 
                ? "Your wishlist is empty. Start adding items you love!"
                : `You have ${wishlist.length} ${wishlist.length === 1 ? 'item' : 'items'} saved`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {wishlist.length === 0 ? (
          // Empty State
          <div className="text-center py-20">
            <div className={`inline-flex items-center justify-center h-32 w-32 rounded-full border mb-8 ${
              isDark
                ? "bg-slate-900/50 border-slate-800"
                : "bg-slate-100 border-slate-300"
            }`}>
              <svg className={`h-16 w-16 ${isDark ? "text-slate-600" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            
            <h2 className={`text-2xl font-bold mb-3 ${isDark ? "text-slate-200" : "text-slate-900"}`}>
              Your wishlist is empty
            </h2>
            <p className={`mb-8 max-w-md mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Discover amazing snowboards and gear, then save your favorites here for later!
            </p>
            
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-sky-500/50 hover:from-sky-400 hover:to-blue-500 hover:shadow-sky-400/60 hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <svg className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              <span>Start Shopping</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Action Bar */}
            <div className={`flex flex-col sm:flex-row items-center justify-between mb-8 pb-6 gap-4 border-b ${
              isDark ? "border-slate-800" : "border-slate-200"
            }`}>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Total: <span className={`text-lg font-bold ${isDark ? "text-slate-200" : "text-slate-900"}`}>{wishlist.length}</span> {wishlist.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              
              <button
                onClick={clearWishlist}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 group ${
                  isDark
                    ? "border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 hover:border-rose-500/50"
                    : "border-rose-300/50 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:border-rose-400"
                }`}
              >
                <svg className="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Clear All</span>
              </button>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className={`group relative rounded-2xl border overflow-hidden transition-all duration-300 ${
                    isDark
                      ? "border-slate-800/60 bg-slate-900/40 backdrop-blur-xl hover:border-sky-500/40 hover:shadow-xl hover:shadow-sky-500/20"
                      : "border-slate-200 bg-white/60 backdrop-blur-xl hover:border-sky-400/60 hover:shadow-lg hover:shadow-sky-400/20"
                  } hover:-translate-y-1 ${
                    removing === item.id ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                  }`}
                >
                  {/* Product Image */}
                  <Link href={`/product/${item.handle}`} className={`block relative aspect-square overflow-hidden ${
                    isDark ? "bg-slate-800/50" : "bg-slate-100"
                  }`}>
                    <Image
                      src={item.image || "/placeholder.png"}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    
                    {/* Overlay on hover */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      isDark
                        ? "bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"
                        : "bg-gradient-to-t from-slate-900/40 via-slate-900/10 to-transparent"
                    }`} />
                  </Link>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    disabled={removing === item.id}
                    className={`absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-xl shadow-lg transition-all duration-200 group/btn disabled:opacity-50 ${
                      isDark
                        ? "border-slate-700/50 bg-slate-900/80 text-slate-300 hover:border-rose-500/50 hover:bg-rose-500/20 hover:text-rose-300"
                        : "border-slate-300/50 bg-white/80 text-slate-600 hover:border-rose-400/50 hover:bg-rose-100 hover:text-rose-600"
                    }`}
                  >
                    <svg className="h-4.5 w-4.5 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Product Info */}
                  <div className="p-5">
                    <Link href={`/product/${item.handle}`}>
                      <h3 className={`text-base font-bold mb-2 line-clamp-2 transition-colors ${
                        isDark
                          ? "text-slate-100 group-hover:text-sky-300"
                          : "text-slate-900 group-hover:text-sky-600"
                      }`}>
                        {item.title}
                      </h3>
                    </Link>
                    
                    {item.price && (
                      <p className="text-xl font-black bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent mb-4">
                        ${parseFloat(item.price).toFixed(2)}
                      </p>
                    )}

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => addToCart(item)}
                      disabled={addingToCart === item.id}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/50 hover:from-sky-400 hover:to-blue-500 hover:shadow-sky-400/60 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group/cart disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addingToCart === item.id ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          <span>Adding...</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-4.5 w-4.5 group-hover/cart:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className={`mt-12 pt-12 border-t text-center ${isDark ? "border-slate-800" : "border-slate-200"}`}>
              <p className={`mb-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Ready to shop for more?
              </p>
              <Link
                href="/"
                className={`inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-medium shadow-lg transition-all duration-200 group ${
                  isDark
                    ? "border-slate-700/60 bg-slate-900/60 text-slate-200 hover:border-sky-400/70 hover:bg-slate-800/80 hover:text-sky-300 hover:shadow-sky-500/30"
                    : "border-slate-300 bg-white text-slate-900 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600 hover:shadow-sky-200"
                }`}
              >
                <svg className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                <span>Continue Shopping</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

