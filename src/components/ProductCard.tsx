'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { ShoppingCart, Heart, Check } from 'lucide-react';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  image_url: string;
  weight: string;
  isWoodPressed?: boolean;
}

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  variant?: 'default' | 'compact';
}

export default function ProductCard({ product, priority = false, variant = 'default' }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const wishlisted = isInWishlist(product.id);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group bg-white rounded-2xl overflow-hidden border border-stone-100 flex flex-col h-full relative"
    >
      {/* Image Container */}
      <Link href={`/products/${product.id}`} className="relative w-full block overflow-hidden aspect-square bg-stone-50">
        {/* Badges - stacked top-left like reference */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
          {discountPercent > 0 && (
            <span className="bg-[#DC6827] text-white text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
              {discountPercent}% OFF
            </span>
          )}
          <span className="bg-[#DC6827] text-white text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
            BESTSELLER
          </span>
          {product.isWoodPressed && (
            <span className="bg-[#1B4332] text-white text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
              🍃 WOOD PRESSED
            </span>
          )}
        </div>

        {/* Wishlist button - top-right */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
          className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
            wishlisted
              ? 'bg-red-500 text-white'
              : 'bg-white text-stone-400 hover:text-red-500'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        <Image
          src={product.image_url || '/placeholder.svg'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
          unoptimized={!!product.image_url}
          priority={priority}
        />
      </Link>

      {/* Product Info */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Category label */}
        <span className="text-[9px] font-black text-[#92400E] uppercase tracking-widest mb-1">
          {product.category}
        </span>

        {/* Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-bold text-stone-800 leading-tight line-clamp-2 mb-1.5 group-hover:text-[#1B4332] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-1">
          {[1,2,3,4,5].map(s => (
            <Star key={s} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
          ))}
          <span className="text-[9px] text-stone-400 ml-0.5">(4.8)</span>
        </div>

        {/* Weight */}
        <p className="text-[10px] text-stone-400 mb-2">{product.weight}</p>

        {/* Price + ADD button row */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-[#1B4332]">
              ₹{product.discountPrice || product.price}
            </span>
            {product.discountPrice && (
              <span className="text-[10px] text-stone-300 line-through font-semibold">
                ₹{product.price}
              </span>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[9px] font-black uppercase tracking-wider transition-all duration-300 ${
              isAdded
                ? 'bg-green-600 text-white'
                : 'bg-[#1B4332] text-white hover:bg-[#14532d]'
            }`}
          >
            <AnimatePresence mode="wait">
              {isAdded ? (
                <motion.span key="added" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1">
                  <Check className="w-3 h-3" /> Added
                </motion.span>
              ) : (
                <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1">
                  <ShoppingCart className="w-3 h-3" /> ADD
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
