'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, ShoppingBag, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AppliedCoupon {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

  // Coupon State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Checkout Modal State
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [submittingCheckout, setSubmittingCheckout] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Calculations
  const subtotal = getTotal();
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === 'percentage') {
      discountAmount = (subtotal * appliedCoupon.discount_value) / 100;
    } else {
      discountAmount = appliedCoupon.discount_value;
    }
  }
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * 0.08;
  const total = taxableAmount + tax;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    try {
      setValidatingCoupon(true);
      const response = await apiClient.post('/public/coupons/validate', {
        code: couponInput.trim(),
      });
      if (response.data && response.data.success) {
        setAppliedCoupon(response.data.data);
        toast.success(`Coupon "${couponInput.toUpperCase()}" applied successfully!`);
      } else {
        toast.error(response.data?.message || 'Invalid coupon code.');
      }
    } catch (err: any) {
      console.error(err);
      if (!err.response) {
        toast.error('Failed to validate coupon code.');
      }
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      toast.error('Please fill in all checkout fields.');
      return;
    }

    try {
      setSubmittingCheckout(true);
      const checkoutPayload = {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        items: items.map((item) => ({
          product_id: Number(item.id),
          quantity: item.quantity,
        })),
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
      };

      const response = await apiClient.post('/public/orders/checkout', checkoutPayload);
      if (response.data && response.data.success) {
        const orderId = response.data.data.order_id;
        setPlacedOrderId(String(orderId));

        // Save order details to localStorage history so guest customer can view it under /orders
        const orderHistoryItem = {
          id: `ORD-${orderId}`,
          date: new Date().toISOString().split('T')[0],
          total: total,
          status: 'Pending',
          items: items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            image: item.image,
          })),
        };

        const existingOrders = JSON.parse(localStorage.getItem('caratehope-orders') || '[]');
        localStorage.setItem(
          'caratehope-orders',
          JSON.stringify([orderHistoryItem, ...existingOrders])
        );

        // Success state changes
        setCheckoutSuccess(true);
        clearCart();
        toast.success('Order placed successfully!');
      } else {
        toast.error(response.data?.message || 'Failed to place checkout order.');
      }
    } catch (err: any) {
      console.error(err);
      if (!err.response) {
        toast.error('Checkout failed. Please check your items stock.');
      }
    } finally {
      setSubmittingCheckout(false);
    }
  };

  if (items.length === 0 && !checkoutSuccess) {
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
        {checkoutSuccess ? (
          <div className="flex flex-col items-center justify-center text-center py-16 max-w-lg mx-auto bg-white border border-border/60 rounded-3xl p-8 shadow-sm">
            <div className="rounded-full bg-emerald-100 p-4 mb-6">
              <CheckCircle2 className="h-12 w-12 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-serif text-foreground mb-2">Order Confirmed!</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Thank you for your purchase. Your order <span className="font-mono font-semibold text-neutral-900">ORD-{placedOrderId}</span> has been placed successfully and is now being processed.
            </p>
            <div className="flex flex-col gap-3 w-full">
              <Link href="/orders" className="w-full">
                <Button className="w-full bg-neutral-900 text-white hover:bg-neutral-800">
                  Track Order History
                </Button>
              </Link>
              <Link href="/shop" className="w-full">
                <Button variant="outline" className="w-full border-neutral-200">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        ) : (
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
                    <p className="text-sm text-neutral-600">₹{item.price.toLocaleString()}</p>
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
                      ₹{(item.price * item.quantity).toLocaleString()}
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
            <div className="h-fit rounded-lg border border-neutral-200 p-6 bg-muted">
              <h3 className="mb-4 text-lg font-light text-neutral-900">Order Summary</h3>

              {/* Coupon Code Panel */}
              <div className="mb-6 pb-6 border-b border-neutral-200 space-y-2">
                <label className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Promo Code</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code (e.g. GOLD25)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    disabled={!!appliedCoupon || validatingCoupon}
                    className="h-10 border-neutral-200 bg-white"
                  />
                  {appliedCoupon ? (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponInput('');
                      }}
                      className="h-10 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 font-sans text-xs tracking-wider"
                    >
                      Remove
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={handleApplyCoupon}
                      disabled={!couponInput.trim() || validatingCoupon}
                      className="h-10 font-sans text-xs tracking-wider"
                    >
                      {validatingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                    </Button>
                  )}
                </div>
                {appliedCoupon && (
                  <p className="text-xs text-emerald-600 font-medium">
                    Coupon applied! {appliedCoupon.discount_type === 'percentage' ? `${appliedCoupon.discount_value}%` : `₹${appliedCoupon.discount_value}`} discount.
                  </p>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-neutral-600 text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 text-sm">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600 text-sm">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-neutral-600 text-sm">
                  <span>Tax (8%)</span>
                  <span>₹{tax.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="border-t border-neutral-200 pt-3 flex justify-between font-semibold text-lg text-neutral-900">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
              </div>
              <Button
                onClick={() => setCheckoutOpen(true)}
                className="mt-6 w-full bg-neutral-900 text-white hover:bg-neutral-800 py-6"
              >
                Proceed to Checkout
              </Button>
              <Link href="/shop" className="mt-3 block w-full">
                <Button variant="outline" className="w-full border-neutral-200 bg-white py-6">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Form Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-border/60 rounded-3xl p-6 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-foreground">Checkout Details</DialogTitle>
            <DialogDescription className="text-slate-500 text-sm">
              Please enter your contact information to place the order.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCheckoutSubmit} className="space-y-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="checkout-name">Full Name *</Label>
              <Input
                id="checkout-name"
                required
                placeholder="e.g. Rahul Sharma"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="h-11 border-neutral-200 rounded-xl focus:ring-[var(--primary)] focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="checkout-email">Email Address *</Label>
              <Input
                id="checkout-email"
                type="email"
                required
                placeholder="e.g. rahul@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="h-11 border-neutral-200 rounded-xl focus:ring-[var(--primary)] focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="checkout-phone">Phone Number *</Label>
              <Input
                id="checkout-phone"
                required
                placeholder="e.g. +919876543210"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="h-11 border-neutral-200 rounded-xl focus:ring-[var(--primary)] focus:border-primary"
              />
            </div>

            <DialogFooter className="pt-4 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCheckoutOpen(false)}
                className="flex-1 rounded-xl h-11"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submittingCheckout}
                className="flex-1 bg-primary text-white hover:bg-primary/90 rounded-xl h-11"
              >
                {submittingCheckout ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Placing Order...
                  </span>
                ) : (
                  'Place Order'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
