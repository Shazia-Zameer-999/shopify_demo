"use client";

import { useState } from "react";
import { getCookie, THEME_COOKIE } from "@/utils/storage.client.js";
import { getCartId, setCartId } from "@/utils/storage.client.js";

export default function AddToCart({ variantId }) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  
  const theme = getCookie(THEME_COOKIE) || "dark";
  const isDark = theme === "dark";

  async function handleAction(action) {
    if (action === "buyNow") {
      setIsBuyingNow(true);
    } else {
      setIsAddingToCart(true);
    }

    try {
      if (action === "buyNow") {
        const temp = await createNewCart(variantId, { saveCart: false });
        window.location.href = temp.cart.checkoutUrl;
        return;
      }

      const existingCartId = getCartId();

      let resultCart;
      if (existingCartId) {
        resultCart = await addItemToExistingCart(existingCartId, variantId, {
          saveCart: true,
        });
      } else {
        resultCart = await createNewCart(variantId, { saveCart: true });
      }

      alert("Added to cart!");
    } catch (err) {
      console.error("❌ Cart error:", err);
      alert("Something went wrong. Check console for details.");
    } finally {
      if (action === "buyNow") {
        setIsBuyingNow(false);
      } else {
        setIsAddingToCart(false);
      }
    }
  }


  async function createNewCart(variantId, { saveCart = true } = {}) {
    const query = `mutation cartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart { id checkoutUrl }
      }
    }`;

    const data = await shopifyFetch(query, {
      lines: [{ merchandiseId: variantId, quantity: 1 }],
    });


    if (
      saveCart &&
      data &&
      data.cartCreate &&
      data.cartCreate.cart &&
      data.cartCreate.cart.id
    ) {
      setCartId(data.cartCreate.cart.id);

      const saved = getCartId();
    }

    return data.cartCreate;
  }

  async function addItemToExistingCart(
    cartId,
    variantId,
    { saveCart = true } = {},
  ) {
    const query = `mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { id checkoutUrl }
      }
    }`;

    const data = await shopifyFetch(query, {
      cartId,
      lines: [{ merchandiseId: variantId, quantity: 1 }],
    });


    if (
      saveCart &&
      data &&
      data.cartLinesAdd &&
      data.cartLinesAdd.cart &&
      data.cartLinesAdd.cart.id
    ) {
      setCartId(data.cartLinesAdd.cart.id);
    }

    return data.cartLinesAdd;
  }

  async function shopifyFetch(query, variables) {
    const response = await fetch(
      `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token":
            process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        },
        body: JSON.stringify({ query, variables }),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Shopify fetch failed: ${response.status} ${text}`);
    }

    const json = await response.json();

    if (json.errors && json.errors.length) {
      console.error("GraphQL errors:", json.errors);
      throw new Error(json.errors.map((e) => e.message).join(" | "));
    }

    return json.data;
  }

  const primaryBase = `
    group/btn relative w-full overflow-hidden rounded-full px-8 py-3.5 
    text-sm sm:text-base font-semibold 
    flex items-center justify-center gap-2 
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
    transition-all duration-300
    hover:-translate-y-0.5 hover:scale-[1.02]
    active:translate-y-0 active:scale-100
    disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100
  `;

  const secondaryBase = `
    group/btn relative w-full overflow-hidden rounded-full px-8 py-3 
    text-sm sm:text-base font-semibold 
    flex items-center justify-center gap-2 
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
    transition-all duration-300
    hover:-translate-y-0.5 hover:scale-[1.02]
    active:translate-y-0 active:scale-100
    disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100
  `;

  const primaryColors = isDark
    ? "bg-white text-slate-900 shadow-[0_14px_45px_rgba(56,189,248,0.55)] hover:shadow-[0_20px_60px_rgba(56,189,248,0.7)] focus-visible:ring-sky-400 focus-visible:ring-offset-slate-950"
    : "bg-slate-900 text-white shadow-[0_14px_45px_rgba(15,23,42,0.35)] hover:shadow-[0_20px_60px_rgba(15,23,42,0.5)] focus-visible:ring-sky-500 focus-visible:ring-offset-slate-50";

  const secondaryColors = isDark
    ? "border border-sky-500/80 bg-sky-500 text-slate-950 shadow-[0_12px_35px_rgba(56,189,248,0.65)] hover:bg-sky-400 hover:border-sky-400 hover:shadow-[0_18px_50px_rgba(56,189,248,0.8)] focus-visible:ring-sky-400 focus-visible:ring-offset-slate-950"
    : "border border-sky-600 bg-sky-600 text-white shadow-[0_12px_35px_rgba(37,99,235,0.6)] hover:bg-sky-500 hover:border-sky-500 hover:shadow-[0_18px_50px_rgba(37,99,235,0.75)] focus-visible:ring-sky-500 focus-visible:ring-offset-slate-50";

  return (
    <div className="mt-6 flex flex-col gap-3">
      {/* Add to Cart */}
      <button
        type="button"
        onClick={() => handleAction("addToCart")}
        disabled={isAddingToCart}
        className={`${primaryBase} ${primaryColors}`}
      >
        {/* Animated radial glow background */}
        <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.4),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(59,130,246,0.4),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100" />
        
        {/* Pulse ring on hover */}
        <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-sky-400/0 transition-all duration-300 group-hover/btn:ring-sky-400/50 group-hover/btn:scale-105" />
        
        {/* Button content */}
        <span className="relative flex items-center gap-2">
          {isAddingToCart ? (
            <>
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg className="h-5 w-5 transition-transform duration-300 group-hover/btn:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </>
          )}
        </span>
      </button>

      {/* Buy Now */}
      <button
        type="button"
        onClick={() => handleAction("buyNow")}
        disabled={isBuyingNow}
        className={`${secondaryBase} ${secondaryColors}`}
      >
        {/* Sweep sheen animation - moves across button */}
        <span className="pointer-events-none absolute inset-0 -translate-x-full rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)] transition-transform duration-700 group-hover/btn:translate-x-full" />
        
        {/* Glow effect */}
        <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 blur-sm transition-opacity duration-300 group-hover/btn:opacity-100" />
        
        {/* Button content */}
        <span className="relative flex items-center gap-2">
          {isBuyingNow ? (
            <>
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Redirecting...
            </>
          ) : (
            <>
              <svg className="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span>Buy Now</span>
              <span className="text-xs opacity-80 transition-opacity duration-300 group-hover/btn:opacity-100">– Express checkout</span>
            </>
          )}
        </span>
      </button>
    </div>
  );
}