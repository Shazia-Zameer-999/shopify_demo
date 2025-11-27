"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setSearchTerm("");
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  async function handleSearch(e) {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length < 2) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(value)}`
      );
      const data = await response.json();
      setResults(data.products || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelectProduct(handle) {
    router.push(`/products/${handle}`);
    setSearchTerm("");
    setResults([]);
    setIsOpen(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      setIsOpen(false);
    }
  }

  function handleClear() {
    setSearchTerm("");
    setResults([]);
    setIsOpen(false);
  }

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        {/* Search Input */}
        <div className="relative flex items-center">
          {/* Search Icon */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Input Field */}
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            onFocus={() => searchTerm.length >= 2 && setIsOpen(true)}
            placeholder="Search snowboards, gear..."
            className="w-full rounded-full border border-slate-700 bg-slate-900/60 py-2 pl-10 pr-10 text-sm text-slate-100 placeholder-slate-500 shadow-sm backdrop-blur-sm transition-all duration-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
          />

          {/* Clear/Loading Button */}
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-200"
            >
              {isLoading ? (
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[28rem] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/95 shadow-2xl shadow-slate-950/80 backdrop-blur-xl animate-in slide-in-from-top-2 fade-in duration-200">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-400">
              <svg
                className="h-5 w-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Searching...</span>
            </div>
          )}

          {/* Results List */}
          {!isLoading && results.length > 0 && (
            <div className="overflow-y-auto max-h-[26rem]">
              {/* Header */}
              <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/95 px-4 py-2 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {results.length} Result{results.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Product Items */}
              {results.map((product, index) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleSelectProduct(product.handle)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-900/80 ${
                    index !== results.length - 1 ? "border-b border-slate-800/50" : ""
                  }`}
                >
                  {/* Product Image */}
                  {product.featuredImage ? (
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-slate-900">
                      <Image
                        src={product.featuredImage.url}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-slate-900 text-slate-600">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-slate-100">
                      {product.title}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="text-xs font-semibold text-sky-400">
                        ${product.priceRange?.minVariantPrice?.amount || "N/A"}
                      </span>
                      {product.vendor && (
                        <span className="text-xs text-slate-500">
                          · {product.vendor}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-slate-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ))}

              {/* View All Results Footer */}
              <button
                type="button"
                onClick={handleSubmit}
                className="sticky bottom-0 w-full border-t border-slate-800 bg-slate-950/95 px-4 py-3 text-center text-sm font-medium text-sky-400 backdrop-blur-sm transition-colors hover:bg-slate-900/80 hover:text-sky-300"
              >
                View all results for "{searchTerm}" →
              </button>
            </div>
          )}

          {/* No Results */}
          {!isLoading && searchTerm.length >= 2 && results.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
              <div className="text-3xl opacity-50">🔍</div>
              <p className="text-sm font-medium text-slate-300">
                No products found
              </p>
              <p className="text-xs text-slate-500">
                Try a different search term
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}