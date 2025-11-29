// "use client";

// import { useState, useEffect, useCallback } from "react";
// import Image from "next/image";
// import Link from "next/link";

// const SLIDES = [
//   {
//     id: 1,
//     image: "https://i.pinimg.com/1200x/3a/5c/55/3a5c5579c38e470cec6e6b5d7217ea64.jpg",
//     subtitle: "Winter 24 / 25 Collection",
//     title: "Conquer the Peaks",
//     description: "Experience the thrill with our new all-mountain series. Engineered for speed, stability, and deep powder.",
//     cta: "Shop Collection",
//     link: "#products",
//     align: "left",
//     badge: "NEW"
//   },
//   {
//     id: 2,
//     image: "https://images.unsplash.com/photo-1565992441121-4367c2967103?q=80&w=2727&auto=format&fit=crop",
//     subtitle: "New Arrivals",
//     title: "Freestyle Freedom",
//     description: "Lightweight, poppy, and ready for the park. Discover the boards that are changing the game this season.",
//     cta: "View Freestyle",
//     link: "#products",
//     align: "center",
//     badge: "TRENDING"
//   },
//   {
//     id: 3,
//     image: "https://i.pinimg.com/1200x/72/70/21/7270215c42fa432dc04bd88feb856a8a.jpg",
//     subtitle: "Limited Edition",
//     title: "The Ghost Line",
//     description: "Our editors' pick for the season. A directional twin that handles hardpack and storm days with equal grace.",
//     cta: "Shop Ghost Line",
//     link: "#products",
//     align: "left",
//     badge: "EDITORS' PICK"
//   }
// ];

// export default function HeroSlider({ theme = "dark" }) {
//   const [current, setCurrent] = useState(0);
//   const [isHovered, setIsHovered] = useState(false);
//   const [isAutoPlay, setIsAutoPlay] = useState(true);
//   const [progress, setProgress] = useState(0);
//   const [nextSlideIndex, setNextSlideIndex] = useState(1);

//   // Progress bar animation
//   useEffect(() => {
//     if (!isAutoPlay || isHovered) return;

//     const interval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 100) {
//           setCurrent((c) => (c === SLIDES.length - 1 ? 0 : c + 1));
//           return 0;
//         }
//         return prev + (100 / 50); // 5000ms / 50 updates
//       });
//     }, 100);

//     return () => clearInterval(interval);
//   }, [isAutoPlay, isHovered]);

//   // Preload next slide image
//   useEffect(() => {
//     setNextSlideIndex((current + 1) % SLIDES.length);
//   }, [current]);

//   const nextSlide = useCallback(() => {
//     setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
//     setProgress(0);
//     setIsAutoPlay(false);
//     setTimeout(() => setIsAutoPlay(true), 8000);
//   }, []);

//   const prevSlide = useCallback(() => {
//     setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
//     setProgress(0);
//     setIsAutoPlay(false);
//     setTimeout(() => setIsAutoPlay(true), 8000);
//   }, []);

//   const goToSlide = useCallback((index) => {
//     setCurrent(index);
//     setProgress(0);
//     setIsAutoPlay(false);
//     setTimeout(() => setIsAutoPlay(true), 8000);
//   }, []);

//   const isDark = theme === "dark";

//   return (
//     <div 
//       className={`group relative w-full overflow-hidden rounded-2xl transition-all duration-300 ${
//         isDark
//           ? "shadow-2xl shadow-sky-500/20 border border-sky-200/10"
//           : "shadow-2xl shadow-slate-300/40 border border-slate-200/60"
//       }`}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Aspect Ratio Container */}
//       <div className="relative h-[500px] sm:h-[600px] lg:h-screen w-full bg-gradient-to-br from-slate-100 to-slate-200">
        
//         {/* Slides */}
//         {SLIDES.map((slide, index) => (
//           <div
//             key={slide.id}
//             className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
//               index === current 
//                 ? "opacity-100 z-10 scale-100" 
//                 : index === nextSlideIndex
//                 ? "opacity-0 z-5 scale-105"
//                 : "opacity-0 z-0 scale-95"
//             }`}
//           >
//             {/* Background Image with Ken Burns Effect */}
//             <div className="relative h-full w-full overflow-hidden">
//               <Image
//                 src={slide.image}
//                 alt={slide.title}
//                 fill
//                 className={`object-cover transition-transform duration-[8000ms] rounded-2xl ease-out ${
//                   index === current ? "scale-100" : "scale-95"
//                 }`}
//                 priority={index === 0}
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
//               />
              
