'use client';

import { useWishlistStore } from '@/store/wishlistStore';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import { Heart, Search } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const wishlistItems = useWishlistStore((state) => state.wishlistItems);

  return (
    <div className="bg-white min-h-screen pt-40 pb-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-20">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-[1px] bg-red-500" />
              <span className="text-red-500 font-black tracking-[0.3em] uppercase text-[10px] flex items-center">
                 <Heart className="w-3 h-3 mr-2" /> My Favorites
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-playfair font-black text-primary leading-tight lowercase first-letter:uppercase italic">
              saved <span className="text-red-500 opacity-80">harvests</span>
            </h1>
            <p className="mt-4 text-xs font-black text-gray-400 uppercase tracking-widest">
              You have <span className="text-primary italic">{wishlistItems?.length || 0}</span> items saved
            </p>
          </div>
        </div>

        {(!wishlistItems || wishlistItems.length === 0) ? (
          <div className="py-40 text-center bg-stone-50 rounded-[3rem] border border-dashed border-stone-200">
            <Heart className="w-12 h-12 text-primary/10 mx-auto mb-8" />
            <h3 className="text-3xl font-playfair font-black text-primary mb-2">Your wishlist is empty</h3>
            <p className="text-gray-400 font-bold mb-10 max-w-sm mx-auto">Build your curated collection of organic favorites by tapping the heart icon on any product.</p>
            <Link href="/products" className="inline-block px-10 py-4 bg-primary text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-premium active:scale-95 transition-all">
              Explore Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {wishlistItems.map((p: any, i: number) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.8 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
