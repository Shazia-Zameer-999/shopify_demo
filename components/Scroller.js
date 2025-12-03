// "use client"
// import { useEffect, useState } from 'react'
// import React from 'react'
// const ANNOUNCEMENTS = [
//     { text: "🎿 Winter Sale: Up to 40% off selected boards", highlight: "40% off" },
//     { text: "🚚 Free shipping on orders over $99", highlight: "Free shipping" },
//     { text: "⭐ New 2025 collection now available", highlight: "New 2025" },
//     { text: "🎁 Sign up for 15% off your first order", highlight: "15% off" },
// ];

// const Scroller = () => {

//     const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setCurrentAnnouncement((prev) => (prev + 1) % ANNOUNCEMENTS.length);
//         }, 3000);
//         return () => clearInterval(interval);
//     }, []);
//     return (
//         <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50">
//             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

//             <div className="relative mx-auto max-w-7xl px-4 py-2">
//                 <div className="flex items-center justify-between gap-4 text-xs">
//                     <div className="flex-1 flex items-center justify-center gap-2 overflow-hidden">
//                         <div
//                             key={currentAnnouncement}
//                             className="animate-in fade-in slide-in-from-bottom-2 duration-500"
//                         >
//                             <span className="text-slate-300">
//                                 {ANNOUNCEMENTS[currentAnnouncement].text.split(ANNOUNCEMENTS[currentAnnouncement].highlight)[0]}
//                                 <span className="font-bold text-sky-300">
//                                     {ANNOUNCEMENTS[currentAnnouncement].highlight}
//                                 </span>
//                                 {ANNOUNCEMENTS[currentAnnouncement].text.split(ANNOUNCEMENTS[currentAnnouncement].highlight)[1]}
//                             </span>
//                         </div>
//                     </div>

//                     <div className="hidden lg:flex items-center gap-4 text-slate-400">
//                         <button className="hover:text-sky-300 transition-colors flex items-center gap-1 group">
//                             <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                             </svg>
//                             <span>24/7 Support</span>
//                         </button>
//                         <span className="text-slate-600">|</span>
//                         <button className="hover:text-sky-300 transition-colors flex items-center gap-1 group">
//                             <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                             </svg>
//                             <span>Store Locator</span>
//                         </button>
//                         <span className="text-slate-600">|</span>
//                         <select className="bg-transparent border-none text-xs cursor-pointer hover:text-sky-300 transition-colors focus:outline-none">
//                             <option value="USD">USD $</option>
//                             <option value="EUR">EUR €</option>
//                             <option value="GBP">GBP £</option>
//                             <option value="CAD">CAD $</option>
//                         </select>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Scroller

// "use client"
// import React, { useEffect, useRef, useState } from "react"

// const ANNOUNCEMENTS = [
//   { text: "🎿 Winter Sale: Up to 40% off selected boards", highlight: "40% off" },
//   { text: "🚚 Free shipping on orders over $99", highlight: "Free shipping" },
//   { text: "⭐ New 2025 collection now available", highlight: "New 2025" },
//   { text: "🎁 Sign up for 15% off your first order", highlight: "15% off" },
// ];

// const Scroller = () => {
//   const [index, setIndex] = useState(0);
//   const [paused, setPaused] = useState(false);
//   const [key, setKey] = useState(0); // force restart animation
//   const textRef = useRef<HTMLDivElement | null>(null);

//   // When animation ends, go to next announcement and restart animation
//   const handleAnimationEnd = () => {
//     setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
//     setKey((k) => k + 1);
//   };

//   const current = ANNOUNCEMENTS[index];
//   const [before, after] = current.text.split(current.highlight);

//   return (
//     <div
//       className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50"
//       onMouseEnter={() => setPaused(true)}
//       onMouseLeave={() => setPaused(false)}
//     >
//       {/* subtle pattern bg */}
//       <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

