'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
      {/* Ultra-responsive top progress bar */}
      <motion.div 
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ 
          scaleX: 0.9, 
          opacity: 1,
          transition: { duration: 10, ease: "easeOut" } 
        }}
        className="h-1.5 bg-primary origin-left shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
      />
      
      {/* Subtle pulse element */}
      <motion.div 
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute top-4 right-8 flex items-center space-x-2"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
          Syncing...
        </span>
      </motion.div>
    </div>
  );
}
