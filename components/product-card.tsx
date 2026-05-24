'use client';

import { Product } from '@/types';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:shadow-xl hover:shadow-accent/20"
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className="absolute right-3 top-3 rounded-full bg-white/90 backdrop-blur p-2 shadow-md transition-all duration-200 hover:scale-110 hover:bg-accent hover:text-white"
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className="h-5 w-5 transition-colors duration-200"
              fill={inWishlist ? '#ef4444' : 'none'}
              color={inWishlist ? '#ef4444' : 'currentColor'}
            />
          </button>
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-light text-foreground transition-colors duration-200 hover:text-accent">
            {product.name}
          </h3>
        </Link>

        {product.rating && (
          <div className="flex items-center gap-1 text-sm">
            <span className="text-amber-500">★</span>
            <span className="text-muted-foreground">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-xl font-light text-foreground">
            ${product.price.toLocaleString()}
          </span>
          <Button
            onClick={() => addToCart(product)}
            size="sm"
            className="bg-[#c88a6d] hover:bg-[#b0775d] text-white rounded-none transition-colors px-4 text-xs tracking-wider uppercase"
          >
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
