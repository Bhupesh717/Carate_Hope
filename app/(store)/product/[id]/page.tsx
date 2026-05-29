'use client';

import { mockProducts } from '@/lib/mock-data';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Product } from '@/types';
import Image from 'next/image';

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    async function fetchProductDetail() {
      try {
        setLoading(true);
        const response = await apiClient.get(`/public/products/${params.id}`);
        if (response.data && response.data.success && response.data.data) {
          const p = response.data.data;

          // Map product detail
          const imgs = p.product_images || [];
          const sortedImgs = [...imgs].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));
          const imagePath = sortedImgs[0]?.image_path || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop';

          const mappedProd: Product = {
            id: String(p.id),
            name: p.name,
            price: Number(p.discount_price ?? p.price),
            category: p.category?.name || 'Jewelry',
            image: imagePath,
            description: p.description || '',
            rating: 4.8,
            reviews: 124,
          };
          setProduct(mappedProd);

          // Fetch related products in the same category
          if (p.category_id) {
            const relResponse = await apiClient.get(`/public/products?category_id=${p.category_id}&per_page=5`);
            if (relResponse.data && relResponse.data.success && relResponse.data.data.data) {
              const mappedRel: Product[] = relResponse.data.data.data
                .filter((item: any) => item.id !== p.id)
                .slice(0, 4)
                .map((item: any) => {
                  const itemImgs = item.product_images || [];
                  const sortedItemImgs = [...itemImgs].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));
                  return {
                    id: String(item.id),
                    name: item.name,
                    price: Number(item.discount_price ?? item.price),
                    category: item.category?.name || 'Jewelry',
                    image: sortedItemImgs[0]?.image_path || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
                    description: item.description || '',
                  };
                });
              setRelatedProducts(mappedRel);
            }
          }
        } else {
          runLocalMockFallback();
        }
      } catch (err) {
        console.error('Error loading product details:', err);
        runLocalMockFallback();
      } finally {
        setLoading(false);
      }
    }

    function runLocalMockFallback() {
      const p = mockProducts.find((item) => item.id === params.id);
      if (p) {
        setProduct(p);
        const rel = mockProducts
          .filter((item) => item.category === p.category && item.id !== p.id)
          .slice(0, 4);
        setRelatedProducts(rel);
      } else {
        setProduct(null);
        setRelatedProducts([]);
      }
    }

    fetchProductDetail();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="border-t border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 py-12 text-center">
          <h1 className="text-3xl font-light text-neutral-900">Product Not Found</h1>
          <Link href="/shop" className="mt-4 inline-block">
            <Button className="bg-neutral-900 text-white hover:bg-neutral-800">
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-neutral-200">
      {/* Product Section */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="aspect-square overflow-hidden rounded-lg bg-neutral-100"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <div>
              <p className="mb-2 text-sm uppercase text-neutral-600">{product.category}</p>
              <h1 className="text-4xl font-light text-neutral-900">{product.name}</h1>
            </div>

            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={i < Math.floor(product.rating!) ? 'text-yellow-500' : 'text-neutral-300'}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-neutral-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            )}

            <div className="border-t border-b border-neutral-200 py-6">
              <p className="text-4xl font-light text-neutral-900">
                ${product.price.toLocaleString()}
              </p>
            </div>

            <p className="text-neutral-600 leading-relaxed">{product.description}</p>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm uppercase text-neutral-600">Quantity</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 rounded border border-neutral-200 hover:bg-neutral-100"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="h-10 w-16 rounded border border-neutral-200 text-center"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 rounded border border-neutral-200 hover:bg-neutral-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={() => {
                    addToCart(product, quantity);
                    setQuantity(1);
                  }}
                  className="flex-1 bg-neutral-900 text-white hover:bg-neutral-800"
                >
                  Add to Cart
                </Button>
                <Button
                  onClick={() => toggleWishlist(product)}
                  variant="outline"
                  className="border-neutral-200"
                >
                  <Heart
                    className="h-5 w-5"
                    fill={inWishlist ? '#dc2626' : 'none'}
                    color={inWishlist ? '#dc2626' : 'currentColor'}
                  />
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4 border-t border-neutral-200 pt-6">
              <div>
                <h3 className="mb-2 font-light text-neutral-900">Shipping Info</h3>
                <p className="text-sm text-neutral-600">Free shipping on orders over $100</p>
              </div>
              <div>
                <h3 className="mb-2 font-light text-neutral-900">Returns</h3>
                <p className="text-sm text-neutral-600">30-day return policy for all items</p>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="border-t border-neutral-200 pt-6">
              <p className="text-xs uppercase tracking-widest text-neutral-400 mb-3">Secure Payment</p>
              <div className="flex flex-wrap gap-2 items-center">
                <Image src="/visa.png" alt="Visa" width={90} height={36} className="h-8 w-auto rounded object-contain bg-neutral-100 px-2 py-1" />
                <Image src="/card.png" alt="Mastercard" width={90} height={36} className="h-8 w-auto rounded object-contain bg-neutral-100 px-2 py-1" />
                <Image src="/paypal.png" alt="PayPal" width={90} height={36} className="h-8 w-auto rounded object-contain bg-neutral-100 px-2 py-1" />
                <Image src="/apple-pay.png" alt="Apple Pay" width={90} height={36} className="h-8 w-auto rounded object-contain bg-neutral-100 px-2 py-1" />
                <Image src="/stripe.png" alt="Stripe" width={90} height={36} className="h-8 w-auto rounded object-contain bg-neutral-100 px-2 py-1" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-neutral-200 bg-neutral-50 py-12">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-8 text-3xl font-light text-neutral-900">Related Products</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <Link key={p.id} href={`/product/${p.id}`}>
                  <div className="group cursor-pointer overflow-hidden rounded-lg border border-neutral-200 bg-white">
                    <div className="aspect-square overflow-hidden bg-neutral-100">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-light text-neutral-900 group-hover:text-neutral-600">
                        {p.name}
                      </h3>
                      <p className="mt-2 text-lg font-light text-neutral-900">
                        ${p.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
