'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebaseInit';
import { Search, Heart, ShoppingBag, Menu, X, ChevronLeft, Mail, Phone, MapPin, Shield } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const SearchOverlay = dynamic(() => import('./SearchOverlay'), { ssr: false });
const Logo = dynamic(() => import('./Logo'), { ssr: false });

interface CartItem { id: string; qty: number; }

const navLinks = [
  { name: 'Home',       href: '/' },
  { name: 'Shop All',   href: '/products' },
  { name: 'Our Story',  href: '/about' },
  { name: 'Contact Us', href: '/contact' },
];

const categories = [
  'Oils', 'Grains', 'Spices', 'Honey', 'Ghees', 'Millets', 'Seeds', 'Pulses',
];

export default function Navbar() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.cartItems);
  const wishlistItems = useWishlistStore((state) => state.wishlistItems);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartCount = cartItems.reduce((t: number, i: CartItem) => t + i.qty, 0);
  const wishCount = wishlistItems?.length || 0;
  const isSubPage = pathname !== '/';
  const isAdmin = userData?.role === 'admin';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close menu on route change
  useEffect(() => { setIsMenuOpen(false); }, [pathname]);

  const handleLogout = async () => { await signOut(auth); setIsMenuOpen(false); };

  return (
    <>
      {/* ── HEADER ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-sm' : 'border-b border-stone-100'}`}>
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 h-14 lg:h-16">

          {/* Left: back arrow on sub-pages (mobile) + Logo */}
          <div className="flex items-center gap-2">
            {isSubPage && (
              <button onClick={() => router.back()} className="lg:hidden p-1 text-stone-500 hover:text-[#1B4332] transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {/* Logo */}
            <Logo variant="navbar" />
          </div>

          {/* Center: Desktop navigation links (hidden on mobile) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  pathname === link.href
                    ? 'text-[#1B4332] bg-[#1B4332]/5'
                    : 'text-stone-500 hover:text-[#1B4332] hover:bg-stone-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {/* Admin link – desktop (only for admin users) */}
            {isAdmin && (
              <Link
                href="/admin"
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  pathname.startsWith('/admin')
                    ? 'text-[#DC6827] bg-[#DC6827]/5'
                    : 'text-[#DC6827]/70 hover:text-[#DC6827] hover:bg-orange-50'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button onClick={() => setIsSearchOpen(true)} className="p-2 text-stone-500 hover:text-[#1B4332] transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className="p-2 relative text-stone-500 hover:text-[#1B4332] transition-colors">
              <Heart className="w-5 h-5" />
              {wishCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#DC6827] rounded-full text-[7px] font-black text-white flex items-center justify-center">
                  {wishCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="p-2 relative text-stone-500 hover:text-[#1B4332] transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#DC6827] rounded-full text-[7px] font-black text-white flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Desktop: User / Login */}
            <div className="hidden lg:flex items-center gap-2 ml-2">
              {user ? (
                <Link href="/profile" className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                  pathname === '/profile' ? 'text-[#1B4332] bg-[#1B4332]/5' : 'text-stone-500 hover:text-[#1B4332]'
                }`}>
                  {userData?.fullName?.split(' ')[0] || 'Account'}
                </Link>
              ) : (
                <Link href="/login" className="px-5 py-2 bg-[#1B4332] text-white rounded-full text-xs font-black uppercase tracking-wider hover:bg-[#14532d] transition-colors">
                  Sign In
                </Link>
              )}
            </div>

            {/* Hamburger (mobile + tablet only) */}
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 text-stone-500 hover:text-[#1B4332] transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── DARK GREEN SIDE DRAWER ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60]"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[80vw] max-w-sm bg-[#1B4332] z-[70] flex flex-col overflow-y-auto"
            >
              {/* Close + Logo */}
              <div className="flex items-center justify-between px-6 pt-8 pb-6">
                <Logo variant="footer" className="scale-75 origin-left" />
                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-white/60 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Links */}
              <div className="px-6 pb-4">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-3">Quick Links</p>
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`text-base font-semibold py-2 transition-colors ${
                        pathname === link.href ? 'text-white' : 'text-white/70 hover:text-white'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  {user && (
                    <Link href="/profile" className="text-base font-semibold py-2 text-white/70 hover:text-white transition-colors">
                      My Account
                    </Link>
                  )}
                  {user && (
                    <Link href="/wishlist" className="text-base font-semibold py-2 text-white/70 hover:text-white transition-colors">
                      Wishlist
                    </Link>
                  )}
                  {user && (
                    <Link href="/cart" className="text-base font-semibold py-2 text-white/70 hover:text-white transition-colors">
                      My Cart
                    </Link>
                  )}
                </div>
              </div>

              {/* Admin Panel link – mobile (only for admin users) */}
              {isAdmin && (
                <div className="px-6 pb-4">
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 bg-[#DC6827] text-white font-bold text-sm py-3 px-5 rounded-xl hover:bg-[#b85520] transition-colors"
                  >
                    <Shield className="w-5 h-5" />
                    Admin Panel
                    <span className="ml-auto text-white/60 text-xs">Manage Products →</span>
                  </Link>
                </div>
              )}

              {/* Categories */}
              <div className="px-6 py-4 border-t border-white/10">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-3">Categories</p>
                <div className="flex flex-col gap-1">
                  {categories.map((cat) => (
                    <Link key={cat} href={`/products?category=${cat}`}
                      className="text-sm font-medium text-white/60 hover:text-white py-1.5 transition-colors">
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Auth */}
              <div className="px-6 py-4 border-t border-white/10">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-white/50 text-xs">{userData?.fullName || user.email}</p>
                    <button onClick={handleLogout} className="text-left text-sm font-bold text-red-300 hover:text-red-200 transition-colors">
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/login" className="text-white font-bold text-sm hover:text-white/80 transition-colors">
                      Sign In
                    </Link>
                    <Link href="/register" className="text-white/60 text-sm hover:text-white transition-colors">
                      Create Account
                    </Link>
                  </div>
                )}
              </div>

              {/* Get in Touch */}
              <div className="px-6 py-4 border-t border-white/10 mt-auto">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">Get In Touch</p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#DC6827]" />
                    <span className="text-white/60 text-xs">hello@shrestaorganics.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#DC6827]" />
                    <span className="text-white/60 text-xs">+91 9876 543 210</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[#DC6827]" />
                    <span className="text-white/60 text-xs">Hyderabad, Telangana, India</span>
                  </div>
                </div>
              </div>

              {/* Newsletter */}
              <div className="px-6 py-4 border-t border-white/10">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-3">Newsletter</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-grow bg-white/10 border border-white/10 rounded-full px-4 py-2 text-white text-xs placeholder:text-white/30 outline-none focus:border-white/30"
                  />
                  <button className="bg-[#DC6827] text-white text-xs font-black px-4 py-2 rounded-full hover:bg-[#b85520] transition-colors">
                    Join
                  </button>
                </div>
              </div>

              {/* Footer credit */}
              <div className="px-6 py-4 border-t border-white/10">
                <p className="text-white/20 text-[9px] text-center">© 2026 Shresta Organics. All rights reserved.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
