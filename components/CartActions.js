// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function CartActions({ lineId, initialQuantity, cartId }) {
//   const [quantity, setQuantity] = useState(initialQuantity);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const router = useRouter();

//   async function updateQuantity(newQuantity) {
//     if (newQuantity < 1) return;
//     setIsUpdating(true);

//     const query = `
//       mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
//         cartLinesUpdate(cartId: $cartId, lines: $lines) {
//           cart { id }
//         }
//       }
//     `;

//     try {
//       await fetch(`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
//         },
//         body: JSON.stringify({
//           query,
//           variables: {
//             cartId,
//             lines: [{ id: lineId, quantity: newQuantity }],
//           },
//         }),
//       });

//       setQuantity(newQuantity);
//       router.refresh(); // Refresh server component data
//     } catch (error) {
//       console.error("Error updating quantity:", error);
//     } finally {
//       setIsUpdating(false);
//     }
//   }

//   async function removeLine() {
//     setIsUpdating(true);

//     const query = `
//       mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
//         cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
//           cart { id }
//         }
//       }
//     `;

//     try {
//       await fetch(`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
//         },
//         body: JSON.stringify({
//           query,
//           variables: { cartId, lineIds: [lineId] },
//         }),
//       });

//       router.refresh(); // Refresh server component data
//     } catch (error) {
//       console.error("Error removing item:", error);
//     } finally {
//       setIsUpdating(false);
//     }
//   }

//   return (
//     <div className="flex flex-col items-end gap-2">
//       {/* Quantity Controls */}
//       <div className="flex items-center gap-2">
//         <button
//           onClick={() => updateQuantity(quantity - 1)}
//           disabled={isUpdating || quantity <= 1}
//           className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 disabled:opacity-50"
//         >
//           −
//         </button>
//         <span className="w-8 text-center">{quantity}</span>
//         <button
//           onClick={() => updateQuantity(quantity + 1)}
//           disabled={isUpdating}
//           className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 disabled:opacity-50"
//         >
//           +
//         </button>
//       </div>

//       {/* Remove Button */}
//       <button
//         onClick={removeLine}
//         disabled={isUpdating}
//         className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
//       >
//         Remove
//       </button>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CartActions({ lineId, initialQuantity, cartId }) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const theme = searchParams.get("theme") === "light" ? "light" : "dark";
  const isDark = theme === "dark";

  async function updateQuantity(newQuantity) {
    if (newQuantity < 1) return;
    setIsUpdating(true);

    const query = `
      mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart { id }
        }
      }
    `;

    try {
      await fetch(
        `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token":
              process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
          },
          body: JSON.stringify({
            query,
            variables: {
              cartId,
              lines: [{ id: lineId, quantity: newQuantity }],
            },
          }),
        },
      );

      setQuantity(newQuantity);
      router.refresh();
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setIsUpdating(false);
    }
  }

  async function removeLine() {
    setIsUpdating(true);

    const query = `
      mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart { id }
        }
      }
    `;

    try {
      await fetch(
        `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token":
              process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
          },
          body: JSON.stringify({
            query,
            variables: { cartId, lineIds: [lineId] },
          }),
        },
      );

      router.refresh();
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setIsUpdating(false);
    }
  }

  // THEME‑AWARE STYLES
  const qtyShell =
    "inline-flex items-center rounded-full border px-1.5 py-1 text-[11px] sm:text-xs font-medium";
  const qtyColors = isDark
    ? "border-slate-700 bg-slate-950 text-slate-100"
    : "border-slate-200 bg-white text-slate-800";

  const qtyBtnBase =
    "h-6 w-6 flex items-center justify-center rounded-full text-xs font-semibold transition";
  const qtyBtnColors = isDark
    ? "hover:bg-slate-800 hover:text-slate-50"
    : "hover:bg-slate-100 hover:text-slate-900";

  const qtyValue =
    "mx-1.5 min-w-[1.8rem] text-center text-[11px] sm:text-xs";

  const removeBtnBase =
    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition";
  const removeColors = isDark
    ? "border-slate-700/80 bg-slate-950/80 text-slate-400 hover:border-red-500/80 hover:text-red-300 hover:bg-slate-900/90"
    : "border-slate-200 bg-slate-50 text-slate-500 hover:border-red-400 hover:text-red-500 hover:bg-red-50";

  const removeIcon =
    "h-3 w-3 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-[0_0_0_1px_rgba(239,68,68,0.65)]";

  return (
    <div className="flex flex-col items-end gap-2 text-[11px] sm:text-xs">
      {/* Quantity pill */}
      <div className={`${qtyShell} ${qtyColors}`}>
        <button
          type="button"
          onClick={() => updateQuantity(quantity - 1)}
          disabled={isUpdating || quantity <= 1}
          className={`${qtyBtnBase} ${qtyBtnColors} ${
            quantity <= 1 ? "opacity-40 cursor-not-allowed" : ""
          }`}
        >
          –
        </button>
        <span className={qtyValue}>{quantity}</span>
        <button
          type="button"
          onClick={() => updateQuantity(quantity + 1)}
          disabled={isUpdating}
          className={`${qtyBtnBase} ${qtyBtnColors}`}
        >
          +
        </button>
      </div>

      {/* Redesigned Remove pill */}
      <button
        type="button"
        onClick={removeLine}
        disabled={isUpdating}
        className={`${removeBtnBase} ${removeColors} ${
          isUpdating ? "opacity-60 cursor-wait" : ""
        }`}
      >
        <span className={removeIcon} />
        <span>Remove</span>
      </button>
    </div>
  );
}