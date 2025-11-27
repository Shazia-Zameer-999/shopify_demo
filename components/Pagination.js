"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({
  hasNextPage,
  hasPreviousPage,
  endCursor,
  startCursor,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const theme = searchParams.get("theme") === "light" ? "light" : "dark";

  function buildUrl(params) {
    const p = new URLSearchParams(searchParams.toString());

    // Control pagination params here
    p.delete("after");
    p.delete("before");

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        p.delete(key);
      } else {
        p.set(key, String(value));
      }
    });

    const qs = p.toString();
    return qs ? `/?${qs}` : "/";
  }

  function goToNextPage() {
    if (!endCursor || !hasNextPage) return;
    const nextPage = currentPage + 1;

    router.push(
      buildUrl({
        after: endCursor,
        before: null,
        page: nextPage,
      }),
    );
  }

  function goToPreviousPage() {
    if (!startCursor || !hasPreviousPage) return;

    const prevPage = Math.max(1, currentPage - 1);

    if (prevPage === 1) {
      router.push(
        buildUrl({
          after: null,
          before: null,
          page: null,
        }),
      );
    } else {
      router.push(
        buildUrl({
          before: startCursor,
          after: null,
          page: prevPage,
        }),
      );
    }
  }

  function goToFirstPage() {
    router.push(
      buildUrl({
        after: null,
        before: null,
        page: null,
      }),
    );
  }

  const isFirstPage = !hasPreviousPage || currentPage === 1;

  const shell =
    theme === "light"
      ? "border-slate-200 bg-white text-slate-700 shadow-sm shadow-slate-200"
      : "border-slate-700/60 bg-slate-950/80 text-slate-200 shadow-sm shadow-slate-900/70";

  const disabledText =
    theme === "light" ? "text-slate-300" : "text-slate-500";

  const hoverBtn =
    theme === "light"
      ? "hover:bg-slate-100 hover:text-slate-900"
      : "hover:bg-slate-800 hover:text-slate-50";

  return (
    <nav
      aria-label="Pagination"
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-xs sm:text-[13px] ${shell}`}
    >
      {/* First */}
      <button
        type="button"
        onClick={goToFirstPage}
        disabled={isFirstPage}
        className={`inline-flex h-7 items-center rounded-full px-2.5 font-medium transition ${
          isFirstPage
            ? `cursor-not-allowed ${disabledText}`
            : hoverBtn
        }`}
      >
        « First
      </button>

      {/* Previous */}
      <button
        type="button"
        onClick={goToPreviousPage}
        disabled={!hasPreviousPage}
        className={`inline-flex h-7 items-center rounded-full px-2.5 font-medium transition ${
          !hasPreviousPage
            ? `cursor-not-allowed ${disabledText}`
            : hoverBtn
        }`}
      >
        ‹ Prev
      </button>

      {/* Current page pill */}
      <span
        className={`inline-flex h-7 min-w-[2.5rem] items-center justify-center rounded-full px-3 text-[11px] font-semibold tracking-wide shadow ${
          theme === "light"
            ? "bg-sky-500/90 text-white shadow-sky-400/50"
            : "bg-sky-500/90 text-slate-950 shadow-sky-500/60"
        }`}
      >
        Page {currentPage}
      </span>

      {/* Next */}
      <button
        type="button"
        onClick={goToNextPage}
        disabled={!hasNextPage}
        className={`inline-flex h-7 items-center rounded-full px-2.5 font-medium transition ${
          !hasNextPage
            ? `cursor-not-allowed ${disabledText}`
            : hoverBtn
        }`}
      >
        Next ›
      </button>
    </nav>
  );
}