'use client';

import { WishlistSection } from '@/components/wishlist-section';
import { PageHeader } from '@/components/page-header';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  return (
    <div className="border-t border-neutral-200">
      <PageHeader 
        eyebrow="Your Favorites"
        icon={Heart}
        title="Wishlist"
        subtitle="Items you love and want to remember."
        imageSrc="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=2000&auto=format&fit=crop"
      />

      {/* Wishlist Items */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <WishlistSection />
      </div>
    </div>
  );
}
