import { getCartIdServer } from "@/utils/storage.server.js";
import Image from "next/image";
import Link from "next/link";
import CartActions from "@/components/CartActions";
import { headers } from "next/headers";

const GET_CART_QUERY = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      checkoutUrl
      estimatedCost {
        totalAmount { amount currencyCode }
      }
      lines(first: 10) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                title
                image { url altText }
                price { amount currencyCode }
                product { title handle }
              }
            }
          }
        }
      }
    }
  }
`;

async function fetchCart(cartId) {

  const url = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token":
        process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query: GET_CART_QUERY, variables: { cartId } }),
    cache: "no-store",
  });

  const json = await response.json();


  if (json.errors) {
    console.error("❌ GraphQL errors:", json.errors);
  }

  return json.data;
}

// Main Server Component
export default async function CartPage() {
  let theme = "dark"; // default
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

  const cartId = await getCartIdServer();

  const pageBg = isDark
    ? "bg-slate-950 text-slate-50"
    : "bg-slate-50 text-slate-900";

  const emptyText = isDark ? "text-slate-400" : "text-slate-500";
  const emptyBtn =
    "inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-sky-500/40 hover:bg-sky-400 transition";

  // Reusable empty state
  const EmptyCart = () => (
    <main className={`min-h-screen ${pageBg}`}>
      {isDark ? (
        <>
          <div className="pointer-events-none fixed inset-0 -z-20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900" />
          <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),transparent_55%)]" />
        </>
      ) : (
        <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-slate-100 via-white to-slate-100" />
      )}

      <div className="mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-4 text-center sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
          Your cart
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Nothing riding with you yet.
        </h1>
        <p className={`mt-3 max-w-md text-sm sm:text-base ${emptyText}`}>
          When you add a board, you&apos;ll see live pricing, tax, and shipping
          here. Until then, keep exploring the mountain.
        </p>
        <div className="mt-6">
          <Link href="/" className={emptyBtn}>
            ← Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );

  if (!cartId) {
    return <EmptyCart />;
  }

  const data = await fetchCart(cartId);
  const cart = data?.cart;

  if (!cart || !cart.lines.edges.length) {
    return <EmptyCart />;
  }

  const shellBg = isDark
    ? "bg-slate-950/80 border-slate-800/70 shadow-[0_24px_70px_rgba(15,23,42,0.95)]"
    : "bg-white border-slate-200 shadow-[0_18px_45px_rgba(15,23,42,0.08)]";

  const subtleText = isDark ? "text-slate-400" : "text-slate-500";
  const lineBorder = isDark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-white";
  const summaryBg = isDark
    ? "bg-slate-950 border-slate-800"
    : "bg-slate-50 border-slate-200";
  const summaryLabel = isDark ? "text-slate-400" : "text-slate-600";
  const summaryTotal = isDark ? "text-slate-50" : "text-slate-900";

  return (
    <main className={`min-h-screen ${pageBg}`}>
      {isDark ? (
        <>
          <div className="pointer-events-none fixed inset-0 -z-20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900" />
          <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),transparent_55%)]" />
        </>
      ) : (
        <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-slate-100 via-white to-slate-100" />
      )}

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        {/* Header row */}
        <header className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
              Your cart
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready for checkout.
            </h1>
            <p className={`mt-1 text-xs sm:text-sm ${subtleText}`}>
              Review your setup, update quantities, and slide into checkout in a
              few clicks.
            </p>
          </div>
          <Link
            href="/"
            className="text-xs font-medium text-sky-400 hover:text-sky-300 sm:text-[13px]"
          >
            ← Keep shopping
          </Link>
        </header>

        {/* Main shell */}
        <section
          className={`grid gap-8 rounded-3xl border p-5 sm:p-6 lg:grid-cols-[minmax(0,_1.6fr)_minmax(0,_1fr)] lg:gap-10 lg:p-8 ${shellBg}`}
        >
          {/* LEFT: Cart items */}
          <div className="space-y-4">
            {cart.lines.edges.map(({ node: line }) => {
              const product = line.merchandise.product;
              const variant = line.merchandise;

              return (
                <div
                  key={line.id}
                  className={`flex items-start gap-4 rounded-2xl border px-3 py-3.5 sm:px-4 sm:py-4 ${lineBorder}`}
                >
                  {/* Image */}
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-900 sm:h-24 sm:w-24">
                    {variant.image && (
                      <Image
                        src={variant.image.url}
                        alt={variant.image.altText || product.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-1 text-sm">
                    <Link
                      href={`/products/${product.handle}`}
                      className="font-semibold hover:text-sky-400"
                    >
                      {product.title}
                    </Link>
                    <p className={`text-xs ${subtleText}`}>{variant.title}</p>

                    <p className="mt-1 text-sm font-semibold">
                      {Number(variant.price.amount).toLocaleString("en-US", {
                        style: "currency",
                        currency: variant.price.currencyCode,
                      })}
                    </p>

                    <p className={`mt-1 text-[11px] ${subtleText}`}>
                      Ships in 24h · Free returns (30 days)
                    </p>
                  </div>

                  {/* Quantity / remove (client component) */}
                  <div className="flex flex-col items-end gap-2">
                    <CartActions
                      lineId={line.id}
                      initialQuantity={line.quantity}
                      cartId={cartId}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Summary */}
          <aside
            className={`h-fit rounded-2xl border p-5 sm:p-6 ${summaryBg}`}
          >
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              Order summary
            </h2>

            <div className="mt-4 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className={summaryLabel}>Items</span>
                <span className={summaryLabel}>
                  {cart.lines.edges.reduce(
                    (sum, { node }) => sum + node.quantity,
                    0,
                  )}{" "}
                  total
                </span>
              </div>
              <div className="flex justify-between">
                <span className={summaryLabel}>Estimated total</span>
                <span
                  className={`text-xl font-semibold sm:text-2xl ${summaryTotal}`}
                >
                  {Number(
                    cart.estimatedCost.totalAmount.amount,
                  ).toLocaleString("en-US", {
                    style: "currency",
                    currency: cart.estimatedCost.totalAmount.currencyCode,
                  })}
                </span>
              </div>
              <p className={`mt-1 text-[11px] ${summaryLabel}`}>
                Taxes and shipping calculated at checkout.
              </p>
            </div>

            {/* Checkout CTA */}
            <div className="mt-6 space-y-3">
              <a
                href={cart.checkoutUrl}
                className="relative flex w-full items-center justify-center overflow-hidden rounded-full border border-sky-500/80 bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_14px_45px_rgba(56,189,248,0.65)] transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <span className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.45),transparent)] opacity-0 transition-opacity duration-300 hover:opacity-100" />
                <span className="relative flex items-center gap-2">
                  Proceed to checkout
                  <span className="text-xs opacity-80">
                    – Secured by Shopify
                  </span>
                </span>
              </a>

              <p className={`text-[11px] leading-relaxed ${summaryLabel}`}>
                You&apos;ll be redirected to Shopify&apos;s secure checkout to
                complete your order. Your cart is saved automatically.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}