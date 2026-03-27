'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaChevronRight } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

const COLLECTIONS = [
  {
    name: "Pure Wood Pressed Oils",
    description: "Cold-pressed traditional oils",
    image: "/images/home/collection_oils.png",
    link: "/products?category=Oils",
    color: "bg-[#FDF2E9]"
  },
  {
    name: "Aromatic Spices",
    description: "Finest organic spice blends",
    image: "/images/home/collection_spices.png",
    link: "/products?category=Spices",
    color: "bg-[#FEF9E7]"
  },
  {
    name: "Natural Sweeteners",
    description: "Jaggery & Honey treasures",
    image: "/placeholder.svg",
    link: "/products?category=Sweeteners",
    color: "bg-[#F4F8F4]"
  },
  {
    name: "Grains & Cereals",
    description: "Wholesome organic staples",
    image: "/placeholder.svg",
    link: "/products?category=Grains",
    color: "bg-[#F9F5EF]"
  }
];

export default function CollectionSlider() {
  const { user } = useAuth();
  const router = useRouter();

  const handleCollectionClick = (link: string) => {
    if (user) {
      router.push(link);
    } else {
      router.push(`/login?redirect=${encodeURIComponent(link)}`);
    }
  };

  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-2 block">Our Curated Ranges</span>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary">Shop by Collection</h2>
          </motion.div>
          <div className="hidden sm:flex space-x-2">
             <div className="w-10 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-accent"></div>
             </div>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex space-x-6 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar">
          {COLLECTIONS.map((col, i) => (
            <motion.div
              key={col.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex-shrink-0 w-[24rem] snap-center"
            >
              <button 
                onClick={() => handleCollectionClick(col.link)}
                className="group block h-full w-full text-left"
              >
                <div className={`relative h-[30rem] rounded-3xl overflow-hidden ${col.color} p-8 flex flex-col justify-between transition-all duration-500 group-hover:shadow-2xl`}>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-playfair font-bold text-primary mb-2 transition-transform group-hover:-translate-y-1">{col.name}</h3>
                    <p className="text-gray-600 font-medium">{col.description}</p>
                  </div>
                  
                  <div className="relative h-64 w-full transition-transform duration-700 group-hover:scale-110">
                    <Image 
                       src={col.image} 
                       alt={col.name} 
                       fill 
                       className="object-contain"
                    />
                  </div>

                  <div className="relative z-10 flex justify-between items-center">
                    <span className="flex items-center text-sm font-bold text-primary group-hover:text-accent transition-colors">
                      Browse Collection <FaChevronRight className="w-4 h-4 ml-1" />
                    </span>
                    <div className="w-12 h-12 rounded-full border border-primary/10 flex items-center justify-center bg-white group-hover:bg-accent group-hover:border-accent transition-all duration-300">
                      <FaChevronRight className="w-5 h-5 text-primary group-hover:text-white" />
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
