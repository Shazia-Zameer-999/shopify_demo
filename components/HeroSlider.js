// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";

// const SLIDES = [
//   {
//     id: 1,
//     image: "https://images.unsplash.com/photo-1520207588543-1e545b20c19e?q=80&w=2071&auto=format&fit=crop",
//     subtitle: "Winter 24 / 25 Collection",
//     title: "Conquer the Peaks",
//     description: "Experience the thrill with our new all-mountain series. Engineered for speed, stability, and deep powder.",
//     cta: "Shop Collection",
//     link: "#products",
//     align: "left"
//   },
//   {
//     id: 2,
//     image: "https://images.unsplash.com/photo-1565992441121-4367c2967103?q=80&w=2727&auto=format&fit=crop",
//     subtitle: "New Arrivals",
//     title: "Freestyle Freedom",
//     description: "Lightweight, poppy, and ready for the park. Discover the boards that are changing the game this season.",
//     cta: "View Freestyle",
//     link: "#products",
//     align: "center"
//   },
//   {
//     id: 3,
//     image: "https://images.unsplash.com/photo-1483069036907-2744936d4d42?q=80&w=2070&auto=format&fit=crop",
//     subtitle: "Limited Edition",
//     title: "The Ghost Line",
//     description: "Our editors' pick for the season. A directional twin that handles hardpack and storm days with equal grace.",
//     cta: "Shop Ghost Line",
//     link: "#products",
//     align: "left"
//   }
// ];

// export default function HeroSlider({ theme }) {
//   const [current, setCurrent] = useState(0);
//   const [isHovered, setIsHovered] = useState(false);

//   // Auto-advance slides
//   useEffect(() => {
//     if (isHovered) return;
//     const timer = setInterval(() => {
//       setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
//     }, 6000); // Change every 6 seconds
//     return () => clearInterval(timer);
//   }, [isHovered]);

//   const nextSlide = () => setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
//   const prevSlide = () => setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));

//   const isDark = theme === "dark";

//   return (
//     <div 
//       className={`relative w-full overflow-hidden rounded-3xl shadow-2xl ${isDark ? 'shadow-black/50 border border-slate-800' : 'shadow-slate-200 border border-slate-200'}`}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Aspect Ratio Container */}
//       <div className="relative h-[500px] sm:h-[600px] lg:h-[650px] w-full">
        
//         {SLIDES.map((slide, index) => (
//           <div
//             key={slide.id}
//             className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
//               index === current ? "opacity-100 z-10" : "opacity-0 z-0"
//             }`}
//           >
//             {/* Background Image */}
//             <Image
//               src={slide.image}
//               alt={slide.title}
//               fill
//               className="object-cover"
//               priority={index === 0}
//             />

//             {/* Gradient Overlay for Text Readability */}
//             <div className={`absolute inset-0 bg-gradient-to-r ${
//               slide.align === 'center' 
//                 ? 'from-black/60 via-black/40 to-black/60' 
//                 : 'from-black/80 via-black/40 to-transparent'
//             }`} />

//             {/* Content */}
//             <div className={`absolute inset-0 flex flex-col justify-center px-8 sm:px-16 lg:px-24 ${
//               slide.align === 'center' ? 'items-center text-center' : 'items-start text-left'
//             }`}>
              
//               <div className={`space-y-6 max-w-2xl transition-all duration-1000 delay-300 ${
//                 index === current ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
//               }`}>
//                 <span className="inline-block rounded-full bg-sky-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-300 backdrop-blur-sm border border-sky-500/30">
//                   {slide.subtitle}
//                 </span>

//                 <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl drop-shadow-lg">
//                   {slide.title}
//                 </h2>

//                 <p className="text-lg text-slate-200 sm:text-xl leading-relaxed drop-shadow-md max-w-lg">
//                   {slide.description}
//                 </p>

