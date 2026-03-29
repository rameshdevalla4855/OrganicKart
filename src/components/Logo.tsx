'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  variant?: 'navbar' | 'footer';
}

export default function Logo({ className = "", variant = 'navbar' }: LogoProps) {
  const [error, setError] = useState(false);

  // Logo content wrapper to reuse for both success and error states
  const LogoContent = () => (
    <div className="flex items-center space-x-3 group">
      {/* Icon/Logo Part */}
      <div className={`relative flex-shrink-0 overflow-hidden ${
        variant === 'navbar' ? 'w-24 h-24 md:w-40 md:h-40' : 'w-16 h-16'
      }`}>
        {!error ? (
          <img
            src="/logo.png?v=2"
            alt="Logo"
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
            onError={() => setError(true)}
          />
        ) : (
          <div className={`w-full h-full rounded-[2.5rem] border border-dashed flex items-center justify-center ${
            variant === 'footer' ? 'border-white/20' : 'border-primary/20'
          }`}>
             <span className={`text-[20px] font-black ${variant === 'footer' ? 'text-white' : 'text-primary'}`}>SO</span>
          </div>
        )}
      </div>

      {/* Text Part */}
      <div className="flex flex-col">
        <span className={`font-playfair font-black tracking-tight leading-none transition-all duration-500 group-hover:text-secondary ${
          variant === 'navbar' ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl text-white'
        }`}>
          Shresta<span className="text-secondary italic">Organics</span>
        </span>
        {variant === 'navbar' && (
          <span className="text-[9px] md:text-[11px] font-bold text-accent uppercase tracking-[0.3em] mt-2 opacity-60">
            Pure Food • Pure Life
          </span>
        )}
      </div>
    </div>
  );

  return (
    <Link href="/" className={`${className} block`}>
      <LogoContent />
    </Link>
  );
}
