'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const slides = [
  {
    image: "/images/home/hero.png",
    title: "Organic Harvest",
  },
  {
    image: "/images/home/collection_oils.png",
    title: "Pure Purity",
  },
  {
    image: "/images/home/collection_spices.png",
    title: "Authentic Spices",
  }
];

export default function Hero() {
  const { user } = useAuth();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000); // 6 second gap
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[35vh] md:h-[80vh] min-h-[300px] md:min-h-[550px] flex items-center overflow-hidden bg-[#FDFCFB] mt-20 md:mt-40">
      {/* Cinematic Background Slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {/* Ken Burns Effect - Continuous slow zoom */}
            <motion.img 
              src={slides[current].image} 
              alt="Botanical Background" 
              initial={{ scale: 1 }}
              animate={{ scale: 1.08 }}
              transition={{ duration: 8, ease: "linear" }}
              className="w-full h-full object-cover origin-center"
            />
            
            {/* Premium Grain Texture Overlay */}
            <div className="absolute inset-0 bg-grain opacity-[0.04] pointer-events-none" />
            
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCFB] via-transparent to-transparent opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#FDFCFB]/40 via-transparent to-transparent opacity-60" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Technical Grid Accent - Grounded behind navigation */}
      <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none z-[1]" />

      {/* Minimalism Slide Counter - Top Right */}
      <div className="absolute top-12 right-12 z-20 flex items-center space-x-4">
         <span className="text-[11px] font-black text-primary/40 uppercase tracking-[0.4em]">Slide</span>
         <div className="w-12 h-px bg-primary/20" />
         <div className="flex items-center space-x-2">
            <span className="text-sm font-black text-primary tracking-tighter">0{current + 1}</span>
            <span className="text-[10px] font-black text-primary/20">/</span>
            <span className="text-[10px] font-black text-primary/20">0{slides.length}</span>
         </div>
      </div>

      {/* Navigation Layer - Refined Minimalist Controls */}
      <div className="max-w-full mx-auto px-12 md:px-20 w-full relative z-20 flex items-center justify-between pointer-events-none">
         
         <button 
           onClick={() => setCurrent((current - 1 + slides.length) % slides.length)} 
           className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-primary/5 flex items-center justify-center text-primary/40 hover:text-primary hover:bg-white hover:border-primary/10 transition-all duration-700 pointer-events-auto shadow-sm group active:scale-95"
         >
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
         </button>

         <button 
           onClick={() => setCurrent((current + 1) % slides.length)} 
           className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-primary/5 flex items-center justify-center text-primary/40 hover:text-primary hover:bg-white hover:border-primary/10 transition-all duration-700 pointer-events-auto shadow-sm group active:scale-95"
         >
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
         </button>
      </div>

      {/* Minimalist Progress Line Indicators - Center Bottom */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-6">
         {slides.map((_, i) => (
           <button
             key={i}
             onClick={() => setCurrent(i)}
             className="group relative flex flex-col items-center py-4"
           >
             <div className={`h-[1.5px] transition-all duration-1000 ${i === current ? 'w-12 bg-primary' : 'w-4 bg-primary/10 group-hover:bg-primary/30'}`} />
             <span className={`absolute -top-4 text-[9px] font-black transition-all duration-700 ${i === current ? 'opacity-100 text-primary translate-y-0' : 'opacity-0 text-primary/40 translate-y-2'}`}>
                {slides[i].title.split(' ')[0]}
             </span>
           </button>
         ))}
      </div>
    </section>
  );
}