//       <div className="relative mx-auto max-w-7xl px-4 py-2">
//         <div className="flex items-center justify-between gap-4 text-xs">
//           {/* single-line ticker */}
//           <div className="flex-1 overflow-hidden">
//             <div
//               key={key}
//               ref={textRef}
//               onAnimationEnd={handleAnimationEnd}
//               className="inline-block whitespace-nowrap will-change-transform"
//               style={{
//                 animation: paused ? "none" : "single-ticker 10s linear forwards",
//               }}
//             >
//               <span className="text-slate-300">
//                 {before}
//                 <span className="font-bold text-sky-300">{current.highlight}</span>
//                 {after}
//               </span>
//             </div>
//           </div>

//           {/* right-side controls (kept same as before) */}
//           <div className="hidden lg:flex items-center gap-4 text-slate-400">
//             <button className="hover:text-sky-300 transition-colors flex items-center gap-1 group">
//               <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//               </svg>
//               <span>24/7 Support</span>
//             </button>
//             <span className="text-slate-600">|</span>
//             <button className="hover:text-sky-300 transition-colors flex items-center gap-1 group">
//               <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//               </svg>
//               <span>Store Locator</span>
//             </button>
//             <span className="text-slate-600">|</span>
//             <select className="bg-transparent border-none text-xs cursor-pointer hover:text-sky-300 transition-colors focus:outline-none">
//               <option value="USD">USD $</option>
//               <option value="EUR">EUR €</option>
//               <option value="GBP">GBP £</option>
//               <option value="CAD">CAD $</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* keyframes for single-line scroll */}
//       <style jsx>{`
//         @keyframes single-ticker {
//           0% {
//             transform: translateX(100%);
//           }
//           100% {
//             transform: translateX(-100%);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Scroller;
"use client"
import React, { useState } from "react"

const ANNOUNCEMENTS = [
  { text: "🎿 Winter Sale: Up to 40% off selected boards", highlight: "40% off" },
  { text: "🚚 Free shipping on orders over $99", highlight: "Free shipping" },
  { text: "⭐ New 2025 collection now available", highlight: "New 2025" },
  { text: "🎁 Sign up for 15% off your first order", highlight: "15% off" },
];

const Scroller = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [runId, setRunId] = useState(0); // forces the animation to restart

  const current = ANNOUNCEMENTS[index];
  const [before, after] = current.text.split(current.highlight);

  const handleAnimationEnd = () => {
    // move to next announcement and restart animation
    setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    setRunId((id) => id + 1);
  };

  return (
    <div
      className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 py-2">
        <div className="flex items-center justify-between gap-4 text-xs">
          {/* single-line ticker */}
          <div className="flex-1 overflow-hidden">
            <div
              key={runId}
              onAnimationEnd={handleAnimationEnd}
              className="inline-block whitespace-nowrap will-change-transform"
              style={{
                animation: paused
                  ? "none"
                  : "single-ticker 10s linear forwards",
              }}
            >
              <span className="text-slate-300">
                {before}
                <span className="font-bold text-sky-300">{current.highlight}</span>
                {after}
              </span>
            </div>
          </div>

          {/* right‑side controls (unchanged) */}
          <div className="hidden lg:flex items-center gap-4 text-slate-400">
            <button className="hover:text-sky-300 transition-colors flex items-center gap-1 group">
              <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>24/7 Support</span>
            </button>
            <span className="text-slate-600">|</span>
            <button className="hover:text-sky-300 transition-colors flex items-center gap-1 group">
              <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Store Locator</span>
            </button>
            <span className="text-slate-600">|</span>
            <select className="bg-transparent border-none text-xs cursor-pointer hover:text-sky-300 transition-colors focus:outline-none">
              <option value="USD">USD $</option>
              <option value="EUR">EUR €</option>
              <option value="GBP">GBP £</option>
              <option value="CAD">CAD $</option>
            </select>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes single-ticker {
          0% {
            transform: translateX(100%);   /* start just outside right */
          }
          100% {
            transform: translateX(-100%);  /* end just outside left */
          }
        }
      `}</style>
    </div>
  );
};

export default Scroller;