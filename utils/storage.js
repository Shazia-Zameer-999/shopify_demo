import Cookies from 'js-cookie';
import { cookies } from 'next/headers';

const CART_KEY = "shopify_cart_id";

// ========================================
// CLIENT-SIDE FUNCTIONS (for "use client" components)
// ========================================

// Get cart ID in browser (client components)
export function getCartId() {
  return Cookies.get(CART_KEY) || null;
}

// Save cart ID in browser (client components)
export function setCartId(cartId) {
  Cookies.set(CART_KEY, cartId, { 
    expires: 20,
    sameSite: 'lax',
    path: '/',  // Important: available site-wide
    secure: process.env.NODE_ENV === 'production'
  });
}

// Remove cart ID in browser (client components)
export function removeCartId() {
  Cookies.remove(CART_KEY);
}

// ========================================
// SERVER-SIDE FUNCTIONS (for Server Components)
// ========================================

// Get cart ID on server (Server Components)
export function getCartIdServer() {
  const cookieStore = cookies();
  const cartCookie = cookieStore.get(CART_KEY);
  
  console.log("🍪 Server: Reading cookie:", CART_KEY);
  console.log("🍪 Cookie value:", cartCookie?.value || "NOT FOUND");
  
  return cartCookie?.value || null;
}

// Save cart ID on server (Server Actions)
export async function setCartIdServer(cartId) {
  const cookieStore = cookies();
  cookieStore.set(CART_KEY, cartId, {
    maxAge: 60 * 60 * 24 * 20, // 20 days
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production'
  });
}

// Remove cart ID on server (Server Actions)
export async function removeCartIdServer() {
  const cookieStore = cookies();
  cookieStore.delete(CART_KEY);
}