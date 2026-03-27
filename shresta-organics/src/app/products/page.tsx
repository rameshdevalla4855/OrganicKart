'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/firebase/firebaseInit';
import { Loader2 } from 'lucide-react';
import { ProductGridSkeleton } from '@/components/Skeletons';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProductStore } from '@/store/productStore';

import { Suspense } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  image_url: string;
  weight: string;
}

function ProductsContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Use Global Product Store
  const { products, loading: productsLoading, fetchProducts } = useProductStore() as { 
    products: Product[], 
    loading: boolean, 
    fetchProducts: () => void 
  };
  
  // Initialize category from URL or default to 'All'
  const initialCategory = searchParams.get('category') || 'All';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  
  const searchQueryParam = searchParams.get('search') || '';

  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    setActiveCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/products');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchProducts(); // Store handles caching internally
    }
  }, [user, fetchProducts]);

  // Combined Loading State
  const loading = productsLoading || (authLoading && products.length === 0);

  if (authLoading || (!user && !loading)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
        <ProductGridSkeleton />
      </div>
    );
  }

  const filteredProducts = products.filter((p: Product) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = !searchQueryParam || 
      p.name.toLowerCase().includes(searchQueryParam.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQueryParam.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-4">All Organic Products</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Browse our complete catalog of 100% certified organic, chemical-free products directly sourced from farms.
        </p>
      </div>
      
      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        {['All', 'Oils', 'Spices', 'Sweeteners'].map((cat: string) => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-8 py-3 rounded-full text-sm font-bold shadow-sm transition-all duration-300 ${
              activeCategory === cat 
                ? 'bg-primary text-white scale-105' 
                : 'bg-white text-gray-700 border border-gray-200 hover:border-primary hover:text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <ProductGridSkeleton />
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
          <h3 className="text-2xl font-playfair text-gray-600 mb-2">No Products Found</h3>
          <p className="text-gray-500">Products in the {activeCategory} category will appear here once uploaded by Admin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product: Product, index: number) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
          <ProductGridSkeleton />
       </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