//               {/* Image brightness filter for light mode */}
//               {!isDark && (
//                 <div className="absolute inset-0 bg-white/15 mix-blend-overlay" />
//               )}
//             </div>

//             {/* Multi-layer Gradient Overlay - IMPROVED FOR LIGHT MODE */}
//             <div className={`absolute inset-0 ${
//               isDark
//                 ? slide.align === 'center' 
//                   ? 'bg-gradient-to-b from-slate-950/50 via-slate-950/30 to-slate-950/50' 
//                   : 'bg-gradient-to-r from-slate-950/80 via-slate-950/50 to-transparent'
//                 : slide.align === 'center'
//                   ? 'bg-gradient-to-b from-black/45 via-black/30 to-black/45'
//                   : 'bg-gradient-to-r from-black/55 via-black/35 to-black/5'
//             }`} />
            
//             {/* Additional radial gradient for depth */}
//             <div className={`absolute inset-0 ${
//               isDark 
//                 ? 'bg-radial-gradient from-transparent via-slate-950/20 to-slate-950/40' 
//                 : 'bg-radial-gradient from-transparent via-black/10 to-black/20'
//             }`} />

//             {/* Content with staggered animations */}
//             <div className={`absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 ${
//               slide.align === 'center' ? 'items-center text-center' : 'items-start text-left'
//             }`}>
              
//               <div className={`space-y-6 max-w-3xl transition-all duration-1000 ${
//                 index === current 
//                   ? "translate-y-0 opacity-100" 
//                   : "translate-y-12 opacity-0"
//               }`}>
                
//                 {/* Badge with animation - IMPROVED */}
//                 <div className="flex items-center gap-3">
//                   <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest backdrop-blur-xl border transition-all duration-500 transform ${
//                     index === current ? "scale-100 opacity-100" : "scale-95 opacity-0"
//                   } ${
//                     isDark
//                       ? "bg-gradient-to-r from-sky-500/30 to-cyan-500/20 text-sky-200 border-sky-500/50 shadow-lg shadow-sky-500/20"
//                       : "bg-gradient-to-r from-white/40 to-white/30 text-white border-white/60 shadow-lg shadow-black/20 font-semibold"
//                   }`}>
//                     <span className={`h-2 w-2 rounded-full animate-pulse ${isDark ? 'bg-sky-400' : 'bg-white'}`} />
//                     {slide.subtitle}
//                   </span>
//                 </div>

//                 {/* Title with better typography - ENHANCED FOR LIGHT MODE */}
//                 <h1 className={`font-black tracking-tight drop-shadow-xl leading-tight ${
//                   isDark
//                     ? "text-4xl sm:text-6xl lg:text-8xl text-white"
//                     : "text-4xl sm:text-6xl lg:text-8xl text-white drop-shadow-2xl"
//                 }`}
//                 style={!isDark ? {
//                   textShadow: "0 4px 20px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)"
//                 } : {}}
//                 >
//                   {slide.title.split(' ').map((word, i) => (
//                     <span 
//                       key={i}
//                       className={`inline-block transition-all duration-1000 ${
//                         index === current 
//                           ? "translate-y-0 opacity-100" 
//                           : "translate-y-8 opacity-0"
//                       }`}
//                       style={{
//                         transitionDelay: index === current ? `${i * 100}ms` : '0ms'
//                       }}
//                     >
//                       {word}&nbsp;
//                     </span>
//                   ))}
//                 </h1>

//                 {/* Description with fade-in - IMPROVED */}
//                 <p className={`text-base sm:text-lg leading-relaxed max-w-xl transition-all duration-1000 delay-200 ${
//                   index === current ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
//                 } ${
//                   isDark
//                     ? "text-slate-200 drop-shadow-lg"
//                     : "text-white drop-shadow-lg font-medium"
//                 }`}
//                 style={!isDark ? {
//                   textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)"
//                 } : {}}>
//                   {slide.description}
//                 </p>

