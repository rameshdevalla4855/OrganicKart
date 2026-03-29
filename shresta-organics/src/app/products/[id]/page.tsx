'use client';

import { useEffect, useState, use } from 'react';
import { collection, query, where, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseInit';
import { useCartStore } from '../../../store/cartStore';
import Image from 'next/image';
import { ShoppingCart, ChevronLeft, Loader2, Star, CheckCircle, Package, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  image_url: string;
  weight: string;
  description: string;
  isWoodPressed: boolean;
  stock_count: number;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const router = useRouter();
  
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Main Product
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const mainProduct = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(mainProduct);

          // 2. Fetch Related Products (Same category, distinct ID)
          const q = query(
            collection(db, 'products'),
            where('category', '==', mainProduct.category),
            limit(10)
          );
          const relatedSnap = await getDocs(q);
          const fetchedRelated = relatedSnap.docs
            .map(d => ({ id: d.id, ...d.data() } as Product))
            .filter((p: Product) => p.id !== id)
            .slice(0, 4);
          
          setRelatedProducts(fetchedRelated);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="min-h-[80vh] flex justify-center items-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  if (!product) return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center">
      <h2 className="text-3xl font-playfair font-bold text-gray-900">Product Not Found</h2>
      <button onClick={() => router.back()} className="mt-4 text-primary hover:underline">Go Back</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => router.back()} className="flex items-center text-gray-500 hover:text-primary transition-colors mb-8 font-medium">
        <ChevronLeft className="w-5 h-5 mr-1" /> Back to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
        {/* Left: Product Image */}
        <div className="relative h-96 md:h-[600px] w-full rounded-3xl overflow-hidden bg-background border border-gray-100 shadow-sm">
          <Image
            src={product.image_url || '/placeholder.svg'}
            alt={product.name}
            fill
            className="object-cover object-center"
            unoptimized={!!product.image_url}
          />
          {product.isWoodPressed && (
            <div className="absolute top-6 left-6 bg-[#E67E22] text-white px-4 py-2 rounded-full font-bold shadow-lg">
              Wood Pressed Certified
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col justify-center">
          <div className="mb-6">
            <p className="text-accent font-medium mb-2">{product.category}</p>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-4 leading-tight">{product.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <span className="text-gray-500 text-sm ml-2 font-medium">(5.0 Rating)</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500 font-medium flex items-center"><Package className="w-4 h-4 mr-1"/> {product.weight}</span>
            </div>
          </div>

          <div className="mb-8">
            <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
            <p className="text-sm text-gray-500 mt-2">Inclusive of all taxes</p>
          </div>

          <div className="prose max-w-none text-gray-600 mb-8 whitespace-pre-wrap leading-relaxed">
            {product.description}
          </div>

          {/* Quick value props */}
          <div className="grid grid-cols-2 gap-4 mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div className="flex items-center text-sm font-medium text-gray-700"><CheckCircle className="text-green-500 w-5 h-5 mr-3" /> Zero Chemicals</div>
            <div className="flex items-center text-sm font-medium text-gray-700"><CheckCircle className="text-green-500 w-5 h-5 mr-3" /> Farm to Home</div>
            <div className="flex items-center text-sm font-medium text-gray-700"><CheckCircle className="text-green-500 w-5 h-5 mr-3" /> 100% Organic</div>
            <div className="flex items-center text-sm font-medium text-gray-700">
              <CheckCircle className="text-green-500 w-5 h-5 mr-3" /> 
              {product.stock_count > 0 ? <span className="text-green-600 font-bold">{product.stock_count} in Stock</span> : <span className="text-red-500">Out of Stock</span>}
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="flex items-center space-x-4 border-t border-gray-100 pt-8">
            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-5 py-4 text-gray-600 hover:bg-gray-50 transition-colors font-medium text-lg"
              >-</button>
              <div className="w-12 text-center font-bold text-gray-900 text-lg">{qty}</div>
              <button 
                onClick={() => setQty(qty + 1)}
                className="px-5 py-4 text-gray-600 hover:bg-gray-50 transition-colors font-medium text-lg"
              >+</button>
            </div>
            
            <button
              disabled={product.stock_count <= 0}
              onClick={() => addToCart(product, qty)}
              className="flex-grow bg-primary hover:bg-primary-hover text-white py-4 px-8 rounded-xl font-medium text-lg flex justify-center items-center transition-transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:hover:scale-100"
            >
              <ShoppingCart className="w-5 h-5 mr-3" />
              {product.stock_count <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-100 pt-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-2">Customers Also Loved</h2>
              <p className="text-gray-500">Curated recommendations from the <span className="text-accent font-semibold">{product.category}</span> collection.</p>
            </motion.div>
            
            <Link 
              href={`/products?category=${product.category}`} 
              className="flex items-center text-primary font-bold hover:text-accent transition-colors group"
            >
              View Full Collection <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                 <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
