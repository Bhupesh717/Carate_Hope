'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AboutSection() {
  return (
    <section className="w-full bg-muted  ">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Content Column */}
          <div className="space-y-8 max-w-xl">
            <h2 className="text-4xl md:text-5xl font-light tracking-wide text-primary font-serif leading-tight">
              It started with love
            </h2>
            <div className="space-y-6 text-slate-600 leading-relaxed text-sm md:text-base font-light">
              <p>
                Behind our 15-year success is our panel of expert jewellers who have been scouring the entire globe in pursuit of the best and most stunning jewellery that can be offered at affordable price for you.
              </p>
              <p>
                Visit our online catalogue and shop for the finest earrings, rings, bracelets, watches, silver, and the most luxurious gemstones.
              </p>
            </div>
            <div className="pt-2">
              <Button asChild className="rounded-none bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-xs tracking-widest font-light transition-colors uppercase">
                <Link href="/about">
                  About Us
                </Link>
              </Button>
            </div>
          </div>

          {/* Image Column */}
          <div className="aspect-[4/3] md:aspect-square w-full overflow-hidden shadow-sm bg-white">
            <img
              src="/images/about/about-1.png"
              alt="Luxury Diamond Rings winding inside Champagne Ribbon"
              className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