//                 {/* CTA Button with premium styling */}
//                 <div className="pt-6 transition-all duration-1000 delay-300">
//                   <Link
//                     href={slide.link}
//                     className={`group/btn relative inline-flex items-center gap-3 overflow-hidden rounded-full px-8 sm:px-10 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 transform hover:scale-110 active:scale-95 ${
//                       isDark
//                         ? "bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 text-white shadow-2xl shadow-sky-500/40 hover:shadow-sky-400/60 hover:from-sky-400 hover:via-blue-400 hover:to-cyan-400"
//                         : "bg-gradient-to-r from-white/95 via-white/90 to-white/95 text-sky-700 shadow-2xl shadow-black/30 hover:shadow-black/40 hover:from-white hover:via-white hover:to-white font-extrabold"
//                     }`}
//                   >
//                     {/* Animated background shine */}
//                     <span className={`absolute inset-0 -z-10 ${isDark ? 'bg-gradient-to-r from-sky-600 to-blue-600' : 'bg-gradient-to-r from-slate-100 to-slate-200'}`} />
                    
//                     <span className="relative z-10 flex items-center gap-2">
//                       {slide.cta}
//                       <svg className={`h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-2 group-hover/btn:scale-110 ${isDark ? '' : 'text-sky-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//                       </svg>
//                     </span>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}

//         {/* Navigation Arrows - Premium style */}
//         <button
//           onClick={prevSlide}
//           className={`absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 group/nav rounded-full p-3 transition-all duration-300 hover:scale-125 active:scale-90 backdrop-blur-xl ${
//             isDark
//               ? "bg-white/5 hover:bg-white/15 text-white hover:text-sky-300 border border-white/10 hover:border-white/20 shadow-xl shadow-black/20"
//               : "bg-white/20 hover:bg-white/35 text-white hover:text-white border border-white/30 hover:border-white/50 shadow-xl shadow-black/30"
//           }`}
//           aria-label="Previous slide"
//         >
//           <svg className="h-6 w-6 transition-transform group-hover/nav:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//           </svg>
//         </button>

//         <button
//           onClick={nextSlide}
//           className={`absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 group/nav rounded-full p-3 transition-all duration-300 hover:scale-125 active:scale-90 backdrop-blur-xl ${
//             isDark
//               ? "bg-white/5 hover:bg-white/15 text-white hover:text-sky-300 border border-white/10 hover:border-white/20 shadow-xl shadow-black/20"
//               : "bg-white/20 hover:bg-white/35 text-white hover:text-white border border-white/30 hover:border-white/50 shadow-xl shadow-black/30"
//           }`}
//           aria-label="Next slide"
//         >
//           <svg className="h-6 w-6 transition-transform group-hover/nav:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//           </svg>
//         </button>

//         {/* Dots Indicators - Premium version */}
//         <div className="absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 gap-3 sm:gap-4">
//           {SLIDES.map((_, idx) => (
//             <button
//               key={idx}
//               onClick={() => goToSlide(idx)}
//               className={`rounded-full transition-all duration-500 group/dot relative ${
//                 idx === current 
//                   ? isDark
//                     ? "w-10 h-3 bg-gradient-to-r from-sky-400 to-blue-500 shadow-lg shadow-sky-500/50"
//                     : "w-10 h-3 bg-gradient-to-r from-white to-slate-100 shadow-lg shadow-black/40"
//                   : isDark
//                     ? "w-3 h-3 bg-white/30 hover:bg-white/50 hover:scale-110"
//                     : "w-3 h-3 bg-white/50 hover:bg-white/80 hover:scale-110"
//               }`}
//               aria-label={`Go to slide ${idx + 1}`}
//               aria-current={idx === current ? "true" : "false"}
//             />
//           ))}
//         </div>

//         {/* Progress Bar - Modern linear progress */}
//         <div className={`absolute bottom-0 left-0 h-1 transition-all duration-100 ease-linear ${
//           isDark
//             ? "bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 shadow-lg shadow-sky-500/50"
//             : "bg-gradient-to-r from-white via-slate-100 to-white shadow-lg shadow-black/30"
//         }`}
//         style={{ width: `${progress}%` }}
//         />
//       </div>

