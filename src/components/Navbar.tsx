'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebaseInit';
import { ShoppingCart, User as UserIcon, LogOut, Search, Menu, X, ChevronDown, LayoutDashboard, Heart, Settings } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Logo from './Logo';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamic import for heavy overlay only
const SearchOverlay = dynamic(() => import('./SearchOverlay'), { ssr: false });

interface CartItem {
  id: string;
  qty: number;
}

export default function Navbar() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.cartItems);
  const wishlistItems = useWishlistStore((state) => state.wishlistItems);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const cartItemCount = cartItems.reduce((total: number, item: CartItem) => total + item.qty, 0);
  const wishlistItemCount = wishlistItems?.length || 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setIsProfileOpen(false);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop All', href: '/products' },
    { name: 'Our Story', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 border-b ${
        scrolled ? 'bg-white/80 backdrop-blur-xl shadow-soft border-stone-200' : 'bg-white border-stone-100'
      }`}>
        <nav className="max-w-full mx-auto px-6 md:px-12 h-20 md:h-40 flex items-center justify-between">
          {/* Logo Section - Positioned to the complete left */}
          <div className="flex-shrink-0 flex items-center pr-8">
            <Logo variant="navbar" className="transition-all duration-500" />
          </div>
          
          {/* Desktop Navigation Group */}
          <div className="hidden lg:flex items-center space-x-1 flex-grow justify-center">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                prefetch={true} // Aggressive prefetching for instant navigation
                className={`relative px-5 py-2 text-[13px] font-black tracking-[0.05em] uppercase transition-all rounded-full group ${
                  pathname === link.href ? 'text-primary' : 'text-primary/60 hover:text-primary'
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                {pathname === link.href && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute inset-0 bg-primary/5 rounded-full"
                    transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                  />
                )}
                <div className="absolute inset-0 bg-primary/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 -z-0 opacity-0 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
          
          {/* Right Action Panel */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Search Toggle */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-3 text-primary/60 hover:text-primary hover:bg-primary/5 rounded-full transition-all group"
              title="Search Products"
            >
              <Search className="w-5 h-5 transition-transform group-hover:scale-110" />
            </button>

            {/* Wishlist Link */}
            <Link 
              href="/wishlist"
              className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all relative group"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5 transition-transform group-hover:scale-110" />
              {wishlistItemCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full border-2 border-white shadow-sm"
                >
                  {wishlistItemCount}
                </motion.span>
              )}
            </Link>
            
            {/* Shopping Cart */}
            <Link 
              href="/cart"
              className="p-3 text-primary/60 hover:text-primary hover:bg-primary/5 rounded-full transition-all relative group"
            >
              <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" />
              {cartItemCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 bg-accent text-white text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full border-2 border-white shadow-sm"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </Link>

            {/* User Profile Hub */}
            <div className="relative">
              {user ? (
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center space-x-2 p-1 pl-1 pr-3 rounded-full border transition-all ${
                      isProfileOpen ? 'bg-gray-100 border-gray-200' : 'bg-transparent border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-black shadow-premium">
                       {getInitials(userData?.fullName || userData?.name || user?.email || 'U')}
                    </div>
                    <span className="hidden md:block text-[13px] font-black text-primary tracking-tight uppercase">
                      {userData?.fullName?.split(' ')[0] || userData?.name?.split(' ')[0] || 'User'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-primary/40 transition-transform duration-500 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login"
                  className="hidden md:flex items-center px-6 py-2.5 bg-primary text-white text-[13px] font-black uppercase tracking-widest rounded-full hover:bg-primary-hover shadow-premium hover:shadow-xl transition-all active:scale-95"
                >
                  Login
                </Link>
              )}

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.9, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: 15, scale: 0.9, filter: 'blur(10px)' }}
                    className="absolute right-0 mt-4 w-64 bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-premium border border-stone-200 p-3 overflow-hidden z-50 origin-top-right"
                  >
                     <div className="p-4 bg-primary/5 rounded-2xl mb-2">
                        <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mb-1">Authenticated</p>
                        <p className="text-sm font-black text-primary truncate">{userData?.fullName || userData?.name || user?.email}</p>
                     </div>
                     <div className="space-y-1">
                        {[
                          { icon: UserIcon, label: 'My Dashboard', href: '/profile' },
                          { icon: ShoppingCart, label: 'My Orders', href: '/profile?tab=orders' },
                          { icon: Heart, label: 'Wishlist', href: '/wishlist' },
                        ].map((item, i) => (
                           <motion.div
                             key={item.href}
                             initial={{ opacity: 0, x: -10 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: i * 0.05 }}
                           >
                              <Link href={item.href} onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-3 text-sm font-bold text-gray-600 hover:bg-primary/5 hover:text-primary rounded-xl transition-all group">
                                 <item.icon className="w-4.5 h-4.5 mr-3 items-center text-gray-400 group-hover:text-primary transition-colors" />
                                 {item.label}
                              </Link>
                           </motion.div>
                        ))}
                        
                        {userData?.role === 'admin' && (
                           <Link href="/admin" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-3 text-sm font-black text-accent hover:bg-accent/5 rounded-xl transition-all">
                              <LayoutDashboard className="w-4.5 h-4.5 mr-3" /> Admin Dashboard
                           </Link>
                        )}
                     </div>
                     <button 
                       onClick={handleLogout}
                       className="w-full flex items-center px-4 py-4 mt-2 text-sm font-black text-red-500 hover:bg-red-50 rounded-2xl transition-all border-t border-gray-50"
                     >
                       <LogOut className="w-4.5 h-4.5 mr-3" /> Logout Account
                     </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 text-gray-600 hover:text-primary transition-colors focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-[45] bg-black/20 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-premium p-8 flex flex-col pt-24"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link 
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-6 py-4 rounded-2xl text-xl font-black uppercase tracking-[0.1em] transition-all ${
                        pathname === link.href ? 'bg-primary text-white shadow-premium' : 'text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-auto space-y-4">
                 <button 
                   onClick={() => { setIsSearchOpen(true); setIsMobileMenuOpen(false); }}
                   className="flex items-center w-full px-6 py-5 text-gray-800 font-black uppercase tracking-widest bg-gray-50 rounded-2xl"
                 >
                   <Search className="w-6 h-6 mr-4 text-primary" /> Search Store
                 </button>
                 {!user && (
                   <Link 
                     href="/login"
                     onClick={() => setIsMobileMenuOpen(false)}
                     className="flex items-center justify-center p-6 bg-primary text-white font-black uppercase tracking-[0.2em] rounded-[2rem] shadow-premium"
                   >
                     Login Access
                   </Link>
                 )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* Spacer to prevent content jump since header is fixed */}
      <div className="h-24 md:h-32" />
    </>
  );
}
