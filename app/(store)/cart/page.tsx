'use client';

import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="border-t border-neutral-200">
        <PageHeader 
          eyebrow="Your Bag"
          icon={ShoppingBag}
          title="Shopping"
          accentTitle="Cart"
          subtitle="Review your selected pieces before proceeding to checkout."
          imageSrc="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=2000&auto=format&fit=crop"
        />

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-6 px-6 py-16">
          <div className="rounded-full bg-neutral-100 p-6">
            <ShoppingBag className="h-12 w-12 text-neutral-400" />
          </div>
          <h2 className="text-2xl font-light text-neutral-900">Your Cart is Empty</h2>
          <p className="text-center text-neutral-600">
            Add items to your cart to see them here.
          </p>
          <Link href="/shop">
            <Button className="bg-neutral-900 text-white hover:bg-neutral-800">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-neutral-200">
      <PageHeader 
        eyebrow="Your Bag"
        icon={ShoppingBag}
        title="Shopping"
        accentTitle="Cart"
        subtitle="Review your selected pieces before proceeding to checkout."
        imageSrc="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=2000&auto=format&fit=crop"
      />

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b border-neutral-200 py-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-24 object-cover rounded"
                />
                <div className="flex-1">
                  <Link href={`/product/${item.id}`}>
                    <h3 className="font-light text-neutral-900 hover:text-neutral-600">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-neutral-600">${item.price.toLocaleString()}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      className="h-8 w-8 rounded border border-neutral-200 hover:bg-neutral-100"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value) || 1)
                      }
                      className="h-8 w-12 rounded border border-neutral-200 text-center text-sm"
                    />
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="h-8 w-8 rounded border border-neutral-200 hover:bg-neutral-100"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="font-light text-neutral-900">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="h-fit rounded-lg border border-neutral-200 p-6">
            <h3 className="mb-4 text-lg font-light text-neutral-900">Order Summary</h3>
            <div className="space-y-3 border-t border-neutral-200 pt-4">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>${getTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Tax</span>
                <span>${(getTotal() * 0.08).toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="border-t border-neutral-200 pt-3 flex justify-between font-light text-lg">
                <span>Total</span>
                <span>${(getTotal() * 1.08).toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
              </div>
            </div>
            <Button className="mt-6 w-full bg-neutral-900 text-white hover:bg-neutral-800">
              Proceed to Checkout
            </Button>
            <Link href="/shop" className="mt-3 block w-full">
              <Button variant="outline" className="w-full border-neutral-200">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
