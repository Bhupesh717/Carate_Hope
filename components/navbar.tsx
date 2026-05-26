'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useAuthStore } from '@/store/auth';
import { Heart, ShoppingCart, Menu, X, Search, User } from 'lucide-react';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/logo';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Bespoke', href: '/bespoke-jewellery' },
];

export function Navbar() {
  const cartCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.getItemCount());
  const { user, isAuthenticated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const handleScroll = () => setHasScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHydrated]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const scrolled = hasScrolled;
  const textColor = 'text-slate-800';
  const iconHover = 'hover:text-[#b97a57]';

  return (
    <>
      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-[0_1px_24px_rgba(0,0,0,0.08)] border-b border-slate-100'
          : 'bg-transparent border-b border-black/5'
        }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 gap-8">

          {/* Left Nav Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-8 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className={`relative group text-xs font-semibold tracking-[0.18em] uppercase transition-colors duration-300 ${textColor} ${iconHover}`}
              >
                {link.label}
                <span className={`absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300 bg-[#b97a57]`} />
              </Link>
            ))}
          </div>

          {/* Logo - centered */}
          <Link href="/" className="flex-shrink-0 mx-auto lg:mx-0">
            <Logo
              className="h-9"
              textColorClass="text-slate-800"
            />
          </Link>

          {/* Right Nav Links + Icons */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-end">
            {/* Search */}
            <button
              className={`transition-colors duration-300 ${textColor} ${iconHover}`}
              aria-label="Search"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className={`relative transition-colors duration-300 ${textColor} ${iconHover}`}
              title="Wishlist"
            >
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#c88a6d] text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className={`relative transition-colors duration-300 ${textColor} ${iconHover}`}
              title="Cart"
            >
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#c88a6d] text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Button */}
            {isHydrated ? (
              isAuthenticated ? (
                <Link
                  href="/profile"
                  className={`ml-2 flex items-center gap-2 px-4 py-2.5 text-[10px] tracking-[0.2em] font-semibold uppercase transition-all duration-300 rounded-none ${scrolled
                      ? 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                      : 'bg-[#f5ece6] text-[#b97a57] hover:bg-[#ebd4c8]'
                    }`}
                >
                  <User className="w-4 h-4" />
                  <span className="hidden xl:inline">{user?.name}</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className={`ml-2 flex items-center gap-2 px-5 py-2.5 text-[10px] tracking-[0.2em] font-semibold uppercase transition-all duration-300 rounded-none ${scrolled
                      ? 'bg-[#b97a57] text-white hover:bg-[#a06648]'
                      : 'bg-[#b97a57] text-white hover:bg-[#a06648] backdrop-blur-sm'
                    }`}
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              )
            ) : (
              <div className="w-24 h-10 animate-pulse bg-slate-200/50 rounded-xl ml-2"></div>
            )}
          </div>

          {/* Mobile Right Icons */}
          <div className="flex lg:hidden items-center gap-4">
            <Link href="/wishlist" className={`relative ${textColor} ${iconHover}`} title="Wishlist">
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#c88a6d] text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className={`relative ${textColor} ${iconHover}`} title="Cart">
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#c88a6d] text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`transition-colors duration-300 ${textColor} ${iconHover}`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Search Dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`overflow-hidden border-t ${scrolled ? 'border-slate-100 bg-white' : 'border-white/10 bg-black/30 backdrop-blur-md'}`}
            >
              <div className="mx-auto max-w-2xl px-6 py-4">
                <div className={`flex items-center gap-3 border-b ${scrolled ? 'border-slate-200' : 'border-white/30'}`}>
                  <Search className={`h-4 w-4 shrink-0 ${scrolled ? 'text-slate-400' : 'text-white/60'}`} />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search jewelry, collections…"
                    className={`w-full bg-transparent py-3 text-sm tracking-wide outline-none placeholder:tracking-widest placeholder:uppercase placeholder:text-xs ${scrolled ? 'text-slate-800 placeholder:text-slate-400' : 'text-white placeholder:text-white/50'
                      }`}
                  />
                  <button onClick={() => setSearchOpen(false)} className={`shrink-0 ${scrolled ? 'text-slate-400 hover:text-slate-700' : 'text-white/60 hover:text-white'}`}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden bg-white/98 backdrop-blur-xl border-t border-slate-100 lg:hidden"
            >
              <div className="flex flex-col px-6 py-6 gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href + link.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between py-4 text-sm font-semibold tracking-[0.15em] uppercase text-slate-700 hover:text-[#b97a57] transition-colors border-b border-slate-50"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-6"
                >
                  {isHydrated && isAuthenticated ? (
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-4 text-xs tracking-[0.2em] uppercase font-semibold transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Account
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full bg-[#b97a57] hover:bg-[#a06648] text-white py-4 text-xs tracking-[0.2em] uppercase font-semibold transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Sign In
                    </Link>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}



