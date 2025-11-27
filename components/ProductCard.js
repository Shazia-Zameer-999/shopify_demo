"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Add this function!
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

export default function ProductCard({ product, dark }) {
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        checkWishlist();
    }, [product.id]);

    // Listen for wishlist updates from other components
    useEffect(() => {
        const handleWishlistUpdate = () => {
            checkWishlist();
        };

        window.addEventListener("wishlistUpdated", handleWishlistUpdate);
        return () => window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
    }, []);

    function checkWishlist() {
        try {
            const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
            setIsInWishlist(wishlist.some((item) => item.id === product.id));
        } catch {
            setIsInWishlist(false);
        }
    }

    function toggleWishlist(e) {
        e.preventDefault();
        e.stopPropagation();

        try {
            const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
            const index = wishlist.findIndex((item) => item.id === product.id);

            if (index > -1) {
                wishlist.splice(index, 1);
                setIsInWishlist(false);
            } else {
                const price = parseFloat(product.priceRange.minVariantPrice.amount);
                wishlist.push({
                    id: product.id,
                    title: product.title,
                    handle: product.handle,
                    price: price,
                    image: product.featuredImage?.url || "/placeholder.png",
                    variantId: product.id,
                });
                setIsInWishlist(true);
            }

            localStorage.setItem("wishlist", JSON.stringify(wishlist));

            window.dispatchEvent(
                new CustomEvent("wishlistUpdated", {
                    detail: { message: isInWishlist ? "Removed from wishlist" : "Added to wishlist!" },
                })
            );
        } catch (error) {
            console.error("Error toggling wishlist:", error);
        }
    }

    if (!mounted) return null;

    const discount = getDiscount(product);
    const isOnSale = discount > 0;
    const price = parseFloat(product.priceRange.minVariantPrice.amount);
    const comparePrice = parseFloat(
        product.compareAtPriceRange?.minVariantPrice?.amount || 0
    );
    const currency = product.priceRange.minVariantPrice.currencyCode;

    const saleBadge = dark
        ? "bg-red-500/20 text-red-300 border-red-400/30"
        : "bg-red-50 text-red-600 border-red-200";

    const gridItemBorder = dark ? "border-slate-800 bg-slate-950/80" : "border-slate-200/80 bg-white";
    const gridShadow = dark
        ? "shadow-sm shadow-slate-900/80 hover:shadow-[0_18px_40px_rgba(8,47,73,0.9)]"
        : "shadow-sm shadow-slate-100 hover:shadow-lg hover:shadow-slate-200";
    const gridHoverBorder = dark ? "hover:border-sky-500/70" : "hover:border-slate-300";
    const titleColor = dark ? "text-slate-50" : "text-slate-900";
    const titleHover = dark ? "group-hover:text-sky-300" : "group-hover:text-sky-700";
    const metaColor = dark ? "text-slate-500" : "text-slate-400";
    const stockTint = dark ? "text-emerald-400" : "text-emerald-500";
    const stockMuted = dark ? "text-slate-500" : "text-slate-400";

    const ctaButton = dark
        ? "border border-sky-400/70 bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/60 hover:bg-sky-400 hover:border-sky-300 focus-visible:ring-sky-400 focus-visible:ring-offset-slate-950"
        : "border border-slate-900/10 bg-slate-900 text-white shadow-sm shadow-slate-900/20 hover:bg-sky-700 hover:border-sky-700 focus-visible:ring-sky-500 focus-visible:ring-offset-white";

    return (
        <Link href={`/products/${product.handle}`} className="group">
            <article
                className={`flex h-full flex-col overflow-hidden rounded-2xl border shadow-lg transition-all duration-300 hover:-translate-y-1 ${gridItemBorder} ${gridShadow} ${gridHoverBorder}`}
            >
                {/* Product Image */}
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

                    {/* Badges */}
                    <div className="absolute left-2 top-2 flex flex-col gap-1.5">
                        {!product.availableForSale && (
                            <span className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.22em] shadow-md ring-1 ring-red-500/10 ${dark ? "bg-red-900/60 text-red-200 border-red-500/30" : "bg-red-50 text-red-700 border-red-400"
                                }`}>
                                <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                                Sold Out
                            </span>
                        )}
                        {isOnSale && product.availableForSale && (
                            <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide shadow-sm ${saleBadge}`}>
                                {discount}% OFF
                            </span>
                        )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                        onClick={toggleWishlist}
                        className={`absolute right-2 top-2 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-xl transition-all duration-200 shadow-lg ${isInWishlist
                                ? dark
                                    ? "border-rose-500/50 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
                                    : "border-rose-400/60 bg-rose-50 text-rose-600 hover:bg-rose-100"
                                : dark
                                    ? "border-slate-700/50 bg-slate-900/80 text-slate-300 hover:border-rose-500/50 hover:bg-rose-500/20 hover:text-rose-300"
                                    : "border-slate-300/50 bg-white/80 text-slate-600 hover:border-rose-400/50 hover:bg-rose-100 hover:text-rose-600"
                            }`}
                        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <svg
                            className={`h-5 w-5 transition-transform duration-200 hover:scale-110 ${isInWishlist ? "fill-current" : ""}`}
                            fill={isInWishlist ? "currentColor" : "none"}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                    </button>

                    {/* Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/0 opacity-0 transition-all duration-300 group-hover:bg-slate-950/40 group-hover:opacity-100">
                        <span className={`rounded-full px-5 py-2.5 text-xs font-semibold shadow-lg transition-all duration-300 scale-95 group-hover:scale-100 ${dark
                                ? "bg-sky-500 text-slate-950 shadow-sky-500/50"
                                : "bg-sky-600 text-white shadow-sky-600/40"
                            }`}>
                            Quick View →
                        </span>
                    </div>

                    {/* Gradient */}
                    <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t ${dark ? "from-black/55 via-black/0 to-transparent" : "from-black/35 to-transparent"
                        }`} />
                </div>

                {/* Product Info */}
                <div className="flex flex-1 flex-col gap-2 p-4">
                    {product.vendor && (
                        <p className={`text-[10px] font-semibold uppercase tracking-wider ${metaColor}`}>
                            {product.vendor}
                        </p>
                    )}

                    <h3 className={`line-clamp-2 text-base font-semibold leading-snug transition-colors ${titleColor} ${titleHover}`}>
                        {product.title}
                    </h3>

                    <p className={`text-[11px] uppercase tracking-[0.18em] ${metaColor}`}>
                        {product.productType || "All‑Mountain"} • Freestyle • Powder
                    </p>

                    <div className="mt-auto space-y-2">
                        <div className="flex items-baseline gap-2">
                            <span className={`text-lg font-bold ${dark ? "text-slate-200" : "text-slate-900"}`}>
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

                        <button
                            type="button"
                            className={`relative w-full overflow-hidden rounded-full px-4 py-2.5 text-xs font-semibold tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 group/btn ${ctaButton}`}
                        >
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

                <span className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </article>
        </Link>
    );
}


