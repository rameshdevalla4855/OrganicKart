'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, TrendingUp, Clock, Flame, ShieldCheck, Leaf } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useProductStore } from '@/store/productStore';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string;
  isWoodPressed?: boolean;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { products, fetchProducts } = useProductStore() as { 
    products: Product[], 
    fetchProducts: () => void 
  };
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      fetchProducts(); 
    } else {
      setTimeout(() => setSearchQuery(''), 0);
    }
  }, [isOpen, fetchProducts]);

  const results = searchQuery.trim().length >= 2 
    ? products.filter((p: Product) => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-3xl flex flex-col pt-24 md:pt-40"
        >
          {/* Marketplace Header Search */}
          <div className="max-w-5xl mx-auto w-full px-6 flex flex-col">
            <div className="relative group">
               {/* Search Command Center */}
               <motion.div 
                 initial={{ width: '80%', opacity: 0 }}
                 animate={{ width: '100%', opacity: 1 }}
                 className="flex items-center bg-[#FDFCFB] rounded-[3rem] border border-stone-100 p-8 shadow-premium group-focus-within:bg-white group-focus-within:border-primary/20 transition-all duration-500"
               >
                 <Search className="w-8 h-8 text-primary/20 mr-8 group-focus-within:text-primary transition-colors" />
                 <input
                   ref={inputRef}
                   type="text"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Search 100% Organic Essentials..."
                   className="w-full bg-transparent border-none outline-none text-2xl md:text-4xl font-playfair font-black text-primary placeholder:text-gray-300 placeholder:italic placeholder:font-black tracking-tighter italic"
                 />
                 <button 
                   onClick={onClose}
                   className="ml-6 p-4 hover:bg-red-50 hover:text-red-500 rounded-full text-gray-400 transition-all shadow-soft"
                 >
                   <X className="w-7 h-7" />
                 </button>
               </motion.div>
            </div>
          </div>

          {/* Result Engine / Suggestions */}
          <div className="flex-1 overflow-y-auto px-6 py-16 md:py-24 no-scrollbar">
            <div className="max-w-5xl mx-auto">
              
              <AnimatePresence mode="wait">
                {searchQuery.length >= 2 ? (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-12"
                  >
                     <div className="flex items-center justify-between pb-6 border-b border-stone-100">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 flex items-center">
                           <TrendingUp className="w-3.5 h-3.5 mr-3" /> Marketplace Discovery
                        </h3>
                        <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">{results.length} Harvests Found</span>
                     </div>

                     {results.length > 0 ? (
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {results.map((product: Product, i: number) => (
                           <motion.div
                             key={product.id}
                             initial={{ opacity: 0, x: -20 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: i * 0.05 }}
                           >
                              <Link 
                                href={`/products?search=${product.name}`}
                                onClick={onClose}
                                className="group block bg-white rounded-[2.5rem] border border-stone-100 p-6 hover:shadow-premium hover:border-primary/10 transition-all duration-500"
                              >
                                <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-stone-50 mb-6 border border-stone-100">
                                   <Image src={product.image_url || '/placeholder.svg'} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                                   {product.isWoodPressed && (
                                     <div className="absolute top-4 left-4 bg-primary text-white text-[9px] font-black px-4 py-2 rounded-full shadow-glow">
                                        WOOD PRESSED
                                     </div>
                                   )}
                                </div>
                                <div>
                                   <div className="flex items-center justify-between items-start mb-2">
                                      <h4 className="font-black text-primary text-lg group-hover:text-secondary group-hover:underline underline-offset-4 transition-all">
                                        {product.name}
                                      </h4>
                                      <span className="text-xl font-black text-primary tracking-tighter">₹{product.price}</span>
                                   </div>
                                   <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.3em]">{product.category}</p>
                                </div>
                              </Link>
                           </motion.div>
                         ))}
                       </div>
                      ) : (
                       <div className="py-40 text-center bg-[#FDFCFB] rounded-[4rem] border border-dashed border-stone-200">
                         <Leaf className="w-16 h-16 text-primary/10 mx-auto mb-8 animate-bounce" />
                         <p className="text-primary font-black text-2xl mb-4 italic">No organics for &quot;{searchQuery}&quot;</p>
                         <button onClick={() => setSearchQuery('')} className="text-accent font-black text-[10px] uppercase tracking-[0.3em] hover:tracking-[0.5em] transition-all">Clear Selection</button>
                       </div>
                     )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="suggestions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-20"
                  >
                    {/* Insights Section */}
                    <div className="md:col-span-4 space-y-12">
                       <div>
                          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 mb-8 flex items-center">
                             <Clock className="w-3.5 h-3.5 mr-3" /> Recent Searches
                          </h3>
                          <div className="flex flex-col gap-6">
                             {['Cold Pressed Oils', 'Ancient Grains', 'Spiced Honey'].map(t => (
                                <button key={t} onClick={() => setSearchQuery(t)} className="text-left text-sm font-black text-primary/60 hover:text-primary transition-all flex items-center group uppercase tracking-widest italic">
                                   <div className="w-0 group-hover:w-4 h-[1.5px] bg-primary transition-all mr-0 group-hover:mr-4" /> {t}
                                </button>
                             ))}
                          </div>
                       </div>

                       <div>
                          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 mb-8 flex items-center">
                             <Flame className="w-3.5 h-3.5 mr-3" /> Popular Right Now
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                             {['Oils', 'Ghee', 'Spices', 'Honey', 'Rice', 'Wellness'].map(cat => (
                               <Link
                                 key={cat}
                                 href={`/products?category=${cat}`}
                                 onClick={onClose}
                                 className="px-6 py-4 bg-white hover:bg-primary hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 shadow-soft border border-stone-100 text-center"
                               >
                                 {cat}
                               </Link>
                             ))}
                          </div>
                       </div>
                    </div>

                    {/* Fresh Recommendations */}
                    <div className="md:col-span-8">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 mb-8 flex items-center">
                          <ShieldCheck className="w-3.5 h-3.5 mr-3" /> Harvest Recommendations
                       </h3>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         {products.slice(0, 4).map((product: Product) => (
                           <Link 
                             key={product.id} 
                             href={`/products/${product.id}`}
                             onClick={onClose}
                             className="flex items-center p-6 rounded-[3rem] bg-white hover:bg-[#FDFCFB] group transition-all border border-stone-100 hover:border-primary/10 hover:shadow-premium"
                           >
                             <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-stone-50 mr-6 border border-stone-100">
                               <Image src={product.image_url || '/placeholder.svg'} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                             </div>
                             <div>
                               <h4 className="font-black text-primary text-md group-hover:text-secondary mb-1 transition-colors underline-offset-4 decoration-secondary">{product.name}</h4>
                               <p className="text-[10px] font-black text-accent uppercase tracking-widest tracking-tighter">Premium Selection</p>
                             </div>
                           </Link>
                         ))}
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
