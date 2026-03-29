'use client';

import { motion } from 'framer-motion';

export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-[2rem] shadow-premium overflow-hidden border border-black/5 flex flex-col h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-72 w-full bg-gray-100/50 flex items-center justify-center">
         <div className="w-16 h-16 rounded-full bg-gray-200/50" />
      </div>

      {/* Content Skeleton */}
      <div className="p-8 flex flex-col flex-grow space-y-4">
        <div className="h-3 w-1/4 bg-gray-100 rounded-full" />
        <div className="space-y-2">
           <div className="h-6 w-3/4 bg-gray-100 rounded-lg" />
           <div className="h-6 w-1/2 bg-gray-100 rounded-lg" />
        </div>
        
        <div className="flex items-center justify-between pt-4 mt-auto">
          <div className="h-8 w-24 bg-gray-100 rounded-lg" />
          <div className="h-4 w-12 bg-gray-100 rounded-full" />
        </div>

        {/* Button Skeleton */}
        <div className="h-14 w-full bg-gray-100 rounded-2xl mt-4" />
      </div>
    </div>
  );
}
