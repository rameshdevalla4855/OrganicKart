'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, ChevronDown } from 'lucide-react';

const FAQS = [
  {
    question: "Are Shresta Organics products 100% natural?",
    answer: "Absolutely! Our products are 100% natural, ethically sourced, and free from any chemical preservatives, additives, or artificial flavors. We believe in providing food exactly as nature intended."
  },
  {
    question: "What is 'Wood Pressed' oil and why is it better?",
    answer: "Wood pressing (Kachi Ghani) is a traditional method where oil is extracted at low temperatures using a wooden churner. Unlike modern heat-based extraction, this process preserves all natural nutrients, antioxidants, and the original aroma of the oil."
  },
  {
    question: "How do you source your ingredients?",
    answer: "We work directly with certified organic farmers across India. By eliminating middle-men, we ensure the freshest produce reaches you while ensuring fair prices for our farming community."
  },
  {
    question: "Do you ship pan-India?",
    answer: "Yes, we offer pan-India shipping. Delivery usually takes 3-5 business days depending on your location. You will receive a tracking link once your order is dispatched."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-32 bg-stone-50 overflow-hidden relative border-t border-stone-100">
      {/* Subtle Structural Grid */}
      <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-3 mb-6 bg-white px-5 py-2 rounded-full border border-stone-100 shadow-sm">
             <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Knowledge Base</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-playfair font-black text-primary italic">
            Common <span className="text-secondary">Enquiries</span>
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className={`w-full text-left p-8 rounded-[2rem] transition-all duration-500 border ${
                  openIndex === index 
                    ? 'bg-white border-primary/20 shadow-premium' 
                    : 'bg-white/50 border-stone-100 hover:border-primary/20 hover:bg-white'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-lg font-black tracking-tight transition-all duration-500 ${openIndex === index ? 'text-primary' : 'text-primary/60'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${openIndex === index ? 'bg-primary text-white rotate-180 shadow-glow' : 'bg-primary/5 text-primary'}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-primary/40 text-[13px] font-black uppercase tracking-widest leading-relaxed border-t border-stone-100 pt-6">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
