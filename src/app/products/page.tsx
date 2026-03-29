'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import ProductCard from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/Skeletons';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProductStore } from '@/store/productStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, ChevronDown, Search, X, Star, ShieldCheck, Heart, LayoutGrid } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  image_url: string;
  weight: string;
}

// Utility for creating premium, clear names
const formatProductName = (name: string) => {
  if (!name) return 'Premium Product';
  // Example: Convert "cold pressed oil" to "Cold Pressed Oil • Premium Harvest"
  const formatted = name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  return formatted;
};

const categories = ['All', 'Rice', 'Spices', 'Oils', 'Ghees', 'Pulses', 'Beverages', 'Medicine & Healthcare', 'Sweeteners', 'Pickles'];

function ProductsContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  
  const { products, loading: productsLoading, fetchProducts } = useProductStore() as { 
    products: Product[], 
    loading: boolean, 
    fetchProducts: () => void 
  };
  
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy] = useState('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState(2000);
  const searchQueryParam = searchParams.get('search') || '';
  const [localSearch, setLocalSearch] = useState(searchQueryParam);

  useEffect(() => {
    const catFromUrl = searchParams.get('category');
    if (catFromUrl) setActiveCategory(catFromUrl);
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login?redirect=/products');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) fetchProducts();
  }, [user, fetchProducts]);

  const loading = productsLoading || (authLoading && products.length === 0);

  const filteredProducts = products.filter((p: Product) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = !localSearch || 
      p.name.toLowerCase().includes(localSearch.toLowerCase());
    const matchesPrice = p.price <= priceRange;
    return matchesCategory && matchesSearch && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return (a.discountPrice || a.price) - (b.discountPrice || b.price);
    if (sortBy === 'price-high') return (b.discountPrice || b.price) - (a.discountPrice || a.price);
    return 0;
  });

  if (loading) return (
     <div className="max-w-7xl mx-auto px-6 py-24"><ProductGridSkeleton /></div>
  );

  return (
    <div className="bg-[#FCFBFA] min-h-screen">
      {/* Premium Navigation Header */}
      <div className="bg-white border-b border-stone-100 transition-all duration-500">
        <div className="max-w-7xl mx-auto pt-8 pb-2">
          
          {/* CENTERED CATEGORY NAVIGATION */}
          <div className="flex flex-col items-center">
             <div className="flex items-center space-x-2 mb-6">
                <div className="w-6 h-[1.5px] bg-secondary" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Browse Collections</span>
                <div className="w-6 h-[1.5px] bg-secondary" />
             </div>
             
             <div 
               ref={categoryScrollRef}
               className="flex items-center justify-start md:justify-center overflow-x-auto w-full no-scrollbar pb-6 px-6 gap-3 scroll-smooth"
             >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      router.push(`/products?category=${cat}`, { scroll: false });
                    }}
                    className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[10px] font-black tracking-[0.05em] uppercase transition-all duration-500 border ${
                      activeCategory === cat 
                        ? 'bg-primary text-white border-primary shadow-premium scale-105 z-10' 
                        : 'bg-white text-gray-400 border-stone-100 hover:border-primary/20 hover:text-primary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* COMPACT FILTER BAR */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-stone-50 bg-white/50 backdrop-blur-xl">
           <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative group flex-grow md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Seach organics..." 
                  className="w-full pl-12 pr-6 py-3.5 bg-stone-50 border border-transparent focus:bg-white focus:border-primary/20 rounded-2xl text-[12px] font-bold text-gray-700 transition-all outline-none"
                />
              </div>
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest hidden sm:block">
                {filteredProducts.length} Results
              </span>
           </div>

           <div className="flex items-center space-x-3 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
              {/* Price Filter Overlay Toggle */}
              <div className="relative">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center whitespace-nowrap px-6 py-3.5 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${isFilterOpen ? 'bg-primary/5 border-primary text-primary' : 'bg-stone-50 border-transparent text-gray-500 hover:border-stone-200'}`}
                >
                  <Filter className="w-3.5 h-3.5 mr-2" /> 
                  Under ₹{priceRange}
                </button>
                <AnimatePresence>
                  {isFilterOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 mt-3 w-72 bg-white rounded-3xl shadow-premium border border-stone-100 p-8 z-50 origin-top-left"
                    >
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Price Range</p>
                       <input 
                          type="range" 
                          min="100" max="2000" 
                          value={priceRange} 
                          onChange={(e) => setPriceRange(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-stone-100 rounded-full appearance-none accent-primary cursor-pointer mb-6"
                       />
                       <div className="flex justify-between items-center bg-stone-50 p-4 rounded-xl border border-stone-100">
                          <span className="text-[10px] font-black text-gray-300 uppercase leading-none">Limit</span>
                          <span className="text-sm font-black text-primary leading-none">₹{priceRange}</span>
                       </div>
                       <button 
                         onClick={() => setIsFilterOpen(false)}
                         className="w-full mt-6 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-premium active:scale-95 transition-all"
                       >
                         Apply Limit
                       </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Enhanced Sorting Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center whitespace-nowrap px-6 py-3.5 bg-stone-50 rounded-2xl border border-transparent hover:border-stone-200 text-[10px] font-black uppercase tracking-widest text-gray-500 transition-all"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 mr-2" /> Sort: {sortBy.replace('-', ' ')}
                  <ChevronDown className={`ml-3 w-4 h-4 transition-transform duration-500 ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-3 w-64 bg-white rounded-3xl shadow-premium border border-stone-100 p-3 z-50 overflow-hidden origin-top-right"
                    >
                       {[
                         { val: 'newest', label: 'Latest Arrivals' },
                         { val: 'price-low', label: 'Economy First' },
                         { val: 'price-high', label: 'Premium Price' }
                       ].map((opt) => (
                         <button 
                            key={opt.val} 
                            onClick={() => { setSortBy(opt.val); setIsSortOpen(false); }}
                            className={`w-full text-left px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === opt.val ? 'bg-primary text-white' : 'hover:bg-stone-50 text-primary/40'}`}
                         >
                            {opt.label}
                         </button>
                       ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        {/* REFINED HEADER & COUNT */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
           <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-playfair font-black text-primary leading-tight lowercase first-letter:uppercase italic">
                 {activeCategory === 'All' ? 'Our Collections' : activeCategory}
              </h2>
              <div className="w-12 h-1 bg-secondary mx-auto md:ml-0 mt-4 rounded-full opacity-30" />
           </div>
           
           <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.3em] text-stone-300">
              <LayoutGrid className="w-4 h-4" />
              <span>{filteredProducts.length} Premium Picks</span>
           </div>
        </div>

        {/* Main Grid Content */}
        {filteredProducts.length === 0 ? (
           <div className="py-40 text-center bg-stone-50 rounded-[3rem] border border-dashed border-stone-200">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-premium">
                 <Search className="w-10 h-10 text-primary/10" />
              </div>
              <h3 className="text-3xl font-playfair font-black text-primary mb-4">No harvests found</h3>
              <p className="text-gray-400 font-bold mb-10 max-w-sm mx-auto leading-relaxed">We couldn&apos;t find any organics matching your current filters. Try relaxing the price limit or search keywords.</p>
              <button 
                onClick={() => { setActiveCategory('All'); setLocalSearch(''); setPriceRange(2000); }} 
                className="px-10 py-5 bg-primary text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-premium hover:shadow-primary/20 transition-all active:scale-95"
              >
                Reset Search
              </button>
           </div>
        ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredProducts.map((p, i) => (
                 <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.8 }}
                 >
                    <ProductCard product={{...p, name: formatProductName(p.name)}} />
                 </motion.div>
              ))}
           </div>
        )}

        {/* Premium Trust Signal in Grid */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-stone-100 pt-20">
           {[
             { icon: Star, title: "Curated Selections", desc: "Every harvest is hand-picked for quality." },
             { icon: Heart, title: "Direct Sourced", desc: "Straight from farm beds to your home." },
             { icon: ShieldCheck, title: "Lab Verified", desc: "Purity tested for zero chemical residue." }
           ].map((signal, i) => (
             <div key={i} className="group text-center px-10">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-soft border border-stone-50 group-hover:scale-110 transition-transform duration-700">
                   <signal.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-3">{signal.title}</h4>
                <p className="text-xs font-bold text-gray-400 leading-relaxed">{signal.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ProductsContent />
    </Suspense>
  );
}
