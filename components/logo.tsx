'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  textColorClass?: string;
}

export function Logo({ className = "h-8", textColorClass = "text-foreground" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icon: Diamond + Star (Carat + Hope) */}
      <svg
        viewBox="0 0 100 100"
        className="h-full aspect-square text-[#b97a57] shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M50 15 L80 40 L50 85 L20 40 Z"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M20 40 H80"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M50 15 L50 85"
          stroke="currentColor"
          strokeWidth="3.5"
        />
        <path
          d="M50 15 L33 40 L50 85"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M50 15 L67 40 L50 85"
          stroke="currentColor"
          strokeWidth="2"
        />
        {/* Star in the center */}
        <path
          d="M50 28 L53 37 L62 40 L53 43 L50 52 L47 43 L38 40 L47 37 Z"
          fill="currentColor"
        />
      </svg>
      {/* Brand Text */}
      <span className={`font-serif tracking-[0.2em] text-lg font-light uppercase transition-colors duration-300 ${textColorClass}`}>
        Carate<span className="font-semibold text-[#b97a57]">Hope</span>
      </span>
    </div>
  );
}
