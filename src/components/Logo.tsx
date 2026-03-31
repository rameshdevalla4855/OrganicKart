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

  return (
    <Link href="/" className={`${className} block group`}>
      <div className={`relative flex items-center ${
        variant === 'navbar' ? 'h-10 md:h-12 w-auto min-w-[120px]' : 'h-16 w-auto min-w-[160px]'
      }`}>
        {!error ? (
          <img
            src="/logo.png"
            alt="Shresta Organics"
            className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
            onError={() => setError(true)}
          />
        ) : (
          <div className="flex flex-col leading-none">
            <span className={`font-playfair font-black tracking-tight italic ${
              variant === 'navbar' ? 'text-xl text-[#1B4332]' : 'text-3xl text-white'
            }`}>
              Shresta<span className="text-secondary">Organics</span>
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