//                 <div className="pt-4">
//                   <Link
//                     href={slide.link}
//                     className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-widest text-slate-950 transition-all hover:bg-sky-400 hover:text-white"
//                   >
//                     <span>{slide.cta}</span>
//                     <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//                     </svg>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}

//         {/* Navigation Arrows */}
//         <button
//           onClick={prevSlide}
//           className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/20 p-3 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black sm:left-8"
//           aria-label="Previous slide"
//         >
//           <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//         </button>

//         <button
//           onClick={nextSlide}
//           className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/20 p-3 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black sm:right-8"
//           aria-label="Next slide"
//         >
//           <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         </button>

//         {/* Dots Indicators */}
//         <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
//           {SLIDES.map((_, idx) => (
//             <button
//               key={idx}
//               onClick={() => setCurrent(idx)}
//               className={`h-2.5 rounded-full transition-all duration-300 ${
//                 idx === current ? "w-8 bg-sky-400" : "w-2.5 bg-white/50 hover:bg-white"
//               }`}
//               aria-label={`Go to slide ${idx + 1}`}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";

// const SLIDES = [
//   {
//     id: 1,
//     image: "https://images.unsplash.com/photo-1520207588543-1e545b20c19e?q=80&w=2071&auto=format&fit=crop",
//     subtitle: "Winter 24 / 25 Collection",
//     title: "Conquer the Peaks",
//     description: "Experience the thrill with our new all-mountain series. Engineered for speed, stability, and deep powder.",
//     cta: "Shop Collection",
//     link: "#products",
//     align: "left"
//   },
//   {
//     id: 2,
//     image: "https://images.unsplash.com/photo-1565992441121-4367c2967103?q=80&w=2727&auto=format&fit=crop",
//     subtitle: "New Arrivals",
//     title: "Freestyle Freedom",
//     description: "Lightweight, poppy, and ready for the park. Discover the boards that are changing the game this season.",
//     cta: "View Freestyle",
//     link: "#products",
//     align: "center"
//   },
//   {
//     id: 3,
//     image: "https://images.unsplash.com/photo-1483069036907-2744936d4d42?q=80&w=2070&auto=format&fit=crop",
//     subtitle: "Limited Edition",
//     title: "The Ghost Line",
//     description: "Our editors' pick for the season. A directional twin that handles hardpack and storm days with equal grace.",
//     cta: "Shop Ghost Line",
//     link: "#products",
//     align: "left"
//   }
// ];

// export default function HeroSlider({ theme = "dark" }) {
//   const [current, setCurrent] = useState(0);
//   const [isHovered, setIsHovered] = useState(false);
//   const [isAutoPlay, setIsAutoPlay] = useState(true);

//   // Auto-advance slides
//   useEffect(() => {
//     if (!isAutoPlay || isHovered) return;
    
//     const timer = setInterval(() => {
//       setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
//     }, 5000); // Change every 5 seconds
    
//     return () => clearInterval(timer);
//   }, [isAutoPlay, isHovered]);

//   const nextSlide = () => {
//     setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
//     setIsAutoPlay(false);
//     setTimeout(() => setIsAutoPlay(true), 10000);
//   };

//   const prevSlide = () => {
//     setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
//     setIsAutoPlay(false);
//     setTimeout(() => setIsAutoPlay(true), 10000);
//   };

//   const goToSlide = (index) => {
//     setCurrent(index);
//     setIsAutoPlay(false);
//     setTimeout(() => setIsAutoPlay(true), 10000);
//   };

//   const isDark = theme === "dark";

//   return (
//     <div 
//       className={`relative w-full overflow-hidden rounded-3xl transition-all duration-300 ${
//         isDark
//           ? "shadow-2xl shadow-sky-500/10 border border-sky-400/30"
//           : "shadow-xl shadow-slate-300/30 border border-slate-200"
//       }`}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Aspect Ratio Container */}
//       <div className="relative h-[500px] sm:h-[600px] lg:h-[700px] w-full">
        
