'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/firebase/firebaseInit';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import dynamic from 'next/dynamic';

const Hero = dynamic(() => import("@/components/home/Hero"), {
  ssr: true,
  loading: () => <div className="h-[45vh] bg-stone-200 animate-pulse" />
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
  isWoodPressed?: boolean;
}

const categories = [
  { name: 'Oils',    icon: '🫗', color: 'bg-amber-50',   border: 'border-amber-100' },
  { name: 'Grains',  icon: '🌾', color: 'bg-emerald-50', border: 'border-emerald-100' },
  { name: 'Spices',  icon: '🌶️', color: 'bg-red-50',     border: 'border-red-100' },
  { name: 'Seeds',   icon: '🌻', color: 'bg-yellow-50',  border: 'border-yellow-100' },
  { name: 'Honey',   icon: '🍯', color: 'bg-orange-50',  border: 'border-orange-100' },
  { name: 'Millets', icon: '🌽', color: 'bg-lime-50',    border: 'border-lime-100' },
  { name: 'Ghees',   icon: '🧈', color: 'bg-amber-50',   border: 'border-amber-100' },
  { name: 'Pulses',  icon: '🫘', color: 'bg-green-50',   border: 'border-green-100' },
];

const trustBadges = [
  { icon: '🌿', title: '100% Organic',  desc: 'Pure certified harvests',  iconBg: 'bg-green-100' },
  { icon: '🛡️', title: 'Lab Tested',    desc: 'Zero chemical residue',    iconBg: 'bg-blue-100' },
  { icon: '✨', title: 'Cold Pressed',  desc: 'Nutrient-rich oils',       iconBg: 'bg-amber-100' },
  { icon: '🚚', title: 'Eco Shipping',  desc: 'Direct farm to door',      iconBg: 'bg-green-100' },
];

export default function Home() {
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-[#F7F4EF]">

      {/* ─── HERO ─── */}
      <Hero />

      {/* ─── SHOP BY CATEGORY ─── */}
      <section className="bg-[#F7F4EF] py-8 px-4">
        <div className="max-w-screen-lg mx-auto">
          {/* Header row */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-stone-800">Shop by Category</h2>
            <Link href="/products" className="text-sm font-black text-[#1B4332] flex items-center gap-1 hover:underline">
              VIEW ALL <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 2×4 pastel tile grid */}
          <div className="grid grid-cols-4 gap-3">
            {categories.map((cat) => (
              <Link key={cat.name} href={`/products?category=${cat.name}`}>
                <motion.div
                  whileTap={{ scale: 0.94 }}
                  className={`${cat.color} ${cat.border} border rounded-2xl flex flex-col items-center justify-center py-3 px-1 gap-1.5 cursor-pointer hover:shadow-sm transition-all`}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-stone-600 text-center leading-none">{cat.name}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST BADGES ─── */}
      <section className="bg-white mx-4 my-4 rounded-2xl px-5 py-5 border border-stone-100">
        <div className="max-w-screen-lg mx-auto grid grid-cols-2 gap-4">
          {trustBadges.map((badge) => (
            <div key={badge.title} className="flex items-start gap-3">
              <div className={`${badge.iconBg} w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-base`}>
                {badge.icon}
              </div>
              <div>
                <p className="text-[11px] font-black text-stone-800 uppercase tracking-wide leading-tight">{badge.title}</p>
                <p className="text-[10px] text-stone-400 mt-0.5">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CURATED BESTSELLERS ─── */}
      <section className="bg-[#F7F4EF] py-8 px-4">
        <div className="max-w-screen-lg mx-auto">
          {/* Section label */}
          <div className="flex flex-col items-center text-center mb-6">
            <span className="bg-[#F0E8D8] text-stone-500 text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
              TOP RATED
            </span>
            <h2 className="text-2xl font-playfair font-bold text-stone-900 mb-2">
              Curated Bestsellers
            </h2>
            <p className="text-stone-400 text-[11px] max-w-xs leading-relaxed">
              Discover the most loved products by our health-conscious community. Pure, fresh, and delivered with love.
            </p>
          </div>

          {/* 2-column product grid */}
          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => <ProductSkeleton key={i} />)}
            </div>
          ) : bestsellers.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <p className="mb-4">No products yet.</p>
              <Link href="/admin/products" className="px-6 py-3 bg-[#1B4332] text-white rounded-full text-sm font-bold">
                Add Products →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {bestsellers.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <ProductCard product={product} variant="compact" />
                </motion.div>
              ))}
            </div>
          )}

          {/* Explore All button */}
          <div className="flex justify-center mt-7">
            <Link href="/products">
              <motion.button
                whileTap={{ scale: 0.96 }}
                className="border-2 border-[#1B4332] text-[#1B4332] px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#1B4332] hover:text-white transition-all"
              >
                EXPLORE ALL PRODUCTS <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <FAQ />

      {/* ─── NEWSLETTER ─── */}
      <section className="bg-[#F7F4EF] py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <span className="bg-[#F0E8D8] text-stone-500 text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
            JOIN THE COMMUNITY
          </span>
          <h2 className="text-2xl font-playfair font-bold text-stone-900 mt-4 mb-2">
            Start Your Organic Journey
          </h2>
          <p className="text-stone-400 text-[11px] mb-8 leading-relaxed">
            Join 10,000+ happy families receiving weekly health tips and exclusive harvest releases.
          </p>
          <form className="flex gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow bg-white border border-stone-200 rounded-full px-5 py-3 text-sm outline-none focus:border-[#1B4332] transition-colors"
            />
            <button type="submit" className="bg-[#1B4332] text-white px-6 py-3 rounded-full text-sm font-black hover:bg-[#14532d] transition-colors">
              JOIN NOW
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
