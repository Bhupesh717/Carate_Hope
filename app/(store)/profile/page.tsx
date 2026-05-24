'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { PageHeader } from '@/components/page-header';
import { User, Package, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, updateProfile } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [sameAddress, setSameAddress] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || '');
      setPermanentAddress(user.permanentAddress || '');
      setShippingAddress(user.shippingAddress || '');
      setSameAddress(
        !!user.permanentAddress && user.permanentAddress === user.shippingAddress
      );
    }
  }, [user]);

  if (!isMounted) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#b97a57]" /></div>;

  if (!isAuthenticated || !user) {
    router.replace('/login');
    return null;
  }

  const handlePermanentAddressChange = (val: string) => {
    setPermanentAddress(val);
    if (sameAddress) {
      setShippingAddress(val);
    }
  };

  const handleSameAddressChange = (checked: boolean) => {
    setSameAddress(checked);
    if (checked) {
      setShippingAddress(permanentAddress);
    }
  };

  const handleSave = () => {
    updateProfile({ 
      name, 
      email, 
      phone, 
      permanentAddress, 
      shippingAddress 
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="bg-[#faf6f3] min-h-screen pb-24">
      <PageHeader
        title="My Account"
        eyebrow="Profile"
        icon={User}
        imageSrc="/images/banner/hero-banner.jpg"
      />

      <div className="mx-auto max-w-6xl px-6 pt-16">
        <div className="grid md:grid-cols-[250px_1fr] gap-10">

          {/* Sidebar Menu */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#e8d5cc]/60 h-fit space-y-2">
            <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#faf6f3] text-[#b97a57] font-medium text-sm transition-colors">
              <User className="w-4 h-4" />
              Profile Info
            </Link>
            <Link href="/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors font-medium text-sm">
              <Package className="w-4 h-4" />
              Order History
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
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif text-[#2a2118]">Personal Information</h2>
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)} className="rounded-xl border-[#e8d5cc] text-[#b97a57] hover:bg-[#faf6f3] hover:text-[#a06648]">
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-xl border-slate-200 text-slate-600">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="rounded-xl bg-[#b97a57] text-white hover:bg-[#a06648]">
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wider uppercase text-slate-500">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#b97a57] bg-slate-50"
                  />
                ) : (
                  <p className="text-lg text-slate-800">{user.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wider uppercase text-slate-500">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#b97a57] bg-slate-50"
                  />
                ) : (
                  <p className="text-lg text-slate-800">{user.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wider uppercase text-slate-500">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#b97a57] bg-slate-50"
                  />
                ) : (
                  <p className="text-lg text-slate-800">{user.phone || '—'}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wider uppercase text-slate-500">Member Since</label>
                <p className="text-lg text-slate-800">{new Date(user.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Addresses section */}
            <div className="mt-12 pt-12 border-t border-slate-100 space-y-6">
              <h3 className="text-xl font-serif text-[#2a2118]">My Addresses</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Permanent Address */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider uppercase text-slate-500">Permanent Address</label>
                  {isEditing ? (
                    <textarea
                      placeholder="Enter permanent address..."
                      value={permanentAddress}
                      onChange={(e) => handlePermanentAddressChange(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#b97a57] bg-slate-50 resize-none text-sm min-h-[100px]"
                    />
                  ) : (
                    <p className="text-base text-slate-700 whitespace-pre-line leading-relaxed min-h-[100px] bg-[#faf6f3]/50 p-4 rounded-xl border border-dashed border-[#e8d5cc]/40">
                      {user.permanentAddress || 'No permanent address added yet.'}
                    </p>
                  )}
                </div>

                {/* Shipping Address */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold tracking-wider uppercase text-slate-500">Shipping Address</label>
                    {isEditing && (
                      <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={sameAddress}
                          onChange={(e) => handleSameAddressChange(e.target.checked)}
                          className="rounded text-[#b97a57] focus:ring-[#b97a57]"
                        />
                        <span>Same as Permanent</span>
                      </label>
                    )}
                  </div>
                  {isEditing ? (
                    <textarea
                      placeholder="Enter shipping address..."
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      disabled={sameAddress}
                      rows={3}
                      className={`w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#b97a57] bg-slate-50 resize-none text-sm transition-all min-h-[100px] ${
                        sameAddress ? 'opacity-60 cursor-not-allowed bg-slate-100/80' : ''
                      }`}
                    />
                  ) : (
                    <p className="text-base text-slate-700 whitespace-pre-line leading-relaxed min-h-[100px] bg-[#faf6f3]/50 p-4 rounded-xl border border-dashed border-[#e8d5cc]/40">
                      {user.shippingAddress || 'No shipping address added yet.'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-slate-100">
              <h3 className="text-xl font-serif text-[#2a2118] mb-6">Recent Activity</h3>
              <p className="text-slate-500 text-sm">You haven't made any recent changes to your account.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