//       {/* Keyboard navigation hint (mobile hidden) */}
//       <div className={`hidden lg:flex absolute bottom-4 left-1/2 -translate-x-1/2 items-center gap-2 px-3 py-1 rounded-full backdrop-blur-sm text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
//         isDark
//           ? "bg-white/5 text-slate-400 border border-white/10"
//           : "bg-white/20 text-white border border-white/30 font-semibold"
//       }`}>
//         <span>← →</span>
//         <span>to navigate</span>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

// Fallback slides used when Sanity is unavailable or returns no slides
const FALLBACK_SLIDES = [
  {
    id: 'fallback-1',
    subtitle: 'Winter 24 / 25 Collection',
    title: 'Conquer the Peaks',
    description: 'Experience the thrill with our new all-mountain series. Engineered for speed, stability, and deep powder.',
    image: 'https://i.pinimg.com/1200x/3a/5c/55/3a5c5579c38e470cec6e6b5d7217ea64.jpg',
    cta: 'Shop Collection',
    link: '#products',
    align: 'left',
    badge: 'NEW',
    order: 0,
  },
  {
    id: 'fallback-2',
    subtitle: 'New Arrivals',
    title: 'Freestyle Freedom',
    description: 'Lightweight, poppy, and ready for the park. Discover the boards that are changing the game this season.',
    image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?q=80&w=2727&auto=format&fit=crop',
    cta: 'View Freestyle',
    link: '#products',
    align: 'center',
    badge: 'TRENDING',
    order: 1,
  },
  {
    id: 'fallback-3',
    subtitle: 'Limited Edition',
    title: 'The Ghost Line',
    description: "Our editors' pick for the season. A directional twin that handles hardpack and storm days with equal grace.",
    image: 'https://i.pinimg.com/1200x/c0/66/b2/c066b2ca1294e2329d8be4c07592f407.jpg',
    cta: 'Shop Ghost Line',
    link: '#products',
    align: 'left',
    badge: "EDITORS' PICK",
    order: 2,
  },
];

