// lib/shopify-admin.js
const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_API_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;

// pick a stable admin API version you have access to
const SHOPIFY_ADMIN_API_VERSION = "2025-01";

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_API_ACCESS_TOKEN) {
  throw new Error(
    "Please define SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_API_ACCESS_TOKEN in .env.local"
  );
}

async function shopifyAdminFetch(path, options = {}) {
  const url = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_ADMIN_API_VERSION}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": SHOPIFY_ADMIN_API_ACCESS_TOKEN,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Shopify Admin API error:", res.status, text);
    throw new Error(`Shopify Admin API error: ${res.status}`);
  }

  return res.json();
}

export async function syncShopifyCustomerId(user) {
  if (user.shopifyCustomerId) {
    return user;
  }

  const email = user.email;
  if (!email) return user;

  // Read-only: search customers by email
  const res = await shopifyAdminFetch(
    `/customers.json?email=${encodeURIComponent(email)}`
  );

  const customer = res.customers?.[0];

  if (customer && customer.id) {
    user.shopifyCustomerId = customer.id.toString();
    await user.save();
  }

  return user;
}


export async function fetchOrdersForCustomer({ shopifyCustomerId, email }) {
  let path;

  if (shopifyCustomerId) {
    // Link by Shopify customer id
    path = `/orders.json?customer_id=${shopifyCustomerId}&status=any&limit=10`;
  } else if (email) {
    // Fallback: orders that match this email
    path = `/orders.json?email=${encodeURIComponent(email)}&status=any&limit=10`;
  } else {
    throw new Error("Need shopifyCustomerId or email to fetch orders");
  }

  const res = await shopifyAdminFetch(path);

  const orders = (res.orders || []).map((o) => ({
    id: o.id.toString(),
    name: o.name,
    createdAt: o.created_at,
    financialStatus: o.financial_status,
    fulfillmentStatus: o.fulfillment_status,
    totalPrice: o.total_price,
    currency: o.currency,
  }));

  return orders;
}