'use client';

import React from 'react';
import { Instagram } from 'lucide-react';

export function InstagramGrid() {
  const images = [
    { id: 1, src: '/images/instagram/ig-1.png', alt: 'Gold Diamond Rings Stack' },
    { id: 2, src: '/images/instagram/ig-2.png', alt: 'Model wearing Gold Necklace' },
    { id: 3, src: '/images/instagram/ig-3.png', alt: 'Jeweler Crafting Gold Ring' },
    { id: 4, src: '/images/instagram/ig-4.png', alt: 'Model showing Diamond Ring' }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 py-20 border-t border-border">
      {/* Topographic/Wavy Background SVG */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none text-slate-900">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0 50 Q 250 150 500 50 T 1000 50 T 1500 50" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M 0 100 Q 300 200 600 100 T 1200 100 T 1800 100" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M 0 150 Q 200 80 500 150 T 1000 150 T 1500 150" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M 0 200 Q 400 300 800 200 T 1600 200" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 0 250 Q 350 150 700 250 T 1400 250" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-500/30 text-amber-600 mb-4 bg-amber-50/50">
            <Instagram className="h-5 w-5 stroke-[1.5]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-light text-foreground tracking-wider font-serif">
            CarateHope instagram
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {images.map((img) => (
            <a 
              key={img.id}
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-lg bg-slate-100 shadow-sm border border-slate-200/50 block"
            >
              <img 
                src={img.src} 
                alt={img.alt} 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Instagram className="text-white h-7 w-7 stroke-[1.5] transform scale-90 group-hover:scale-100 transition-transform duration-300" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
