'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCartStore } from '@/store/cartStore';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebaseInit';
import { ShoppingCart, User as UserIcon, LogOut, Search, Menu, X, ChevronDown, LayoutDashboard, Heart, Settings } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import SearchOverlay from './SearchOverlay';
import Logo from './Logo';
import { motion, AnimatePresence } from 'framer-motion';

interface CartItem {
  id: string;
  qty: number;
}

export default function Navbar() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.cartItems);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const cartItemCount = cartItems.reduce((total: number, item: CartItem) => total + item.qty, 0);

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
    { name: 'Benefits', href: '/#benefits' },
    { name: 'Contact', href: '/contact' },
  ];

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100 py-2 shadow-sm' 
          : 'bg-white py-4 border-b border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center pr-4 border-r border-gray-100 hidden lg:flex">
              <Logo variant="navbar" />
            </div>
            <div className="lg:hidden">
              <Logo variant="navbar" className="w-40" />
            </div>
            
            {/* Desktop Navigation Group */}
            <div className="hidden lg:flex items-center space-x-1 ml-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-bold tracking-wide transition-all rounded-lg group ${
                    pathname === link.href ? 'text-primary' : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                  {pathname === link.href && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary"
                    />
                  )}
                  {/* Subtle hover indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-50 transition-transform duration-300 origin-center opacity-30" />
                </Link>
              ))}
            </div>
            
            {/* Right Action Panel */}
            <div className="flex items-center space-x-2 md:space-x-4 ml-auto">
              
              {/* Search Toggle */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full transition-all"
                title="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>
              
              {/* Shopping Cart */}
              <Link 
                href="/cart"
                className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full transition-all relative group"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-0 bg-accent text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </Link>

              {/* User Profile Hub */}
              <div className="relative">
                {user ? (
                  <div className="flex items-center space-x-1 lg:space-x-3">
                    {/* Admin Quick Switcher */}
                    {userData?.role === 'admin' && (
                      <Link 
                        href="/admin/products"
                        className="hidden md:flex items-center px-3 py-1.5 bg-green-50 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
                      >
                        <LayoutDashboard className="w-3 h-3 mr-1.5" /> Dashboard
                      </Link>
                    )}

                    <button 
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-2 p-1 pl-1 pr-3 hover:bg-gray-50 rounded-full border border-transparent hover:border-gray-100 transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-black shadow-inner">
                         {getInitials(userData?.fullName || userData?.name || user?.email || 'User')}
                      </div>
                      <span className="hidden md:block text-xs font-bold text-gray-700 truncate max-w-[100px]">
                        {userData?.fullName?.split(' ')[0] || userData?.name || 'User'}
                      </span>
                      <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                ) : (
                  <Link 
                    href="/login"
                    className="flex items-center px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-hover shadow-md hover:shadow-lg transition-all active:scale-95"
                  >
                    Login
                  </Link>
                )}

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 overflow-hidden"
                    >
                       <div className="p-3 border-b border-gray-50">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Signed in as</p>
                          <p className="text-sm font-black text-gray-800 truncate">{userData?.fullName || user?.email}</p>
                       </div>
                       <div className="py-2">
                          <Link href="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors group">
                             <UserIcon className="w-4 h-4 mr-3 text-gray-400 group-hover:text-primary" /> My Profile
                          </Link>
                          <Link href="/orders" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors group">
                             <ShoppingCart className="w-4 h-4 mr-3 text-gray-400 group-hover:text-primary" /> My Orders
                          </Link>
                          <Link href="/wishlist" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors group">
                             <Heart className="w-4 h-4 mr-3 text-gray-400 group-hover:text-primary" /> Wishlist
                          </Link>
                          {userData?.role === 'admin' && (
                             <Link href="/admin/products" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-2.5 text-sm font-bold text-accent hover:bg-accent/5 rounded-lg transition-colors md:hidden">
                                <LayoutDashboard className="w-4 h-4 mr-3" /> Admin Dashboard
                             </Link>
                          )}
                       </div>
                       <button 
                         onClick={handleLogout}
                         className="w-full flex items-center px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors border-t border-gray-50"
                       >
                         <LogOut className="w-4 h-4 mr-3" /> Logout
                       </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-primary transition-colors focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 shadow-xl overflow-hidden"
            >
              <div className="px-4 pt-4 pb-8 space-y-2">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-md font-bold transition-all ${
                      pathname === link.href ? 'bg-primary/5 text-primary' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="pt-6 mt-6 border-t border-gray-100 flex flex-col space-y-4">
                   <button 
                     onClick={() => { setIsSearchOpen(true); setIsMobileMenuOpen(false); }}
                     className="flex items-center px-4 py-3 text-gray-700 font-bold hover:bg-gray-50 rounded-xl"
                   >
                     <Search className="w-5 h-5 mr-4 text-gray-400" /> Search
                   </button>
                   {!user && (
                     <Link 
                       href="/login"
                       onClick={() => setIsMobileMenuOpen(false)}
                       className="flex items-center justify-center p-4 bg-primary text-white font-bold rounded-2xl"
                     >
                       Login / Sign Up
                     </Link>
                   )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </nav>
      {/* Spacer to prevent content jump since nav is fixed */}
      <div className="h-20" />
    </>
  );
}
