'use client';

import { useState, useMemo } from 'react';
import { ProductCard } from '@/components/product-card';
import { mockProducts } from '@/lib/mock-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/page-header';
import { Sparkles } from 'lucide-react';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = useMemo(() => {
    let products = mockProducts;

    // Filter by category
    if (selectedCategory !== 'all') {
      products = products.filter((p) => p.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // In a real app, would sort by date
        break;
      default:
        break;
    }

    return products;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="border-t border-neutral-200">
      <PageHeader 
        eyebrow="Shop"
        icon={Sparkles}
        title="Our"
        accentTitle="Collection"
        subtitle="Explore our finest jewelry pieces, ethically sourced and masterfully crafted."
        imageSrc="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=2000&auto=format&fit=crop"
      />

      {/* Filters and Products */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12 grid gap-6 sm:grid-cols-4">
          {/* Search */}
          <Input
            placeholder="Search jewelry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-neutral-200 placeholder:text-neutral-400"
          />

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="border-neutral-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="necklaces">Necklaces</SelectItem>
              <SelectItem value="rings">Rings</SelectItem>
              <SelectItem value="bracelets">Bracelets</SelectItem>
              <SelectItem value="earrings">Earrings</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="border-neutral-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>

          {/* Results Count */}
          <div className="flex items-center text-sm text-neutral-600">
            {filteredProducts.length} results
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-16">
            <p className="text-neutral-600">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
