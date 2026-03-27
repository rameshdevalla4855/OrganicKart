'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/firebase/firebaseInit';
import { Loader2 } from 'lucide-react';
import { FaArrowRight, FaShieldAlt, FaLeaf, FaMagic, FaTruck } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Premium Home Page Components
import Hero from "@/components/home/Hero";
import CollectionSlider from "@/components/home/CollectionSlider";
import FAQ from "@/components/home/FAQ";

export default function Home() {
  const [bestsellers, setBestsellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(4));
        const querySnapshot = await getDocs(q);
        const fetched: any[] = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() });
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero />

      {/* Trust Builders / USP - Senior Redesign */}
      <section className="py-20 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: FaLeaf, title: "100% Organic", desc: "No harmful chemicals", color: "text-green-600" },
              { icon: FaShieldAlt, title: "Lab Tested", desc: "Safe for families", color: "text-blue-600" },
              { icon: FaMagic, title: "Cold Pressed", desc: "Nutrient rich oils", color: "text-amber-600" },
              { icon: FaTruck, title: "Fast Shipping", desc: "Direct to doorstep", color: "text-primary" }
            ].map((usp, i) => (
              <motion.div 
                key={usp.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-8 rounded-3xl hover:bg-gray-50 transition-colors"
              >
                <div className={`w-16 h-16 rounded-2xl bg-white shadow-soft flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${usp.color}`}>
                   <usp.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{usp.title}</h3>
                <p className="text-gray-500 leading-relaxed">{usp.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Collection Slider */}
      <CollectionSlider />

      {/* Featured Bestsellers */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div className="max-w-xl">
            <span className="text-accent font-bold tracking-widest uppercase text-sm mb-2 block">Our Top Recommendations</span>
            <h2 className="text-4xl md:text-6xl font-playfair font-bold text-primary mb-6 leading-tight tracking-tight">
              Curated <span className="text-accent italic">Bestsellers</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Discover the most loved products by our health-conscious community. Pure, fresh, and delivered with love.
            </p>
          </div>
          <Link href="/products" className="group flex items-center space-x-3 text-primary font-bold text-lg hover:text-accent transition-colors">
            <span>Explore All Products</span>
            <div className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center bg-white group-hover:bg-accent group-hover:border-accent transition-all duration-300">
               <FaArrowRight className="w-5 h-5 group-hover:text-white" />
            </div>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
        ) : bestsellers.length === 0 ? (
          <div className="bg-gray-50 p-20 rounded-[3rem] border border-dashed border-gray-200 text-center">
             <p className="text-gray-400 text-lg mb-6">No products found yet.</p>
             <Link href="/admin/products/new" className="px-8 py-3 bg-primary text-white rounded-full font-bold">Add Your First Product →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Senior Newsletter - Impactful Redesign */}
      <section className="py-24 bg-primary relative overflow-hidden">
        {/* Abstract shapes for senior feel */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-400 opacity-5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-7xl font-playfair font-bold text-white mb-8 leading-tight">
              Start Your <span className="text-accent">Organic</span> Journey Today
            </h2>
            <p className="text-white/70 mb-12 text-xl max-w-2xl mx-auto leading-relaxed">
              Get 10% off on your first order and receive weekly health tips from our experts. Join 5000+ happy families.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto p-2 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20">
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="flex-grow bg-transparent px-8 py-4 outline-none text-white placeholder:text-white/40 font-medium"
                required
              />
              <button type="submit" className="px-10 py-4 bg-accent hover:opacity-90 text-white font-bold rounded-2xl transition-all shadow-xl whitespace-nowrap">
                Get Early Access
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
