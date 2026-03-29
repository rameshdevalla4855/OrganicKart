'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { ShoppingCart, Star, Heart, Plus, Check, Leaf } from 'lucide-react';
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
      whileHover={{ y: -12 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group bg-white rounded-[2rem] shadow-soft hover:shadow-premium overflow-hidden border border-stone-100 flex flex-col h-full relative transition-all duration-500 hover:border-primary/20"
    >
      {/* Premium Badge Layer */}
      <div className="absolute top-5 left-5 z-20 flex flex-col gap-2 pointer-events-none">
        <div className="bg-primary text-white text-[8px] font-black uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full shadow-medium flex items-center">
           <Leaf className="w-2.5 h-2.5 mr-1.5" />
           Premium Organic
        </div>
        {product.isWoodPressed && (
          <div className="bg-stone-50 text-secondary text-[8px] font-black uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full border border-stone-100 italic">
            Wood Pressed
          </div>
        )}
      </div>

      {/* Elegant Wishlist Action */}
      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
        className={`absolute top-5 right-5 z-20 w-10 h-10 rounded-full backdrop-blur-xl flex items-center justify-center transition-all duration-500 border ${
          wishlisted 
            ? 'bg-red-500 border-red-500 text-white scale-110 shadow-medium' 
            : 'bg-white/40 border-white/20 text-primary/40 hover:text-red-500 hover:bg-white hover:border-red-500/20'
        }`}
      >
        <Heart className={`w-4 h-4 transition-all duration-500 ${wishlisted ? 'fill-current scale-110' : 'group-hover:scale-110'}`} />
      </button>

      {/* Cinematic Image Container */}
      <Link 
        href={`/products/${product.id}`} 
        className={`relative w-full bg-stone-50 block overflow-hidden ${variant === 'compact' ? 'h-60' : 'h-80'}`}
      >
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 flex items-center justify-center p-8 text-center">
           <div className="px-8 py-3 bg-white text-primary rounded-full text-[9px] font-black uppercase tracking-[0.25em] shadow-medium transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
              View Collection
           </div>
        </div>
        <Image
          src={product.image_url || '/placeholder.svg'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={!!product.image_url}
          priority={priority}
        />
        {/* Subtle Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
      </Link>

      {/* Product Content Hub */}
      <div className={`${variant === 'compact' ? 'p-6' : 'p-8'} pt-7 flex flex-col flex-grow bg-white`}>
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-sm" />
              <span className="text-[9px] font-black text-stone-400 uppercase tracking-[0.25em]">{product.category}</span>
           </div>
           <div className="flex items-center text-primary font-black text-[9px] tracking-widest bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10">
              <Star className="w-2.5 h-2.5 fill-current mr-1" /> TOP RATED
           </div>
        </div>

        <Link href={`/products/${product.id}`} className="block mb-6 group/title">
          <h3 className="text-[19px] font-playfair font-black text-primary leading-tight group-hover/title:text-secondary transition-all duration-500 line-clamp-2 italic">
            {product.name}
          </h3>
          <div className="h-[1px] w-0 bg-secondary group-hover/title:w-full transition-all duration-700 mt-1" />
        </Link>
        
        <div className="flex items-end justify-between mb-10 mt-auto bg-stone-50 p-5 rounded-2xl border border-stone-100">
          <div className="flex flex-col">
             <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Direct Price</span>
             <div className="flex items-baseline space-x-2">
                {product.discountPrice ? (
                  <>
                    <span className="text-2xl font-black text-primary tracking-tighter">₹{product.discountPrice}</span>
                    <span className="text-xs text-stone-300 line-through font-bold">₹{product.price}</span>
                  </>
                ) : (
                  <span className="text-2xl font-black text-primary tracking-tighter">₹{product.price}</span>
                )}
             </div>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Net Weight</span>
             <span className="text-[11px] font-black text-primary uppercase tracking-[0.1em]">{product.weight}</span>
          </div>
        </div>

        {/* High-Impact CTA */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={handleAddToCart}
          className={`
            w-full relative h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex justify-center items-center transition-all duration-700 shadow-soft
            ${isAdded 
              ? 'bg-green-600 text-white shadow-medium' 
              : 'bg-primary text-white hover:bg-primary-hover shadow-glow'
            }
          `}
        >
          <AnimatePresence mode="wait">
             {isAdded ? (
                <motion.div 
                   key="added"
                   initial={{ scale: 0, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   className="flex items-center"
                >
                   <Check className="w-4.5 h-4.5 mr-2" /> Secured In Cart
                </motion.div>
             ) : (
                <motion.div 
                   key="add"
                   initial={{ opacity: 0, y: 5 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="flex items-center"
                >
                   <ShoppingCart className="w-4 h-4 mr-3" /> Add To Harvest
                </motion.div>
             )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}