//         {SLIDES.map((slide, index) => (
//           <div
//             key={slide.id}
//             className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
//               index === current ? "opacity-100 z-10" : "opacity-0 z-0"
//             }`}
//           >
//             {/* Background Image */}
//             <Image
//               src={slide.image}
//               alt={slide.title}
//               fill
//               className="object-cover"
//               priority={index === 0}
//               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
//             />

//             {/* Gradient Overlay - Customized per Theme */}
//             <div 
//               className={`absolute inset-0 transition-all duration-1000 ${
//                 isDark
//                   ? slide.align === 'center' 
//                     ? 'bg-gradient-to-r from-slate-950/70 via-slate-950/40 to-slate-950/70' 
//                     : 'bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent'
//                   : slide.align === 'center'
//                     ? 'bg-gradient-to-r from-white/40 via-white/20 to-white/40'
//                     : 'bg-gradient-to-r from-white/60 via-white/30 to-transparent'
//               }`} 
//             />

//             {/* Content */}
//             <div className={`absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-20 ${
//               slide.align === 'center' ? 'items-center text-center' : 'items-start text-left'
//             }`}>
              
//               <div className={`space-y-6 max-w-2xl transition-all duration-1000 ${
//                 index === current 
//                   ? "translate-y-0 opacity-100" 
//                   : "translate-y-8 opacity-0"
//               }`}>
                
//                 {/* Badge */}
//                 <span className={`inline-block rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest backdrop-blur-md border transition-all duration-300 ${
//                   isDark
//                     ? "bg-sky-500/20 text-sky-300 border-sky-500/40 hover:bg-sky-500/30 hover:border-sky-500/60"
//                     : "bg-white/20 text-slate-800 border-white/40 hover:bg-white/30 hover:border-white/60"
//                 }`}>
//                   {slide.subtitle}
//                 </span>

//                 {/* Title */}
//                 <h2 className={`font-black tracking-tight drop-shadow-lg sm:text-5xl lg:text-7xl ${
//                   isDark
//                     ? "text-3xl text-white"
//                     : "text-3xl sm:text-5xl lg:text-6xl text-slate-900"
//                 }`}>
//                   {slide.title}
//                 </h2>

//                 {/* Description */}
//                 <p className={`text-base sm:text-lg leading-relaxed drop-shadow-md max-w-lg transition-all duration-500 ${
//                   isDark
//                     ? "text-slate-200"
//                     : "text-slate-700"
//                 }`}>
//                   {slide.description}
//                 </p>

//                 {/* CTA Button */}
//                 <div className="pt-4">
//                   <Link
//                     href={slide.link}
//                     className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 transform hover:scale-105 active:scale-95 ${
//                       isDark
//                         ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/50 hover:from-sky-400 hover:to-blue-500 hover:shadow-sky-400/60"
//                         : "bg-white text-slate-900 shadow-lg shadow-slate-300/50 hover:bg-sky-50 hover:shadow-sky-300/60"
//                     }`}
//                   >
//                     <span className="relative z-10">{slide.cta}</span>
//                     <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//                     </svg>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}

//         {/* Navigation Arrows */}
//         <button
//           onClick={prevSlide}
//           className={`absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full p-3 transition-all duration-200 hover:scale-110 active:scale-95 sm:left-8 backdrop-blur-md ${
//             isDark
//               ? "bg-white/10 text-white hover:bg-white/20 hover:text-sky-300"
//               : "bg-white/20 text-white hover:bg-white/40 hover:text-slate-900"
//           }`}
//           aria-label="Previous slide"
//         >
//           <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//         </button>

//         <button
//           onClick={nextSlide}
//           className={`absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full p-3 transition-all duration-200 hover:scale-110 active:scale-95 sm:right-8 backdrop-blur-md ${
//             isDark
//               ? "bg-white/10 text-white hover:bg-white/20 hover:text-sky-300"
//               : "bg-white/20 text-white hover:bg-white/40 hover:text-slate-900"
//           }`}
//           aria-label="Next slide"
//         >
//           <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         </button>

