'use client';

import { motion } from 'framer-motion';

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-premium overflow-hidden border border-black/5 flex flex-col h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-72 w-full bg-stone-50 flex items-center justify-center">
         <div className="w-20 h-20 rounded-full bg-stone-100/50" />
      </div>

      {/* Content Skeleton */}
      <div className="p-10 flex flex-col flex-grow space-y-6">
        <div className="h-3 w-1/4 bg-stone-100 rounded-full" />
        <div className="space-y-3">
           <div className="h-8 w-3/4 bg-stone-100 rounded-xl" />
           <div className="h-8 w-1/2 bg-stone-100 rounded-xl" />
        </div>
        
        <div className="flex items-center justify-between pt-6 mt-auto">
          <div className="h-10 w-28 bg-stone-100 rounded-xl" />
          <div className="h-5 w-16 bg-stone-100 rounded-full" />
        </div>

        {/* Button Skeleton */}
        <div className="h-14 w-full bg-stone-100 rounded-2xl mt-6 font-black text-xs uppercase opacity-40 flex items-center justify-center">
           Syncing Harvest...
        </div>
      </div>
    </div>
  );
}

export function AdminTableSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="border-b border-gray-50 animate-pulse">
          <td className="px-6 py-8">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-stone-100 rounded-2xl" />
              <div className="ml-6 space-y-3">
                <div className="h-5 bg-stone-100 rounded-lg w-48" />
                <div className="h-3 bg-stone-100 rounded-full w-24" />
              </div>
            </div>
          </td>
          <td className="px-6 py-8"><div className="h-5 bg-stone-100 rounded-lg w-24" /></td>
          <td className="px-6 py-8"><div className="h-5 bg-stone-100 rounded-lg w-20" /></td>
          <td className="px-6 py-8"><div className="h-5 bg-stone-100 rounded-lg w-20" /></td>
          <td className="px-6 py-8 text-right"><div className="h-10 bg-stone-100 rounded-2xl w-24 ml-auto" /></td>
        </tr>
      ))}
    </>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
      {[...Array(8)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
