'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import { collection, getDocs, query, limit, where, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/firebaseInit';
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
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { products, fetchProducts } = useProductStore() as { 
    products: Product[], 
    fetchProducts: () => void 
  };
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input and pre-fetch products when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      fetchProducts(); // Ensure data is in cache
    } else {
      // Small delay prevents cascading render warnings in strict mode
      setTimeout(() => setSearchQuery(''), 0);
    }
  }, [isOpen, fetchProducts]);

  // Live Search from Cache (Derived State)
  const results = searchQuery.trim().length >= 2 
    ? products.filter((p: Product) => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  // Close on Escape
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
          className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex flex-col"
        >
          {/* Header */}
          <div className="max-w-7xl mx-auto w-full px-4 h-24 flex items-center justify-between border-b border-gray-100">
            <div className="flex-1 flex items-center">
              <Search className="w-6 h-6 text-gray-400 mr-4" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for organic oils, spices, honey..."
                className="w-full bg-transparent border-none outline-none text-2xl font-light placeholder:text-gray-300 text-primary"
              />
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-8 h-8 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto pt-12 pb-24">
            <div className="max-w-3xl mx-auto px-4">
              
              {/* Results */}
              {searchQuery.length >= 2 && (
                <div className="mb-12">
                   <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Search Results</h3>
                   {results.length > 0 ? (
                     <div className="space-y-4">
                       {results.map((product: Product) => (
                         <Link 
                            key={product.id} 
                            href={`/products?search=${product.name}`}
                            onClick={onClose}
                            className="flex items-center p-4 rounded-2xl hover:bg-gray-50 group transition-colors border border-transparent hover:border-gray-100"
                         >
                           <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 mr-4 border border-gray-100">
                             <Image src={product.image_url || '/placeholder.svg'} alt={product.name} fill className="object-cover" />
                           </div>
                           <div className="flex-1">
                             <h4 className="font-bold text-primary group-hover:text-accent transition-colors">{product.name}</h4>
                             <p className="text-sm text-gray-500">{product.category}</p>
                           </div>
                           <span className="text-lg font-bold text-primary">₹{product.price}</span>
                           <ArrowRight className="w-5 h-5 ml-4 text-gray-300 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                         </Link>
                       ))}
                     </div>
                    ) : (
                     <div className="text-center py-12">
                       <p className="text-gray-500">No products found for &quot;<span className="font-bold">{searchQuery}</span>&quot;</p>
                     </div>
                   )}
                </div>
              )}

              {/* Recommendations */}
              {(searchQuery.length < 2 || results.length === 0) && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
                    {searchQuery.length < 2 ? "Recommended for You" : "Try these instead"}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.slice(0, 4).map((product: Product) => (
                      <Link 
                        key={product.id} 
                        href={`/products?search=${product.name}`}
                        onClick={onClose}
                        className="flex items-center p-4 rounded-2xl hover:bg-gray-50 group transition-colors border border-gray-100"
                      >
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 mr-4">
                          <Image src={product.image_url || '/placeholder.svg'} alt={product.name} fill className="object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold text-primary group-hover:text-accent transition-colors">{product.name}</h4>
                          <p className="text-sm text-gray-500">₹{product.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  {/* Quick Categories */}
                  <div className="mt-12">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Quick Browse</h3>
                    <div className="flex flex-wrap gap-2">
                       {['Oils', 'Spices', 'Sweeteners', 'Grains'].map(cat => (
                         <Link
                           key={cat}
                           href={`/products?category=${cat}`}
                           onClick={onClose}
                           className="px-4 py-2 bg-gray-100 hover:bg-primary hover:text-white rounded-full text-sm font-medium transition-colors"
                         >
                           {cat}
                         </Link>
                       ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
