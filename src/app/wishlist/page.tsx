'use client';

import { useWishlistStore } from '@/store/wishlistStore';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import { Heart, Search } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const wishlistItems = useWishlistStore((state) => state.wishlistItems);

  return (
    <div className="bg-[#F7F4EF] min-h-screen pt-28 pb-32">
      <div className="max-w-screen-lg mx-auto px-4">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-[#1B4332]">
            My Wishlist
          </h1>
          <p className="mt-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">
            {wishlistItems?.length || 0} Items Saved
          </p>
        </div>

        {(!wishlistItems || wishlistItems.length === 0) ? (
          <div className="py-24 px-6 text-center bg-white rounded-3xl border border-stone-100 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#F7F4EF] flex items-center justify-center mx-auto mb-6">
              <Heart className="w-6 h-6 text-stone-300" />
            </div>
            <h3 className="text-2xl font-playfair font-bold text-[#1B4332] mb-2">Your wishlist is empty</h3>
            <p className="text-stone-500 mb-8 max-w-sm mx-auto text-sm">Save your favorite organic products here to view them later.</p>
            <Link href="/products" className="inline-block px-8 py-3 bg-[#1B4332] text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#1B4332]/90 active:scale-95 transition-all">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlistItems.map((p: any, i: number) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
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