//         {/* Dots Indicators */}
//         <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:gap-3">
//           {SLIDES.map((_, idx) => (
//             <button
//               key={idx}
//               onClick={() => goToSlide(idx)}
//               className={`rounded-full transition-all duration-300 h-2.5 ${
//                 idx === current 
//                   ? isDark
//                     ? "w-8 bg-sky-400 shadow-lg shadow-sky-500/50"
//                     : "w-8 bg-sky-500 shadow-lg shadow-sky-300/50"
//                   : isDark
//                     ? "w-2.5 bg-white/40 hover:bg-white/60"
//                     : "w-2.5 bg-white/50 hover:bg-white/80"
//               }`}
//               aria-label={`Go to slide ${idx + 1}`}
//               aria-current={idx === current ? "true" : "false"}
//             />
//           ))}
//         </div>

//         {/* Progress Indicator */}
//         <div className={`absolute bottom-0 left-0 h-1 transition-all duration-500 ${
//           isDark
//             ? "bg-gradient-to-r from-sky-500 to-blue-600"
//             : "bg-gradient-to-r from-sky-400 to-blue-500"
//         }`}
//         style={{ width: `${((current + 1) / SLIDES.length) * 100}%` }}
//         />
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const SLIDES = [
  {
    id: 1,
    image: "https://i.pinimg.com/1200x/3a/5c/55/3a5c5579c38e470cec6e6b5d7217ea64.jpg",
    subtitle: "Winter 24 / 25 Collection",
    title: "Conquer the Peaks",
    description: "Experience the thrill with our new all-mountain series. Engineered for speed, stability, and deep powder.",
    cta: "Shop Collection",
    link: "#products",
    align: "left",
    badge: "NEW"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1565992441121-4367c2967103?q=80&w=2727&auto=format&fit=crop",
    subtitle: "New Arrivals",
    title: "Freestyle Freedom",
    description: "Lightweight, poppy, and ready for the park. Discover the boards that are changing the game this season.",
    cta: "View Freestyle",
    link: "#products",
    align: "center",
    badge: "TRENDING"
  },
  {
    id: 3,
    image: "https://i.pinimg.com/1200x/72/70/21/7270215c42fa432dc04bd88feb856a8a.jpg",
    subtitle: "Limited Edition",
    title: "The Ghost Line",
    description: "Our editors' pick for the season. A directional twin that handles hardpack and storm days with equal grace.",
    cta: "Shop Ghost Line",
    link: "#products",
    align: "left",
    badge: "EDITORS' PICK"
  }
];

