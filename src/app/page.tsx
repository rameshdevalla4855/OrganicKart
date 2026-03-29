'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/firebase/firebaseInit';
import { Loader2 } from 'lucide-react';
import { FaArrowRight, FaShieldAlt, FaLeaf, FaMagic, FaTruck } from 'react-icons/fa';
import { motion, useScroll, useSpring } from 'framer-motion';

import dynamic from 'next/dynamic';

// Premium Home Page Components - Dynamically imported for speed
const Hero = dynamic(() => import("@/components/home/Hero"), { 
  ssr: true,
  loading: () => <div className="h-[65vh] bg-stone-900 animate-pulse" /> 
});
const CollectionSlider = dynamic(() => import("@/components/home/CollectionSlider"), { 
  ssr: true,
  loading: () => <div className="h-96 bg-stone-50 animate-pulse" />
});
const FAQ = dynamic(() => import("@/components/home/FAQ"), { ssr: true });
const ProductCard = dynamic(() => import("@/components/ProductCard"), { ssr: true });
const ProductSkeleton = dynamic(() => import("@/components/ProductSkeleton"), { ssr: true });

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  image_url: string;
  weight: string;
}

export default function Home() {
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(4));
        const querySnapshot = await getDocs(q);
        const fetched: Product[] = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() } as Product);
        });
        setBestsellers(fetched);
      } catch (error) {
        console.error("Error fetching homepage products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Premium Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-secondary origin-left z-[100]" 
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <Hero />

      {/* Dynamic Collection Slider - Positioned under the banner */}
      <div className="bg-white">
        <CollectionSlider />
      </div>

      {/* Trust Builders / USP - Botanical SaaS Section */}
      <section className="py-24 relative overflow-hidden bg-white bg-grid">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: FaLeaf, title: "100% Organic", desc: "Pure Harvests", color: "text-primary" },
              { icon: FaShieldAlt, title: "Lab Tested", desc: "Certified Safety", color: "text-secondary" },
              { icon: FaMagic, title: "Cold Pressed", desc: "Nutrient Rich", color: "text-primary" },
              { icon: FaTruck, title: "Eco Shipping", desc: "Direct to Door", color: "text-secondary" }
            ].map((usp, i) => (
              <motion.div 
                key={usp.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="group flex flex-col items-center text-center p-12 rounded-[2rem] bg-stone-50 hover:bg-white transition-all duration-700 shadow-soft border border-stone-100"
              >
                <div className={`w-20 h-20 rounded-full bg-white flex items-center justify-center mb-8 group-hover:bg-primary group-hover:scale-110 transition-all duration-700 shadow-sm`}>
                   <usp.icon className={`w-8 h-8 ${usp.color}`} />
                </div>
                <h3 className="text-lg font-black text-primary mb-2 uppercase tracking-widest">{usp.title}</h3>
                <p className="text-primary/40 text-[10px] font-black uppercase tracking-[0.2em]">{usp.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Bestsellers - Botanical Theme */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-[1px] bg-primary" />
                <span className="text-primary font-black tracking-[0.3em] uppercase text-[10px]">Top Rated Selections</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-playfair font-black text-primary leading-tight mb-4 whitespace-nowrap">
                Curated <span className="text-secondary italic">Bestsellers</span>
              </h2>
              <p className="text-primary/40 text-[13px] leading-relaxed font-black max-w-xl uppercase tracking-widest">
                Discover the most loved products by our health-conscious community. Pure, fresh, and delivered with love.
              </p>
            </motion.div>
            
            <Link href="/products" className="group flex items-center space-x-4 bg-primary text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-glow hover:bg-primary-hover active:scale-95 transition-all">
              <span>Explore All</span>
              <FaArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
            </Link>
          </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[1, 2, 3, 4].map((i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : bestsellers.length === 0 ? (
          <div className="bg-stone-50 p-20 rounded-[3rem] border border-stone-100 text-center">
             <p className="text-primary/40 text-lg mb-6">No products found yet.</p>
             <Link href="/admin/products/new" className="px-8 py-3 bg-primary text-white rounded-full font-bold">Add Your First Product →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {bestsellers.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
              >
                <ProductCard product={product} variant="compact" />
              </motion.div>
            ))}
          </div>
        )}
        </div>
      </section>

      {/* FAQ Section with Premium Reveal */}
      <FAQ />

      {/* Senior Newsletter - Botanical Refresh */}
      <section className="py-40 bg-white border-t border-stone-100 relative overflow-hidden">
        {/* Soft botanical glowing shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary opacity-[0.03] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary opacity-[0.03] rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <motion.div
             initial={{ opacity: 0, y: 50, scale: 0.95 }}
             whileInView={{ opacity: 1, y: 0, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 1 }}
          >
            <div className="inline-flex items-center space-x-3 mb-8 bg-stone-50 px-6 py-2 rounded-full border border-stone-100 shadow-sm">
               <FaLeaf className="w-3 h-3 text-primary" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Community First</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-playfair font-black text-primary mb-6 leading-tight whitespace-nowrap">
              Start Your <span className="text-secondary italic">Organic</span> Journey
            </h2>
            <p className="text-primary/40 mb-16 text-xs md:text-sm max-w-xl mx-auto leading-relaxed font-black uppercase tracking-[0.2em]">
              Join 10,000+ happy families receiving weekly health tips and exclusive first access to harvest releases.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto p-2 bg-white rounded-[3rem] border border-stone-200 shadow-soft">
              <input 
                type="email" 
                placeholder="Secure Email Address" 
                className="flex-grow bg-transparent px-10 py-5 outline-none text-primary placeholder:text-primary/20 font-black text-[10px] uppercase tracking-widest"
                required
              />
              <button type="submit" className="px-12 py-5 bg-primary hover:bg-primary-hover text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-[2.5rem] transition-all shadow-glow active:scale-95">
                Join Inner Circle
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
