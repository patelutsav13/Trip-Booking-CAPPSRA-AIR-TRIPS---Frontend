import React from 'react';
import { Plane } from 'lucide-react';

const PlaneAnimation = ({ overlay = false }) => {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden z-10 ${overlay ? 'opacity-90' : ''}`}>
      {/* Continuous Flying Plane Motion 1 */}
      <div className="absolute top-[18%] -left-[100px] animate-flying-plane flex items-center gap-2">
        <div className="relative">
          {/* Airplane Icon */}
          <div className="w-10 h-10 text-blue-300 transform rotate-[18deg] filter drop-shadow-[0_4px_10px_rgba(59,130,246,0.5)]">
            <Plane size={36} fill="#60a5fa" stroke="#ffffff" strokeWidth={1.5} />
          </div>
          {/* Jet Engine Glow */}
          <div className="absolute top-1/2 left-0 w-3 h-3 bg-cyan-400 rounded-full blur-sm animate-ping"></div>
        </div>
        {/* Jet Vapor Trail */}
        <div className="h-[3px] w-64 bg-gradient-to-l from-white/80 via-blue-200/40 to-transparent rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
      </div>

      {/* Secondary Flying Plane Motion (Higher Altitude) */}
      <div className="absolute top-[8%] -left-[120px] animate-flying-plane-fast flex items-center gap-2 opacity-60">
        <div className="w-6 h-6 text-indigo-200 transform rotate-[12deg]">
          <Plane size={24} fill="#a5b4fc" stroke="#ffffff" />
        </div>
        <div className="h-[2px] w-40 bg-gradient-to-l from-white/60 to-transparent rounded-full"></div>
      </div>

      {/* Floating Ambient Clouds */}
      <div className="absolute top-10 left-[10%] w-24 h-8 bg-white/10 backdrop-blur-md rounded-full animate-float-slow"></div>
      <div className="absolute top-24 right-[15%] w-32 h-10 bg-white/15 backdrop-blur-md rounded-full animate-float"></div>
      <div className="absolute bottom-12 left-[25%] w-40 h-12 bg-white/10 backdrop-blur-md rounded-full animate-float-slow"></div>
    </div>
  );
};

export default PlaneAnimation;
