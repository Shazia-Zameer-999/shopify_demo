"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function ImageGallery({ images, featuredImage, productTitle, isDark }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const imageRef = useRef(null);

  // Build gallery from images array, or fallback to featuredImage if no images
  const allImages = images && images.length > 0
    ? images.map(({ node }) => ({ 
        url: node.url, 
        altText: node.altText || productTitle 
      }))
    : featuredImage 
    ? [{ url: featuredImage.url, altText: featuredImage.altText || productTitle }]
    : [];

  // If no images at all, show placeholder
  if (allImages.length === 0) {
    return (
      <div className={`flex items-center justify-center aspect-[4/5] rounded-2xl ${isDark ? "bg-slate-900" : "bg-slate-100"}`}>
        <p className={isDark ? "text-slate-500" : "text-slate-400"}>No images available</p>
      </div>
    );
  }

  // Swipe detection
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < allImages.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
      if (e.key === "ArrowRight" && currentIndex < allImages.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, allImages.length]);

  const currentImage = allImages[currentIndex];

  return (
    <div className="space-y-4">
      {/* Main Image with swipe support */}
      <div
        ref={imageRef}
        className={`relative overflow-hidden rounded-2xl group ${isDark ? "bg-slate-900/80" : "bg-slate-100"}`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative aspect-[4/5] w-full">
          <Image
            src={currentImage.url}
            alt={currentImage.altText || productTitle}
            fill
            priority={currentIndex === 0}
            className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* Navigation arrows - desktop only */}
          {allImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className={`absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-2.5 backdrop-blur-sm transition-all duration-300 ${
                  currentIndex === 0
                    ? "opacity-0 pointer-events-none"
                    : isDark
                    ? "bg-slate-950/70 text-white hover:bg-slate-950/90 opacity-0 group-hover:opacity-100"
                    : "bg-white/70 text-slate-900 hover:bg-white/90 opacity-0 group-hover:opacity-100"
                } shadow-lg`}
                aria-label="Previous image"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => setCurrentIndex(Math.min(allImages.length - 1, currentIndex + 1))}
                disabled={currentIndex === allImages.length - 1}
                className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2.5 backdrop-blur-sm transition-all duration-300 ${
                  currentIndex === allImages.length - 1
                    ? "opacity-0 pointer-events-none"
                    : isDark
                    ? "bg-slate-950/70 text-white hover:bg-slate-950/90 opacity-0 group-hover:opacity-100"
                    : "bg-white/70 text-slate-900 hover:bg-white/90 opacity-0 group-hover:opacity-100"
                } shadow-lg`}
                aria-label="Next image"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image counter */}
          <div
            className={`absolute bottom-3 right-3 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md shadow-lg ${
              isDark ? "bg-slate-950/80 text-slate-200" : "bg-white/80 text-slate-800"
            }`}
          >
            {currentIndex + 1} / {allImages.length}
          </div>

          {/* Gradient overlay */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />
        </div>

        {/* Accent bar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300" />
      </div>

      {/* Thumbnail Grid - Clickable */}
      {allImages.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {allImages.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                index === currentIndex
                  ? isDark
                    ? "border-sky-400 shadow-lg shadow-sky-400/50 scale-105"
                    : "border-sky-500 shadow-lg shadow-sky-500/30 scale-105"
                  : isDark
                  ? "border-slate-800 hover:border-slate-700"
                  : "border-slate-200 hover:border-slate-300"
              } ${isDark ? "bg-slate-900" : "bg-slate-100"}`}
            >
              <Image
                src={image.url}
                alt={image.altText || `${productTitle} - Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 12vw"
              />

              {/* Active indicator overlay */}
              {index === currentIndex && (
                <div className="absolute inset-0 bg-sky-500/10 backdrop-blur-[1px] ring-2 ring-inset ring-sky-400/50" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Swipe hint - mobile only */}
      {allImages.length > 0 && (
        <p className={`text-center text-xs md:hidden ${isDark ? "text-slate-500" : "text-slate-400"}`}>
          ← Swipe to browse images →
        </p>
      )}
    </div>
  );
}