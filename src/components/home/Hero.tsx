'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const slides = [
  {
    image: "/images/home/hero.png",
    badge: "WOOD PRESSED",
    title: "Organic Harvest",
    subtitle: "Farm-Fresh & Pure",
    cta: "SHOP NOW",
    ctaHref: "/products",
  },
  {
    image: "/images/home/collection_oils.png",
    badge: "COLD PRESSED",
    title: "Cold Pressed Oils",
    subtitle: "Nutrient-Rich & Pure",
    cta: "EXPLORE OILS",
    ctaHref: "/products?category=Oils",
  },
  {
    image: "/images/home/collection_spices.png",
    badge: "100% ORGANIC",
    title: "Authentic Spices",
    subtitle: "Straight from the Source",
    cta: "EXPLORE SPICES",
    ctaHref: "/products?category=Spices",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative h-[45vh] md:h-[75vh] overflow-hidden mt-16 md:mt-20">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <motion.img
            src={slide.image}
            alt={slide.title}
            initial={{ scale: 1 }}
            animate={{ scale: 1.06 }}
            transition={{ duration: 7, ease: 'linear' }}
            className="w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40" />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-3/5 bg-gradient-to-t from-black/70 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Slide counter top-right */}
      <div className="absolute top-4 right-5 z-20 text-white/60 text-xs font-bold tracking-widest">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>

      {/* Left / Right arrows */}
      <button
        onClick={() => setCurrent((current - 1 + slides.length) % slides.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => setCurrent((current + 1) % slides.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              {slide.badge}
            </span>
            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white leading-tight mb-1">
              {slide.title}
            </h1>
            {/* Subtitle */}
            <p className="text-white/70 italic text-sm mb-5">{slide.subtitle}</p>
            {/* CTA */}
            <Link href={slide.ctaHref}>
              <button className="bg-white text-[#1B4332] px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all active:scale-95 shadow-lg">
                {slide.cta}
              </button>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex items-center gap-2 mt-5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-500 ${
                i === current ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