export default function HeroSlider({ theme = "dark" }) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [progress, setProgress] = useState(0);
  const [nextSlideIndex, setNextSlideIndex] = useState(1);

  // Progress bar animation
  useEffect(() => {
    if (!isAutoPlay || isHovered) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrent((c) => (c === SLIDES.length - 1 ? 0 : c + 1));
          return 0;
        }
        return prev + (100 / 50); // 5000ms / 50 updates
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isAutoPlay, isHovered]);

  // Preload next slide image
  useEffect(() => {
    setNextSlideIndex((current + 1) % SLIDES.length);
  }, [current]);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    setProgress(0);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 8000);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
    setProgress(0);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 8000);
  }, []);

  const goToSlide = useCallback((index) => {
    setCurrent(index);
    setProgress(0);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 8000);
  }, []);

  const isDark = theme === "dark";

  return (
    <div 
      className={`group relative w-full overflow-hidden rounded-2xl transition-all duration-300 ${
        isDark
          ? "shadow-2xl shadow-sky-500/20 border border-sky-200/10"
          : "shadow-2xl shadow-slate-400/20 border border-slate-200/50"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Aspect Ratio Container */}
      <div className="relative h-[500px] sm:h-[600px] lg:h-screen w-full bg-slate-900">
        
        {/* Slides */}
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === current 
                ? "opacity-100 z-10 scale-100" 
                : index === nextSlideIndex
                ? "opacity-0 z-5 scale-105"
                : "opacity-0 z-0 scale-95"
            }`}
          >
            {/* Background Image with Ken Burns Effect */}
            <div className="relative h-full w-full overflow-hidden ">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className={`object-cover transition-transform duration-[8000ms] rounded-2xl  ease-out ${
                  index === current ? "scale-100" : "scale-95"
                }`}
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              />
            </div>

            {/* Multi-layer Gradient Overlay */}
            <div className={`absolute inset-0 ${
              isDark
                ? slide.align === 'center' 
                  ? 'bg-gradient-to-r from-slate-950/60 via-slate-950/30 to-slate-950/60' 
                  : 'bg-gradient-to-r from-slate-950/80 via-slate-950/50 to-transparent'
                : slide.align === 'center'
                  ? 'bg-gradient-to-r from-white/50 via-white/25 to-white/50'
                  : 'bg-gradient-to-r from-white/70 via-white/40 to-transparent'
            }`} />
            
            {/* Additional radial gradient for depth */}
            <div className={`absolute inset-0 ${
              isDark 
                ? 'bg-radial-gradient from-transparent via-slate-950/20 to-slate-950/40' 
                : 'bg-radial-gradient from-transparent via-white/10 to-white/20'
            }`} />

            {/* Content with staggered animations */}
            <div className={`absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 ${
              slide.align === 'center' ? 'items-center text-center' : 'items-start text-left'
            }`}>
              
              <div className={`space-y-6 max-w-3xl transition-all duration-1000 ${
                index === current 
                  ? "translate-y-0 opacity-100" 
                  : "translate-y-12 opacity-0"
              }`}>
                
                {/* Badge with animation */}
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest backdrop-blur-xl border transition-all duration-500 transform ${
                    index === current ? "scale-100 opacity-100" : "scale-95 opacity-0"
                  } ${
                    isDark
                      ? "bg-gradient-to-r from-sky-500/30 to-cyan-500/20 text-sky-200 border-sky-500/50 shadow-lg shadow-sky-500/20"
                      : "bg-gradient-to-r from-sky-400/40 to-cyan-400/30 text-sky-900 border-sky-400/60 shadow-lg shadow-sky-400/20"
                  }`}>
                    <span className={`h-2 w-2 rounded-full animate-pulse ${isDark ? 'bg-sky-400' : 'bg-sky-600'}`} />
                    {slide.subtitle}
                  </span>
                </div>

                {/* Title with better typography */}
                <h1 className={`font-black tracking-tight drop-shadow-2xl leading-tight ${
                  isDark
                    ? "text-4xl sm:text-6xl lg:text-8xl text-white"
                    : "text-4xl sm:text-6xl lg:text-8xl text-slate-900"
                }`}>
                  {slide.title.split(' ').map((word, i) => (
                    <span 
                      key={i}
                      className={`inline-block transition-all duration-1000 ${
                        index === current 
                          ? "translate-y-0 opacity-100" 
                          : "translate-y-8 opacity-0"
                      }`}
                      style={{
                        transitionDelay: index === current ? `${i * 100}ms` : '0ms'
                      }}
                    >
                      {word}&nbsp;
                    </span>
                  ))}
                </h1>

                {/* Description with fade-in */}
                <p className={`text-base sm:text-lg leading-relaxed drop-shadow-lg max-w-xl transition-all duration-1000 delay-200 ${
                  index === current ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                } ${
                  isDark
                    ? "text-slate-200"
                    : "text-slate-700"
                }`}>
                  {slide.description}
                </p>

                {/* CTA Button with premium styling */}
                <div className="pt-6 transition-all duration-1000 delay-300">
                  <Link
                    href={slide.link}
                    className={`group/btn relative inline-flex items-center gap-3 overflow-hidden rounded-full px-8 sm:px-10 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                      isDark
                        ? "bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 text-white shadow-2xl shadow-sky-500/40 hover:shadow-sky-400/60 hover:from-sky-400 hover:via-blue-400 hover:to-cyan-400"
                        : "bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-2xl shadow-sky-400/40 hover:shadow-sky-300/60 hover:from-sky-300 hover:to-blue-400"
                    }`}
                  >
                    {/* Animated background shine */}
                    <span className={`absolute inset-0 -z-10 ${isDark ? 'bg-gradient-to-r from-sky-600 to-blue-600' : 'bg-gradient-to-r from-sky-500 to-blue-600'}`} />
                    
                    <span className="relative z-10 flex items-center gap-2">
                      {slide.cta}
                      <svg className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-2 group-hover/btn:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows - Premium style */}
        <button
          onClick={prevSlide}
          className={`absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 group/nav rounded-full p-3 transition-all duration-300 hover:scale-125 active:scale-90 backdrop-blur-xl ${
            isDark
              ? "bg-white/5 hover:bg-white/15 text-white hover:text-sky-300 border border-white/10 hover:border-white/20 shadow-xl shadow-black/20"
              : "bg-white/10 hover:bg-white/25 text-white hover:text-white border border-white/20 hover:border-white/40 shadow-xl shadow-black/10"
          }`}
          aria-label="Previous slide"
        >
          <svg className="h-6 w-6 transition-transform group-hover/nav:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className={`absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 group/nav rounded-full p-3 transition-all duration-300 hover:scale-125 active:scale-90 backdrop-blur-xl ${
            isDark
              ? "bg-white/5 hover:bg-white/15 text-white hover:text-sky-300 border border-white/10 hover:border-white/20 shadow-xl shadow-black/20"
              : "bg-white/10 hover:bg-white/25 text-white hover:text-white border border-white/20 hover:border-white/40 shadow-xl shadow-black/10"
          }`}
          aria-label="Next slide"
        >
          <svg className="h-6 w-6 transition-transform group-hover/nav:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slide Counter */}
        {/* <div className={`absolute top-8 right-8 z-20 px-4 py-2 rounded-full backdrop-blur-xl border font-mono text-sm font-bold transition-all duration-300 ${
          isDark
            ? "bg-white/5 text-sky-300 border-white/10"
            : "bg-white/10 text-sky-700 border-white/20"
        }`}>
          {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
        </div> */}

        {/* Dots Indicators - Premium version */}
        <div className="absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 gap-3 sm:gap-4">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`rounded-full transition-all duration-500 group/dot relative ${
                idx === current 
                  ? isDark
                    ? "w-10 h-3 bg-gradient-to-r from-sky-400 to-blue-500 shadow-lg shadow-sky-500/50"
                    : "w-10 h-3 bg-gradient-to-r from-sky-500 to-blue-600 shadow-lg shadow-sky-400/50"
                  : isDark
                    ? "w-3 h-3 bg-white/30 hover:bg-white/50 hover:scale-110"
                    : "w-3 h-3 bg-white/40 hover:bg-white/70 hover:scale-110"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === current ? "true" : "false"}
            />
          ))}
        </div>

        {/* Progress Bar - Modern linear progress */}
        <div className={`absolute bottom-0 left-0 h-1 transition-all duration-100 ease-linear ${
          isDark
            ? "bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 shadow-lg shadow-sky-500/50"
            : "bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-500 shadow-lg shadow-sky-400/50"
        }`}
        style={{ width: `${progress}%` }}
        />
      </div>

      {/* Keyboard navigation hint (mobile hidden) */}
      <div className={`hidden lg:flex absolute bottom-4 left-1/2 -translate-x-1/2 items-center gap-2 px-3 py-1 rounded-full backdrop-blur-sm text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
        isDark
          ? "bg-white/5 text-slate-400 border border-white/10"
          : "bg-white/10 text-slate-600 border border-white/20"
      }`}>
        <span>← →</span>
        <span>to navigate</span>
      </div>
    </div>
  );
}