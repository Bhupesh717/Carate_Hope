'use client';

import React, { useRef, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategoryItem {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  link: string;
}

const mockCategoriesData: CategoryItem[] = [
  {
    id: '1',
    name: 'Artificial Jewellery Brands',
    subtitle: 'Trendy & affordable designs',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80',
    link: '/shop?category=artificial',
  },
  {
    id: '2',
    name: 'Silver Jewellery Businesses',
    subtitle: 'Timeless sterling elegance',
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80',
    link: '/shop?category=silver',
  },
  {
    id: '3',
    name: 'Bridal Jewellery Stores',
    subtitle: 'Heritage sets for your big day',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80',
    link: '/shop?category=bridal',
  },
  {
    id: '4',
    name: 'Wholesale Jewellery Suppliers',
    subtitle: 'Bulk premium manufacturing',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&auto=format&fit=crop&q=80',
    link: '/shop?category=wholesale',
  },
  {
    id: '5',
    name: 'Export-Oriented Jewellery MSMEs',
    subtitle: 'Global quality standards',
    image: 'https://images.unsplash.com/photo-1599643478520-413e657d1e5c?w=600&auto=format&fit=crop&q=80',
    link: '/shop?category=export',
  },
  {
    id: '6',
    name: 'Handcrafted Jewellery Businesses',
    subtitle: 'Artisanal details & love',
    image: 'https://images.unsplash.com/photo-1515562141207-6811bcdd56f8?w=600&auto=format&fit=crop&q=80',
    link: '/shop?category=handcrafted',
  },
  {
    id: '7',
    name: 'Fashion Jewellery Brands',
    subtitle: 'Contemporary style statements',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80',
    link: '/shop?category=fashion',
  },
  {
    id: '8',
    name: 'Rajasthan ODOP Jewellery Businesses',
    subtitle: 'Traditional Kundan & Meenakari',
    image: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=600&auto=format&fit=crop&q=80',
    link: '/shop?category=rajasthan-odop',
  },
];

export function ExploreCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await apiClient.get('/public/categories');
        if (response.data && response.data.success && response.data.data.length > 0) {
          const mapped: CategoryItem[] = response.data.data.map((cat: any) => ({
            id: String(cat.id),
            name: cat.name,
            subtitle: cat.description || 'Discover our collections',
            image: cat.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80',
            link: `/shop?category=${cat.id}`,
          }));
          setCategories(mapped);
        } else {
          setCategories(mockCategoriesData);
        }
      } catch (err) {
        console.error('Error fetching public categories:', err);
        setCategories(mockCategoriesData);
      }
    }
    fetchCategories();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="w-full bg-white py-20 border-t border-border relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 relative">

        {/* Header Block matching the screenshot style */}
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-800 font-sans">
            Explore Our Categories
          </h2>
          <p className="text-sm md:text-base text-slate-500 font-light max-w-2xl mx-auto">
            Discover the perfect collections, from bridal heritage to contemporary fashion.
          </p>
        </div>

        {/* Navigation Arrows positioned on the grid layout */}
        <div className="absolute right-6 top-[20%] z-20 hidden md:flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="rounded-full border border-slate-200 bg-white hover:bg-slate-50 p-2.5 shadow-sm transition-all duration-300 group"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600 group-hover:text-slate-900" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="rounded-full border border-slate-200 bg-white hover:bg-slate-50 p-2.5 shadow-sm transition-all duration-300 group"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-slate-900" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6 pt-2 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="w-[280px] h-[370px] sm:w-[300px] sm:h-[400px] flex-shrink-0 snap-start relative overflow-hidden rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100/50 group cursor-pointer"
            >
              <Link href={category.link} className="absolute inset-0 block">
                {/* Background Image */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-700 "
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

                {/* Text Content overlay at the bottom-left */}
                <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end">
                  <h3 className="text-white text-xl sm:text-2xl font-bold font-sans tracking-wide leading-tight group-hover:text-amber-300 transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm font-light mt-2 tracking-wide">
                    {category.subtitle}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CSS to hide scrollbar (Tailwind custom utility styling) */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
