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

  // If image fails to load, we show a premium CSS-based logo as fallback
  if (error) {
    return (
      <Link href="/" className={`${className} flex items-center group`}>
        <div className={`p-2 rounded-lg border border-dashed ${variant === 'footer' ? 'border-white/20' : 'border-primary/20'} flex flex-col ${variant === 'footer' ? 'text-white' : 'text-primary'}`}>
           <span className="font-playfair text-xl md:text-2xl font-black tracking-tight leading-none group-hover:scale-105 transition-transform">
             Shresta<span className="text-secondary italic">Organics</span>
           </span>
           <span className={`text-[8px] md:text-[10px] font-bold tracking-[0.2em] uppercase mt-1 ${variant === 'footer' ? 'text-white/50' : 'text-accent'}`}>
             Pure Food • Pure Life
           </span>
        </div>
      </Link>
    );
  }

  return (
    <Link href="/" className={`${className} block relative`}>
      <div className={`relative ${variant === 'navbar' ? 'w-56 h-14 md:w-72 md:h-20' : 'w-56 h-20'}`}>
        <img
          src="/logo.png?v=2"
          alt="Shresta Organics"
          className="w-full h-full object-contain"
          onError={() => setError(true)}
        />
      </div>
    </Link>
  );
}
