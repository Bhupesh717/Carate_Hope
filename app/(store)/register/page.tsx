'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [sameAddress, setSameAddress] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!name || !phone || !password) {
        throw new Error('Please fill in all required fields');
      }

      await register({
        name,
        phone,
        password,
        email: email.trim() || undefined,
        permanent_address: permanentAddress.trim() || undefined,
        shipping_address: shippingAddress.trim() || undefined,
      });

      toast.success('Registration successful! Welcome to CarateHope.');
      router.push('/profile');
    } catch (err: any) {
      const errMsg = err.message || 'Registration failed. Please check your inputs.';
      setError(errMsg);
      if (!err.response) {
        toast.error(errMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf6f3] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <Link href="/" className="flex justify-center mb-6">
          <Logo className="h-10" />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-serif text-[#2a2118]">
          Create an Account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Join CarateHope to manage orders and save your favorites.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white py-10 px-6 shadow-xl shadow-[#b97a57]/5 rounded-3xl border border-[#e8d5cc]/60 sm:px-12"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center border border-red-100">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Full Name *</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-[#b97a57] focus:border-[#b97a57] bg-slate-50/50 text-sm transition-colors"
                    placeholder="Rahul Sharma"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Mobile Number *</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-[#b97a57] focus:border-[#b97a57] bg-slate-50/50 text-sm transition-colors"
                    placeholder="e.g. +919876543210"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Email Address (Optional)</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-[#b97a57] focus:border-[#b97a57] bg-slate-50/50 text-sm transition-colors"
                    placeholder="rahul@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Password *</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-[#b97a57] focus:border-[#b97a57] bg-slate-50/50 text-sm transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Permanent Address */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700">Permanent Address (Optional)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <MapPin className="h-4 w-4 text-slate-400" />
                </div>
                <textarea
                  value={permanentAddress}
                  onChange={(e) => handlePermanentAddressChange(e.target.value)}
                  rows={2}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-[#b97a57] focus:border-[#b97a57] bg-slate-50/50 text-sm transition-colors resize-none"
                  placeholder="Enter permanent address..."
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">Shipping Address (Optional)</label>
                <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sameAddress}
                    onChange={(e) => handleSameAddressChange(e.target.checked)}
                    className="rounded text-[#b97a57] focus:ring-[#b97a57]"
                  />
                  <span>Same as Permanent</span>
                </label>
              </div>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <MapPin className="h-4 w-4 text-slate-400" />
                </div>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  disabled={sameAddress}
                  rows={2}
                  className={`block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-[#b97a57] focus:border-[#b97a57] bg-slate-50/50 text-sm transition-all resize-none ${
                    sameAddress ? 'opacity-60 cursor-not-allowed bg-slate-100/80' : ''
                  }`}
                  placeholder="Enter shipping address..."
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-6 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#b97a57] hover:bg-[#a06648] focus:outline-none transition-all duration-300 animate-pulse-subtle"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-slate-500">Already have an account? </span>
            <Link href="/login" className="font-medium text-[#b97a57] hover:text-[#a06648] transition-colors relative group">
              Sign in
              <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-[#b97a57] transition-all group-hover:w-full"></span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
