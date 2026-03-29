'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart } from 'lucide-react';

import Link from 'next/link';

export default function ProductCard({ product, priority = false }) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', bounce: 0.4, duration: 0.6 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden border border-gray-100 flex flex-col"
    >
      {/* Image Container with Link */}
      <Link href={`/products/${product.id}`} className="relative h-64 w-full bg-[#F9F5EF] block cursor-pointer">
        <Image
          src={product.image_url || '/placeholder.svg'}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={!!product.image_url}
          priority={priority}
        />
        {product.isWoodPressed && (
          <div className="absolute top-4 left-4 bg-[#E67E22] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
            Wood Pressed
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-sm text-gray-500 mb-1">{product.category}</p>
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-bold text-[#1B5E20] font-playfair mb-2 line-clamp-2 hover:underline cursor-pointer">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center space-x-2 mb-4 mt-auto">
          {product.discountPrice ? (
            <>
              <span className="text-xl font-bold text-gray-900">₹{product.discountPrice}</span>
              <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
            </>
          ) : (
            <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
          )}
          <span className="text-sm text-gray-500 ml-auto">{product.weight}</span>
        </div>

        {/* Action Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => addToCart(product, 1)}
          className="w-full bg-[#1B5E20] hover:bg-[#144716] text-white py-3 rounded-xl font-medium flex justify-center items-center transition-colors duration-200"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
}
