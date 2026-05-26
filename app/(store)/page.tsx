'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Product } from '@/types';
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
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        setLoading(true);
        const response = await apiClient.get('/public/products?featured=true&per_page=4');
        if (response.data && response.data.success && response.data.data.data && response.data.data.data.length > 0) {
          const mapped: Product[] = response.data.data.data.map((p: any) => ({
            id: String(p.id),
            name: p.name,
            price: Number(p.discount_price ?? p.price),
            category: p.category?.name || 'Jewelry',
            image: p.product_images?.[0]?.image_path || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
            description: p.description || '',
            rating: 4.5 + (p.id % 5) * 0.1,
            reviews: 12 + (p.id % 10) * 14,
          }));
          setFeaturedProducts(mapped);
        } else {
          setFeaturedProducts(mockProducts.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setFeaturedProducts(mockProducts.slice(0, 4));
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

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