export default function HeroSlider({ theme = "dark" }) {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [progress, setProgress] = useState(0);
  const [nextSlideIndex, setNextSlideIndex] = useState(1);

  // Fetch slides from Sanity (client-safe public client)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const module = await import("../lib/sanity.client");
        const client = module.default;
        const urlFor = module.urlFor;

        const query = `*[_type == "heroSlider" && isActive == true][0]{
          slides[] | order(order asc){
            id, subtitle, title, description, image, ctaText, ctaLink, alignment, badge, order, isActive
          }
        }`;

        const data = await client.fetch(query);
        const raw = data?.slides || [];

        let mapped = (raw || [])
          .filter((s) => s.isActive)
          .sort((a, b) => (Number(a.order || 0) - Number(b.order || 0)))
          .map((s) => ({
            id: s.id || s._key || s._id,
            subtitle: s.subtitle,
            title: s.title,
            description: s.description,
            image: s.image ? urlFor(s.image).width(1920).height(1080).auto('format').url() : null,
            cta: s.ctaText,
            link: s.ctaLink || '#',
            align: s.alignment || 'left',
            badge: s.badge,
            order: s.order || 0,
          }));

        // If Sanity returned no slides, fall back to our default static slides
        if (!mapped || mapped.length === 0) {
          mapped = FALLBACK_SLIDES;
        }

        if (mounted) {
          setSlides(mapped);
          setLoading(false);
          setCurrent(0);
          setNextSlideIndex(mapped.length > 1 ? 1 : 0);
        }
      } catch (err) {
        console.error('Error fetching hero slides from Sanity:', err);
        // On error, populate with fallback slides so the UI still shows a working slider
        if (mounted) {
          setSlides(FALLBACK_SLIDES);
          setLoading(false);
          setCurrent(0);
          setNextSlideIndex(FALLBACK_SLIDES.length > 1 ? 1 : 0);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Progress bar animation
  useEffect(() => {
    if (!isAutoPlay || isHovered || slides.length === 0) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));
          return 0;
        }
        return prev + (100 / 50); // 5000ms / 50 updates
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isAutoPlay, isHovered, slides.length]);

  // Preload next slide index
  useEffect(() => {
    setNextSlideIndex((current + 1) % (slides.length || 1));
  }, [current, slides.length]);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setProgress(0);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 8000);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setProgress(0);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 8000);
  }, [slides.length]);

  const goToSlide = useCallback((index) => {
    setCurrent(index);
    setProgress(0);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 8000);
  }, []);

  const isDark = theme === "dark";

  // If still loading, render a simple placeholder to avoid layout shift
  if (loading) {
    return (
      <div className="w-full h-[500px] sm:h-[600px] lg:h-screen flex items-center justify-center bg-gray-100 rounded-2xl">
        <div>Loading slides…</div>
      </div>
    );
  }

  if (!slides.length) {
    return (
      <div className="w-full h-[500px] sm:h-[600px] lg:h-screen flex items-center justify-center bg-gray-50 rounded-2xl">
        <div>No slides published. Open Sanity Studio and publish a Hero Slider.</div>
      </div>
    );
  }

  return (
    <div
      className={`group relative w-full overflow-hidden rounded-2xl transition-all duration-300 ${
        isDark
          ? "shadow-2xl shadow-sky-500/20 border border-sky-200/10"
          : "shadow-2xl shadow-slate-300/40 border border-slate-200/60"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Aspect Ratio Container */}
      <div className="relative h-[500px] sm:h-[600px] lg:h-screen w-full bg-gradient-to-br from-slate-100 to-slate-200">

        {/* Slides */}
        {slides.map((slide, index) => (
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
            <div className="relative h-full w-full overflow-hidden">
              {slide.image ? (
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className={`object-cover transition-transform duration-[8000ms] rounded-2xl ease-out ${
                    index === current ? "scale-100" : "scale-95"
                  }`}
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200" />
              )}

              {/* Image brightness filter for light mode */}
              {!isDark && <div className="absolute inset-0 bg-white/15 mix-blend-overlay" />}
            </div>

            {/* Multi-layer Gradient Overlay - IMPROVED FOR LIGHT MODE */}
            <div
              className={`absolute inset-0 ${
                isDark
                  ? slide.align === 'center'
                    ? 'bg-gradient-to-b from-slate-950/50 via-slate-950/30 to-slate-950/50'
                    : 'bg-gradient-to-r from-slate-950/80 via-slate-950/50 to-transparent'
                  : slide.align === 'center'
                  ? 'bg-gradient-to-b from-black/45 via-black/30 to-black/45'
                  : 'bg-gradient-to-r from-black/55 via-black/35 to-black/5'
              }`}
            />

            {/* Additional radial gradient for depth */}
            <div
              className={`absolute inset-0 ${
                isDark
                  ? 'bg-radial-gradient from-transparent via-slate-950/20 to-slate-950/40'
                  : 'bg-radial-gradient from-transparent via-black/10 to-black/20'
              }`}
            />

            {/* Content with staggered animations */}
            <div
              className={`absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 ${
                slide.align === 'center' ? 'items-center text-center' : 'items-start text-left'
              }`}
            >
              <div
                className={`space-y-6 max-w-3xl transition-all duration-1000 ${
                  index === current ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
              >
                {/* Badge with animation - IMPROVED */}
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest backdrop-blur-xl border transition-all duration-500 transform ${
                      index === current ? "scale-100 opacity-100" : "scale-95 opacity-0"
                    } ${
                      isDark
                        ? "bg-gradient-to-r from-sky-500/30 to-cyan-500/20 text-sky-200 border-sky-500/50 shadow-lg shadow-sky-500/20"
                        : "bg-gradient-to-r from-white/40 to-white/30 text-white border-white/60 shadow-lg shadow-black/20 font-semibold"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full animate-pulse ${isDark ? 'bg-sky-400' : 'bg-white'}`} />
                    {slide.subtitle}
                  </span>
                </div>

                {/* Title with better typography - ENHANCED FOR LIGHT MODE */}
                <h1
                  className={`font-black tracking-tight drop-shadow-xl leading-tight ${
                    isDark
                      ? "text-4xl sm:text-6xl lg:text-8xl text-white"
                      : "text-4xl sm:text-6xl lg:text-8xl text-white drop-shadow-2xl"
                  }`}
                  style={!isDark ? { textShadow: "0 4px 20px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)" } : {}}
                >
                  {slide.title.split(' ').map((word, i) => (
                    <span
                      key={i}
                      className={`inline-block transition-all duration-1000 ${
                        index === current ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                      }`}
                      style={{ transitionDelay: index === current ? `${i * 100}ms` : '0ms' }}
                    >
                      {word}&nbsp;
                    </span>
                  ))}
                </h1>

                {/* Description with fade-in - IMPROVED */}
                <p
                  className={`text-base sm:text-lg leading-relaxed max-w-xl transition-all duration-1000 delay-200 ${
                    index === current ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  } ${
                    isDark ? "text-slate-200 drop-shadow-lg" : "text-white drop-shadow-lg font-medium"
                  }`}
                  style={!isDark ? { textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)" } : {}}
                >
                  {slide.description}
                </p>

                {/* CTA Button with premium styling */}
                <div className="pt-6 transition-all duration-1000 delay-300">
                  <Link
                    href={slide.link}
                    className={`group/btn relative inline-flex items-center gap-3 overflow-hidden rounded-full px-8 sm:px-10 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                      isDark
                        ? "bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 text-white shadow-2xl shadow-sky-500/40 hover:shadow-sky-400/60 hover:from-sky-400 hover:via-blue-400 hover:to-cyan-400"
                        : "bg-gradient-to-r from-white/95 via-white/90 to-white/95 text-sky-700 shadow-2xl shadow-black/30 hover:shadow-black/40 hover:from-white hover:via-white hover:to-white font-extrabold"
                    }`}
                  >
                    {/* Animated background shine */}
                    <span className={`absolute inset-0 -z-10 ${isDark ? 'bg-gradient-to-r from-sky-600 to-blue-600' : 'bg-gradient-to-r from-slate-100 to-slate-200'}`} />

                    <span className="relative z-10 flex items-center gap-2">
                      {slide.cta}
                      <svg className={`h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-2 group-hover/btn:scale-110 ${isDark ? '' : 'text-sky-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              : "bg-white/20 hover:bg-white/35 text-white hover:text-white border border-white/30 hover:border-white/50 shadow-xl shadow-black/30"
          }`}
          aria-label="Previous slide"
        >
          <svg className="h-6 w-6 transition-transform group-hover/nav:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className={`absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 group/nav rounded-full p-3 transition-all duration-300 hover:scale-125 active:scale-90 backdrop-blur-xl ${
            isDark
              ? "bg-white/5 hover:bg-white/15 text-white hover:text-sky-300 border border-white/10 hover:border-white/20 shadow-xl shadow-black/20"
              : "bg-white/20 hover:bg-white/35 text-white hover:text-white border border-white/30 hover:border-white/50 shadow-xl shadow-black/30"
          }`}
          aria-label="Next slide"
        >
          <svg className="h-6 w-6 transition-transform group-hover/nav:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots Indicators - Premium version */}
        <div className="absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 gap-3 sm:gap-4">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`rounded-full transition-all duration-500 group/dot relative ${
                idx === current
                  ? isDark
                    ? "w-10 h-3 bg-gradient-to-r from-sky-400 to-blue-500 shadow-lg shadow-sky-500/50"
                    : "w-10 h-3 bg-gradient-to-r from-white to-slate-100 shadow-lg shadow-black/40"
                  : isDark
                    ? "w-3 h-3 bg-white/30 hover:bg-white/50 hover:scale-110"
                    : "w-3 h-3 bg-white/50 hover:bg-white/80 hover:scale-110"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === current ? "true" : "false"}
            />
          ))}
        </div>

        {/* Progress Bar - Modern linear progress */}
        <div
          className={`absolute bottom-0 left-0 h-1 transition-all duration-100 ease-linear ${
            isDark
              ? "bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 shadow-lg shadow-sky-500/50"
              : "bg-gradient-to-r from-white via-slate-100 to-white shadow-lg shadow-black/30"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Keyboard navigation hint (mobile hidden) */}
      <div className={`hidden lg:flex absolute bottom-4 left-1/2 -translate-x-1/2 items-center gap-2 px-3 py-1 rounded-full backdrop-blur-sm text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
        isDark
          ? "bg-white/5 text-slate-400 border border-white/10"
          : "bg-white/20 text-white border border-white/30 font-semibold"
      }`}>
        <span>← →</span>
        <span>to navigate</span>
      </div>
    </div>
  );
} 