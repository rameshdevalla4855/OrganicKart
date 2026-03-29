'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FaArrowRight, FaLeaf, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

const slides = [
  {
    image: "/images/home/hero.png",
    title: "Nourish Your Soul with Nature",
    subtitle: "Bring home the goodness of 100% certified organic products, sourced ethically from traditional Indian farms.",
    accent: "Nature"
  },
  {
    image: "/images/home/collection_oils.png",
    title: "Cold Pressed Purity in Every Drop",
    subtitle: "Experience the richness of traditional wood-pressed oils, extracted slowly to preserve every nutrient.",
    accent: "Purity"
  },
  {
    image: "/images/home/collection_spices.png",
    title: "Authentic Flavors, Zero Chemicals",
    subtitle: "Hand-pounded spices that bring the true taste of India to your kitchen, without any additives.",
    accent: "Flavors"
  }
];

export default function Hero() {
  const { user } = useAuth();
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleStartShopping = () => {
    router.push(user ? '/products' : '/login?redirect=/products');
  };

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-[85vh] flex items-center overflow-hidden bg-black">
      {/* Background Images with AnimatePresence */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img 
              src={slides[current].image} 
              alt="Organic Banner" 
              className="w-full h-full object-cover brightness-[0.4]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/30 to-transparent"></div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl text-white"
          >
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 w-fit mb-8">
              <FaLeaf className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold tracking-widest uppercase">Purely Handpicked Organic Essentials</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-playfair font-bold mb-6 leading-[1.1]">
              {slides[current].title.split(slides[current].accent)[0]}
              <span className="text-accent italic">{slides[current].accent}</span>
              {slides[current].title.split(slides[current].accent)[1]}
            </h1>
            
            <p className="text-xl text-white/90 mb-10 leading-relaxed font-light">
              {slides[current].subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button 
                onClick={handleStartShopping}
                className="group relative w-full sm:w-auto px-10 py-5 bg-accent text-white rounded-2xl font-bold text-lg overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(212,163,115,0.4)]"
              >
                <span className="relative z-10">Start Shopping</span>
                <FaArrowRight className="inline-block ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => router.push('/about')}
                className="text-white hover:text-accent font-bold text-lg flex items-center transition-colors group"
              >
                Learn Our Process
                <div className="w-0 group-hover:w-8 h-0.5 bg-accent ml-3 transition-all duration-300"></div>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-12 right-12 z-20 flex space-x-4">
        <button onClick={prevSlide} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all">
          <FaChevronLeft />
        </button>
        <button onClick={nextSlide} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all">
          <FaChevronRight />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, i) => (
          <button 
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${current === i ? 'w-8 bg-accent' : 'w-2 bg-white/30'}`}
          />
        ))}
      </div>

      {/* User Count Badge */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute top-24 right-20 hidden lg:flex flex-col items-center justify-center w-32 h-32 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white p-4 text-center"
      >
        <span className="text-2xl font-bold font-playfair">10K+</span>
        <span className="text-[10px] uppercase tracking-widest leading-tight">Families<br/>Trust Us</span>
      </motion.div>
    </section>
  );
}
