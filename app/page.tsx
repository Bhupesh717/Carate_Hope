'use client';

import { BannerCarousel } from '@/components/banner-carousel';
import { ProductCard } from '@/components/product-card';
import { mockProducts } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BrandMarquee } from '@/components/brand-marquee';
import { InstagramGrid } from '@/components/instagram-grid';
import { AboutSection } from '@/components/about-section';
import { ShoppableShowcase } from '@/components/shoppable-showcase';
import { HeroBanner } from '@/components/hero-banner';
import { WhyChooseUs } from '@/components/why-choose-us';
import { Testimonials } from '@/components/testimonials';
import { ExploreCategories } from '@/components/explore-categories';
import { InfoRibbon } from '@/components/info-ribbon';
import { motion } from 'framer-motion';

export default function Page() {
  const featuredProducts = mockProducts.slice(0, 4);

  return (
    <div>
      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Info Ribbon */}
      <InfoRibbon />

      {/* Explore Categories Section */}
      <ExploreCategories />

      {/* About Section */}
      <AboutSection />

      {/* Featured Products Section */}
      <section className="gradient-wine  py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-light text-foreground">Featured Collections</h2>
            <Link href="/shop">
              <Button className="bg-[#c88a6d] hover:bg-[#b0775d] text-white rounded-none px-8 py-5 text-xs tracking-widest uppercase transition-colors">
                View All
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>


      {/* Shoppable Showcase Section */}
      <ShoppableShowcase />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Hero Banner Section */}
      <HeroBanner />

      {/* Instagram Grid */}
      <InstagramGrid />
      {/* Brand Logotypes Marquee */}
      <BrandMarquee />
    </div>
  );
}

