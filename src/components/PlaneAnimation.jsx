import React from 'react';
import { Plane, Fan } from 'lucide-react';

const PlaneAnimation = ({ overlay = false }) => {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden z-10 ${overlay ? 'opacity-90' : ''}`}>
      {/* Running Clouds Layer 1 (Drifting from Right to Left) */}
      <div className="absolute inset-0 flex items-center justify-between opacity-35 animate-clouds-drift">
        <div className="w-48 h-16 bg-white/20 blur-md rounded-full transform -translate-y-12"></div>
        <div className="w-72 h-24 bg-white/25 blur-lg rounded-full transform translate-y-6"></div>
        <div className="w-64 h-20 bg-white/20 blur-md rounded-full transform -translate-y-8"></div>
        <div className="w-56 h-18 bg-white/30 blur-md rounded-full transform translate-y-10"></div>
      </div>

      {/* Running Clouds Layer 2 (Faster Drifting) */}
      <div className="absolute inset-0 flex items-center justify-around opacity-25 animate-clouds-drift-fast">
        <div className="w-80 h-28 bg-blue-100/20 blur-xl rounded-full transform translate-y-4"></div>
        <div className="w-60 h-20 bg-white/30 blur-md rounded-full transform -translate-y-14"></div>
        <div className="w-96 h-32 bg-cyan-100/20 blur-xl rounded-full transform translate-y-12"></div>
      </div>

      {/* Main Flying Plane with Spinning Fan Propeller & Jet Smoke Trail */}
      <div className="absolute top-[22%] -left-[140px] animate-flying-plane flex items-center gap-3">
        <div className="relative flex items-center justify-center">
          {/* Airplane Body */}
          <div className="w-14 h-14 text-blue-200 transform rotate-[18deg] filter drop-shadow-[0_6px_15px_rgba(59,130,246,0.6)]">
            <Plane size={48} fill="#3b82f6" stroke="#ffffff" strokeWidth={1.5} />
          </div>

          {/* Engine Propeller Fan (Spinning Fan Motion) */}
          <div className="absolute -top-1 left-7 w-6 h-6 text-cyan-300 animate-spin-fast">
            <Fan size={20} className="filter drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </div>

          {/* Jet Engine Glow */}
          <div className="absolute top-1/2 left-1 w-4 h-4 bg-cyan-400 rounded-full blur-sm animate-ping"></div>
        </div>

        {/* Jet Vapor Smoke Trail */}
        <div className="h-[4px] w-80 bg-gradient-to-l from-white/90 via-blue-200/50 to-transparent rounded-full shadow-[0_0_12px_rgba(255,255,255,0.9)]"></div>
      </div>

      {/* Secondary High-Altitude Flying Plane */}
      <div className="absolute top-[8%] -left-[160px] animate-flying-plane-fast flex items-center gap-2 opacity-70">
        <div className="relative">
          <div className="w-8 h-8 text-indigo-200 transform rotate-[12deg]">
            <Plane size={28} fill="#818cf8" stroke="#ffffff" />
          </div>
          <div className="absolute top-0 right-0 w-4 h-4 text-white animate-spin">
            <Fan size={12} />
          </div>
        </div>
        <div className="h-[2px] w-52 bg-gradient-to-l from-white/70 to-transparent rounded-full"></div>
      </div>
    </div>
  );
};

export default PlaneAnimation;
