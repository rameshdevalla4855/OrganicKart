'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaChevronRight, FaLeaf } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useProductStore } from '@/store/productStore';

const COLORS = ['bg-[#FDF2E9]', 'bg-[#FEF9E7]', 'bg-[#F4F8F4]', 'bg-[#F9F5EF]'];

export default function CollectionSlider() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Dynamic Products
  const { products, fetchProducts } = useProductStore() as { 
    products: any[], 
    fetchProducts: () => void 
  };
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleProductClick = (link: string) => {
    if (user) {
      router.push(link);
    } else {
      router.push(`/login?redirect=${encodeURIComponent(link)}`);
    }
  };

  // Select top 5-6 products to feature
  const displayItems = products.slice(0, 6);

  if (!displayItems.length) return null;

  return (
    <section className="relative py-24 overflow-hidden bg-background">
      <div className="max-w-full mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-[1px] bg-primary" />
              <span className="text-primary font-black tracking-[0.3em] uppercase text-[10px]">Premium Collections</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-playfair font-black text-primary leading-tight whitespace-nowrap">
              Shop By <span className="text-primary italic">Category</span>
            </h2>
          </motion.div>
        </div>

        {/* Horizontal Scroll Container - Side by Side with Gap 5 (approx 20px) */}
        <div className="flex gap-5 overflow-x-auto pb-12 snap-x snap-mandatory no-scrollbar">
          {displayItems.map((prod, i) => {
            return (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="flex-shrink-0 w-[45vw] md:w-[32rem] snap-start"
              >
                <button 
                  onClick={() => handleProductClick(`/products/${prod.id}`)}
                  className="group block w-full text-left"
                >
                  {/* Big Image Container - Using white background for light mode */}
                  <div className="relative aspect-square w-full rounded-[3rem] overflow-hidden bg-white border border-primary/10 transition-all duration-700 group-hover:shadow-xl mb-8 group-hover:border-primary/20">
                    <Image 
                       src={prod.image_url || '/placeholder.svg'} 
                       alt={prod.name} 
                       fill 
                       className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    {/* View Badge - Primary Color */}
                    <div className="absolute bottom-8 right-8 z-10 w-16 h-16 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 shadow-lg">
                       <FaChevronRight className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Name and Details Below Image */}
                  <div className="px-4">
                    <div className="flex items-center space-x-2 mb-2">
                       <FaLeaf className="w-2.5 h-2.5 text-primary" />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 group-hover:text-primary transition-colors">{prod.category}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-playfair font-black text-primary mb-2 transition-colors duration-500">
                      {prod.name}
                    </h3>
                    <p className="text-primary/60 font-bold text-sm uppercase tracking-widest group-hover:text-primary transition-colors">
                      Starting from ₹{prod.discountPrice || prod.price}
                    </p>
                  </div>
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
