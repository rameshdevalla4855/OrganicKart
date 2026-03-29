'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus, FaQuestionCircle } from 'react-icons/fa';

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
    <section className="py-24 bg-[#F9F5EF]/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <FaQuestionCircle className="w-12 h-12 text-accent mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600">Got questions? We&apos;ve got answers about our organic journey.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left transition-colors hover:bg-gray-50/50"
              >
                <span className="text-lg font-bold text-primary pr-8">{faq.question}</span>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-primary">
                  {openIndex === i ? <FaMinus className="w-4 h-4" /> : <FaPlus className="w-4 h-4" />}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
