import React from 'react';

const CappsraLogo = ({ className = "h-10 w-auto", showText = true, variant = "full" }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Cappsra Official Emblem Badge */}
      <div className="relative w-11 h-11 flex-shrink-0 group">
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md transition-transform duration-300 group-hover:scale-105">
          <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>
            <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id="seaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="mountGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>

          {/* Outer Ring */}
          <circle cx="100" cy="100" r="92" fill="none" stroke="#1e3a8a" strokeWidth="8" />
          <circle cx="100" cy="100" r="86" fill="url(#skyGrad)" />

          {/* Sun */}
          <circle cx="120" cy="70" r="28" fill="url(#sunGrad)" />

          {/* Mountains */}
          <polygon points="50,140 90,80 120,130" fill="url(#mountGrad)" />
          <polygon points="80,140 125,70 165,140" fill="#1e293b" />
          <polygon points="90,80 100,95 85,95" fill="#ffffff" opacity="0.9" />
          <polygon points="125,70 138,90 118,90" fill="#ffffff" opacity="0.9" />

          {/* Sea & Sand Beach */}
          <path d="M 20,135 Q 100,165 180,135 L 180,180 Q 100,180 20,180 Z" fill="url(#seaGrad)" />
          <path d="M 20,150 Q 80,175 180,150 L 180,180 Q 100,185 20,180 Z" fill="#fde047" />

          {/* Palm Trees */}
          <path d="M 35,160 Q 40,135 48,125" stroke="#15803d" strokeWidth="4" fill="none" />
          <circle cx="48" cy="122" r="8" fill="#16a34a" />

          {/* Flying Airplane & Trail */}
          <path d="M 40,110 Q 100,60 160,40" stroke="#ffffff" strokeWidth="4" strokeDasharray="6 4" fill="none" opacity="0.85" />
          <g transform="translate(150, 35) rotate(-20) scale(0.7)">
            <path d="M0,12 L30,0 L24,12 L35,16 L24,20 L30,32 L0,20 L-6,16 Z" fill="#1e3a8a" />
          </g>

          {/* Location Pin */}
          <g transform="translate(115, 15) scale(0.9)">
            <path d="M12,0 C5.37,0 0,5.37 0,12 C0,21 12,32 12,32 C12,32 24,21 24,12 C24,5.37 18.63,0 12,0 Z" fill="#ef4444" />
            <circle cx="12" cy="11" r="5" fill="#ffffff" />
          </g>

          {/* Outer Border */}
          <circle cx="100" cy="100" r="94" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.5" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-500">
              Cappsra
            </span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
              AIR
            </span>
          </div>
          {variant === "full" && (
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
              Trip Booking • Discover • Plan • Go
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default CappsraLogo;
