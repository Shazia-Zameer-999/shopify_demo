import Cookies from 'js-cookie';

const CART_KEY = "shopify_cart_id";

// Get cart ID in browser (client components)
export function getCartId() {
  const encoded = Cookies.get(CART_KEY);
  if (!encoded) return null;
  
  try {
    // Decode the URI-encoded cart ID
    return decodeURIComponent(encoded);
  } catch (e) {
    console.error("Failed to decode cart ID:", e);
    return null;
  }
}

// Save cart ID in browser (client components)
export function setCartId(cartId) {
  // Encode the cart ID to preserve special characters
  const encoded = encodeURIComponent(cartId);
  

  
  Cookies.set(CART_KEY, encoded, { 
    expires: 20,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production'
  });
  
  // Verify it was saved correctly
  const test = getCartId();
  console.log("✅ Verified decoded cart ID:", test);
}

// Remove cart ID in browser (client components)
export function removeCartId() {
  Cookies.remove(CART_KEY);
}

export const THEME_COOKIE = "theme";

/**
 * Read a cookie by name (client-side only)
 * Returns null if not found or running on server
 */
export function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Write a cookie with optional expiry (default 1 year)
 */
export function setCookie(name, value, days = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; Expires=${expires}; Path=/; SameSite=Lax`;
}