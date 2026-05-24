'use client';

import React from 'react';
import { Gem, Award, ShieldCheck, PenTool, Truck, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function WhyChooseUs() {
  const features = [
    { icon: <Truck className="h-5 w-5" />, title: 'Free Insured Global Shipping' },
    { icon: <Gem className="h-5 w-5" />, title: '100% Certified Gemstones' },
    { icon: <Award className="h-5 w-5" />, title: 'Master Craftsmanship' },
    { icon: <ShieldCheck className="h-5 w-5" />, title: 'Lifetime Exchange Policy' },
    { icon: <PenTool className="h-5 w-5" />, title: 'Bespoke Custom Designs' },
    { icon: <Sparkles className="h-5 w-5" />, title: 'Conflict-Free Diamonds' },
  ];

  return (
    <section className="w-full bg-white py-24 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-16 lg:gap-24 items-center">

          {/* Left Column */}
          <div className="space-y-10">
            {/* Header */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[2px] w-12 bg-[#b97a57]" />
                <span className="text-xs font-bold tracking-[0.15em] uppercase text-[#b97a57]">
                  Excellence in Craftsmanship
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#b97a57] leading-[1.1] uppercase">
                Why Choose<br />
                CarateHope<br />
                Fine Jewelry
              </h2>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8 pt-4">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#faf6f3] text-[#b97a57]">
                    {feature.icon}
                  </div>
                  <span className="text-sm font-medium text-slate-800 leading-tight">
                    {feature.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col items-center">
            <div className="flex gap-6 justify-center w-full max-w-[500px] lg:max-w-none">

              {/* Card 1 (Shifted down) */}
              <div className="relative w-1/2 mt-16">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="/images/products/ruby_necklace.png"
                    alt="Royal Ruby Necklace"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 left-3 right-3 bg-white rounded-xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-center border border-slate-50">
                  <h4 className="text-sm font-bold text-slate-800 whitespace-nowrap">Royal Ruby</h4>
                  <p className="text-[10px] font-bold tracking-widest text-[#b97a57] uppercase mt-1.5">Exclusive Collection</p>
                </div>
              </div>

              {/* Card 2 (Higher) */}
              <div className="relative w-1/2 mb-16">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="/images/products/luxury_diamond_ring.png"
                    alt="Eternity Diamond Ring"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 left-3 right-3 bg-white rounded-xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-center border border-slate-50">
                  <h4 className="text-sm font-bold text-slate-800 whitespace-nowrap">Eternity Ring</h4>
                  <p className="text-[10px] font-bold tracking-widest text-[#b97a57] uppercase mt-1.5">Bridal Collection</p>
                </div>
              </div>

            </div>

            {/* Button */}
            <div className="mt-20 w-full max-w-[400px]">
              <Link href="/shop" className="group flex items-center justify-center gap-3 w-full py-4 rounded-full border border-[#e8d5cc] hover:border-[#b97a57] transition-all bg-white hover:bg-[#faf6f3]">
                <span className="text-xs font-bold tracking-[0.15em] uppercase text-slate-800 group-hover:text-[#b97a57] transition-colors">
                  Shop Our Collection
                </span>
                <ArrowRight className="w-4 h-4 text-[#b97a57]" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
