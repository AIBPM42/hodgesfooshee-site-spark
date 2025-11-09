import React from "react";

export function Gauge({ value, label }:{ value:number; label:string }){
  // value 0..100
  const angle=(-180)+(value*1.8); // sweep -180..0
  return(
    <div className="relative w-full max-w-sm aspect-[2/1]">
      <svg viewBox="0 0 200 100" className="w-full h-full">
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e"/>
            <stop offset="50%" stopColor="#eab308"/>
            <stop offset="100%" stopColor="#ef4444"/>
          </linearGradient>
        </defs>
        <path d="M10,100 A90,90 0 0 1 190,100" stroke="url(#g)" strokeWidth="16" fill="none" strokeLinecap="round"/>
        <circle cx="100" cy="100" r="4" fill="white"/>
        <g transform={`rotate(${angle} 100 100)`}>
          <rect x="98" y="20" width="4" height="82" fill="white" rx="2"/>
        </g>
      </svg>
      <div className="absolute inset-x-0 bottom-2 text-center">
        <div className="text-xs text-white/60">{label}</div>
        <div className="text-xl font-semibold">{value}%</div>
      </div>
    </div>
  );
}
