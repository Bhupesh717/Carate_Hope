'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { PageHeader } from '@/components/page-header';
import { User, Package, MapPin, Settings, LogOut, Loader2, ArrowRight } from 'lucide-react';

const MOCK_ORDERS = [
  {
    id: 'ORD-8921-X',
    date: '2023-11-15',
    total: 3499.00,
    status: 'Delivered',
    items: [
      { name: 'Diamond Solitaire Necklace', quantity: 1, image: 'https://images.unsplash.com/photo-1599643478514-46b1d1bc678a?q=80&w=200&auto=format&fit=crop' }
    ]
  },
  {
    id: 'ORD-9204-Y',
    date: '2024-02-03',
    total: 899.00,
    status: 'Processing',
    items: [
      { name: 'Pearl & Gold Earrings', quantity: 1, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=200&auto=format&fit=crop' }
    ]
  }
];

export default function OrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#b97a57]" /></div>;

  if (!isAuthenticated || !user) {
    router.replace('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="bg-[#faf6f3] min-h-screen pb-24">
      <PageHeader 
        title="My Orders"
        eyebrow="History"
        icon={Package}
        imageSrc="/images/banner/hero-banner.jpg"
      />
      
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <div className="grid md:grid-cols-[250px_1fr] gap-10">
          
          {/* Sidebar Menu */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#e8d5cc]/60 h-fit space-y-2">
            <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors font-medium text-sm">
              <User className="w-4 h-4" />
              Profile Info
            </Link>
            <Link href="/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#faf6f3] text-[#b97a57] font-medium text-sm transition-colors">
              <Package className="w-4 h-4" />
              Order History
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors font-medium text-sm">
              <MapPin className="w-4 h-4" />
              Addresses
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors font-medium text-sm">
              <Settings className="w-4 h-4" />
              Settings
            </Link>
            <div className="pt-4 mt-4 border-t border-slate-100">
              <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-medium text-sm">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[#e8d5cc]/60">
            <h2 className="text-2xl font-serif text-[#2a2118] mb-8">Order History</h2>
            
            <div className="space-y-6">
              {MOCK_ORDERS.map((order) => (
                <div key={order.id} className="border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap gap-4 items-center justify-between mb-6 pb-6 border-b border-slate-50">
                    <div>
                      <p className="text-xs font-semibold tracking-wider uppercase text-slate-500 mb-1">Order Number</p>
                      <p className="font-medium text-slate-900">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-wider uppercase text-slate-500 mb-1">Date Placed</p>
                      <p className="font-medium text-slate-900">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-wider uppercase text-slate-500 mb-1">Total Amount</p>
                      <p className="font-medium text-slate-900">${order.total.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                          <div>
                            <p className="font-medium text-slate-900">{item.name}</p>
                            <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="text-sm font-semibold text-[#b97a57] hover:text-[#a06648] flex items-center gap-1">
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
