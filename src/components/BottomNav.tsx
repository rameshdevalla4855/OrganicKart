'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Heart, ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.cartItems);
  const cartCount = cartItems.reduce((total: number, item: any) => total + item.qty || 0, 0);

  // Don't show BottomNav on Admin pages
  if (pathname?.startsWith('/admin')) return null;

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: ShoppingBag, label: 'Shop', href: '/products' },
    { icon: Heart, label: 'Wishlist', href: '/wishlist' },
    { icon: ShoppingCart, label: 'Cart', href: '/cart', badge: cartCount },
    { icon: User, label: 'Profile', href: '/profile' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-stone-100 shadow-[0_-4px_20px_0_rgba(0,0,0,0.05)] h-20 px-4 flex items-center justify-around pb-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className="relative flex flex-col items-center justify-center w-16 h-full group"
          >
            <div className={`relative p-2 rounded-2xl transition-all duration-300 ${
              isActive ? 'text-primary scale-110' : 'text-stone-400 group-hover:text-primary/70'
            }`}>
              <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              
              {/* Badge for Cart */}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full border-2 border-white">
                  {item.badge}
                </span>
              )}
              
              {/* Active Indicator Dot */}
              {isActive && (
                <motion.div 
                  layoutId="bottomNavActive"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                />
              )}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest mt-0.5 transition-colors duration-300 ${
              isActive ? 'text-primary' : 'text-stone-400'
            }`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;
