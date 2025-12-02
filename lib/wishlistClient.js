"use client";

export async function toggleWishlist(item, isLoggedIn) {
  const event = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("wishlistUpdated"));
    }
  };

  // 🔹 Logged-in → use API
  if (isLoggedIn) {
    const res = await fetch("/api/wishlist/get");
    const data = await res.json();

    const exists = data.wishlist.some(
      (i) => i.id === item.id || i.variantId === item.variantId
    );

    if (exists) {
      await fetch("/api/wishlist/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          variantId: item.variantId,
        }),
      });
    } else {
      await fetch("/api/wishlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
    }

    event();
    return;
  }

  // 🔹 Guest → use localStorage
  let guestList = JSON.parse(localStorage.getItem("wishlist") || "[]");

  const exists = guestList.some(
    (i) => i.id === item.id || i.variantId === item.variantId
  );

  if (exists) {
    guestList = guestList.filter(
      (i) => i.id !== item.id && i.variantId !== item.variantId
    );
  } else {
    guestList.push(item);
  }

  localStorage.setItem("wishlist", JSON.stringify(guestList));

  event();
}