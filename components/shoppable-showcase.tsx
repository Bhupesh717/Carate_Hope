'use client';

import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HotspotProps {
  top: string;
  left: string;
  title: string;
  price: string;
  link: string;
}

function Hotspot({ top, left, title, price, link }: HotspotProps) {
  return (
    <div
      className="absolute group/hotspot transition-all duration-300"
      style={{ top, left }}
    >
      {/* Pulse Effect */}
      <span className="absolute inset-0 rounded-full bg-white/50 animate-ping" />

      {/* Hotspot Trigger Button */}
      <button
        className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-500"
        aria-label={`View ${title}`}
      >
        <Plus className="h-4 w-4 stroke-[2]" />
      </button>

      {/* Hover Popup Card */}
      <div className="absolute left-1/2 bottom-10 -translate-x-1/2 w-48 scale-95 opacity-0 group-hover/hotspot:opacity-100 group-hover/hotspot:scale-100 transition-all duration-300 pointer-events-none group-hover/hotspot:pointer-events-auto bg-white/95 backdrop-blur-md p-3 rounded-lg shadow-xl border border-slate-100 z-20">
        <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">{title}</h4>
        <p className="text-xs text-amber-600 font-medium mt-0.5">{price}</p>
        <Link href={link} className="text-[10px] uppercase font-semibold text-slate-500 hover:text-amber-600 transition-colors block mt-2 tracking-wider">
          Shop Now &rarr;
        </Link>
      </div>
    </div>
  );
}

export function ShoppableShowcase() {
  return (
    <section className="w-full bg-white border-t border-border overflow-hidden">
      {/* Row 1: Video Left, Text Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-stretch border-b border-border">
        {/* Video Column */}
        <div className="relative w-full h-[400px] md:h-auto min-h-[450px] overflow-hidden bg-slate-50">
          <video
            src="/images/showcase-1.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark Overlay for better visibility */}
          <div className="absolute inset-0 bg-black/5" />

          {/* Shoppable Hotspot on the Ring */}
          {/* <Hotspot
            top="50%"
            left="50%"
            title="Golden Engagement Ring"
            price="$120.00"
            link="/shop"
          /> */}
        </div>

        {/* Text Content */}
        <div className="flex flex-col justify-center items-center text-center p-12 md:p-24 bg-white">
          <div className="space-y-6 max-w-md">
            <h3 className="text-3xl md:text-4xl font-light tracking-wide text-[#b97a57] font-serif leading-tight">
              Curated by color
            </h3>
            <p className="text-slate-500 leading-relaxed text-sm md:text-base font-light">
              Brighten up your look with vibrant gemstone jewelry. Discover selected styles crafted in warm gold and colorful tones.
            </p>
            <div className="pt-4">
              <Button asChild className="rounded-none bg-[#c88a6d] hover:bg-[#b0775d] text-white px-8 py-6 text-xs tracking-widest font-light transition-colors uppercase">
                <Link href="/shop">
                  Shop Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Text Left, Video Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-stretch ">
        {/* Text Content (first on desktop, second on mobile) */}
        <div className="flex flex-col justify-center items-center text-center p-12 md:p-24 bg-white order-2 md:order-1">
          <div className="space-y-6 max-w-md">
            <h3 className="text-3xl md:text-4xl font-light tracking-wide text-[#b97a57] font-serif leading-tight">
              Make the connection
            </h3>
            <p className="text-slate-500 leading-relaxed text-sm md:text-base font-light">
              Introducing your outfit's missing link. Designed to be layered or worn alone as a bold, elegant statement.
            </p>
            <div className="pt-4">
              <Button asChild className="rounded-none bg-[#c88a6d] hover:bg-[#b0775d] text-white px-8 py-6 text-xs tracking-widest font-light transition-colors uppercase">
                <Link href="/shop">
                  Shop Now
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Video Column (second on desktop, first on mobile) */}
        <div className="relative w-full h-[400px] md:h-auto min-h-[450px] overflow-hidden bg-slate-50 order-1 md:order-2">
          <video
            src="/images/showcase-2.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark Overlay for better visibility */}
          <div className="absolute inset-0 bg-black/5" />

          {/* Shoppable Hotspot on the Ring */}
          {/* <Hotspot
            top="55%"
            left="48%"
            title="Golden Pendant"
            price="$240.00"
            link="/shop"
          /> */}
        </div>
      </div>
    </section>
  );
}
