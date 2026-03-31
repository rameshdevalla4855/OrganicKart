'use client';

import { useEffect, useState, use } from 'react';
import { collection, query, where, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseInit';
import { useCartStore } from '../../../store/cartStore';
import Image from 'next/image';
import { ShoppingCart, ChevronLeft, Star, CheckCircle, Package, ArrowRight, ShieldCheck, Truck, RefreshCcw, Info, Heart, Share2 } from 'lucide-react';
import { FaLeaf } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  image_url: string;
  images?: string[];
  weight: string;
  description: string;
  isWoodPressed: boolean;
  stock_count: number;
}

// Mock Reviews for Flipkart Style Feel
const MOCK_REVIEWS = [
  { id: 1, user: "Anita R.", rating: 5, comment: "Absolutely pure and authentic. The aroma is exactly like what we used to get in our village.", date: "2 days ago", verified: true },
  { id: 2, user: "Vikram S.", rating: 4, comment: "High quality packaging and very fast delivery. The oil is clearly wood-pressed.", date: "1 week ago", verified: true },
  { id: 3, user: "Suresh K.", rating: 5, comment: "Finally found a brand that doesn't use chemicals. Highly recommended for health-conscious families.", date: "2 weeks ago", verified: true },
];

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'qa'>('details');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const router = useRouter();
  
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const mainProduct = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(mainProduct);

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
      <div className="max-w-7xl mx-auto px-6 py-12 animate-pulse bg-[#F7F4EF] min-h-screen">
        <div className="h-6 w-48 bg-stone-200 rounded mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
           <div className="h-[600px] bg-white rounded-3xl border border-stone-100" />
           <div className="space-y-8">
              <div className="h-4 w-24 bg-stone-200 rounded" />
              <div className="h-12 w-3/4 bg-stone-200 rounded" />
              <div className="h-24 w-full bg-stone-200 rounded" />
              <div className="h-16 w-1/2 bg-stone-200 rounded" />
           </div>
        </div>
      </div>
  );

  if (!product) return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center">
      <h2 className="text-3xl font-playfair font-black text-primary">Product Not Found</h2>
      <button onClick={() => router.back()} className="mt-8 px-8 py-3 bg-primary text-white rounded-full font-black uppercase tracking-widest text-xs">Return to Shop</button>
    </div>
  );

  const discountAmount = product.discountPrice ? product.price - product.discountPrice : 0;
  const discountPercent = product.discountPrice ? Math.round((discountAmount / product.price) * 100) : 0;

  return (
    <div className="bg-[#F7F4EF] min-h-screen pt-20">
      {/* Breadcrumbs - Base44 Style */}
      <div className="max-w-screen-lg mx-auto px-4 py-6 text-[10px] font-black uppercase tracking-widest text-stone-400 flex items-center space-x-2">
         <Link href="/" className="hover:text-[#1B4332]">Home</Link>
         <span>/</span>
         <Link href="/products" className="hover:text-[#1B4332]">Shop</Link>
         <span>/</span>
         <Link href={`/products?category=${product.category}`} className="hover:text-[#1B4332]">{product.category}</Link>
         <span>/</span>
         <span className="text-[#1B4332] truncate">{product.name}</span>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start bg-white p-6 md:p-10 rounded-3xl border border-stone-100 shadow-sm mb-16">
          
          {/* Left Column: Image Center */}
          <div className="md:col-span-5 h-fit">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#F7F4EF] border border-stone-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={(product.images && product.images.length > 0 ? product.images[activeImageIndex] : product.image_url) || '/placeholder.svg'}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                    unoptimized={true}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                 {product.discountPrice && (
                    <div className="bg-[#DC6827] text-white px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-wider">
                       {discountPercent}% OFF
                    </div>
                 )}
                 {product.isWoodPressed && (
                    <div className="bg-[#1B4332] text-white px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-wider">
                       Wood Pressed
                    </div>
                 )}
              </div>

              {/* Interaction Overlay */}
              <button className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white flex items-center justify-center text-stone-400 hover:text-red-500 hover:scale-105 transition-all shadow-sm border border-stone-100">
                 <Heart className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail Selection */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto no-scrollbar pb-2">
                 {product.images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all bg-white ${activeImageIndex === idx ? 'border-[#1B4332]' : 'border-stone-100'}`}
                    >
                      <Image src={img} alt={`${product.name} thumh`} fill className="object-cover p-1" unoptimized />
                    </button>
                 ))}
              </div>
            )}
          </div>

          {/* Right Column: Information Hub */}
          <div className="md:col-span-7">
            <div className="mb-6">
              <span className="text-[#DC6827] font-black text-[10px] uppercase tracking-widest mb-3 block">{product.category}</span>
              <h1 className="text-3xl md:text-5xl font-playfair font-bold text-[#1B4332] mb-4 leading-tight">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#DC6827] text-[#DC6827]" />
                  ))}
                  <span className="text-stone-500 font-bold text-xs ml-2">(142)</span>
                </div>
                <div className="h-4 w-px bg-stone-200" />
                <span className="text-xs font-black text-stone-500 uppercase tracking-wider">{product.weight}</span>
              </div>

              {/* Price */}
              <div className="flex items-end space-x-3 mb-8">
                 <span className="text-4xl font-black text-[#1B4332]">₹{product.discountPrice || product.price}</span>
                 {product.discountPrice && (
                    <span className="text-lg text-stone-400 line-through font-bold mb-1">₹{product.price}</span>
                 )}
              </div>
            </div>

            <div className="space-y-8">
               {/* Action Area */}
               <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center bg-stone-50 rounded-full border border-stone-200">
                    <button 
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-12 h-12 flex items-center justify-center text-stone-500 hover:text-[#1B4332] transition-colors text-lg font-black"
                    >−</button>
                    <div className="w-10 text-center font-bold text-[#1B4332]">{qty}</div>
                    <button 
                      onClick={() => setQty(qty + 1)}
                      className="w-12 h-12 flex items-center justify-center text-stone-500 hover:text-[#1B4332] transition-colors text-lg font-black"
                    >+</button>
                  </div>
                  
                  <button
                    disabled={product.stock_count <= 0}
                    onClick={() => addToCart(product, qty)}
                    className="flex-grow w-full bg-[#1B4332] text-white py-3.5 px-8 rounded-full font-black text-xs uppercase tracking-widest flex justify-center items-center transition-all hover:bg-[#1B4332]/90 active:scale-95 disabled:opacity-50"
                  >
                    <ShoppingCart className="w-4 h-4 mr-3" />
                    {product.stock_count <= 0 ? 'Out of Stock' : 'ADD TO CART'}
                  </button>
               </div>
               
               {/* Sticky Mobile Add to Cart (App-Style Flush Footer) */}
               <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 py-4 bg-white border-t border-stone-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-4 max-w-md mx-auto">
                     <div className="flex flex-col">
                        <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest leading-none mb-1">Total</p>
                        <p className="text-xl font-black text-[#1B4332] tracking-tighter leading-none">₹{(product.discountPrice || product.price) * qty}</p>
                     </div>
                     <button
                        disabled={product.stock_count <= 0}
                        onClick={() => addToCart(product, qty)}
                        className="flex-grow bg-[#1B4332] text-white py-3.5 rounded-full font-black text-[10px] uppercase tracking-widest active:scale-95 flex items-center justify-center gap-2"
                     >
                        <ShoppingCart className="w-4 h-4" />
                        {product.stock_count <= 0 ? 'Out of Stock' : 'ADD TO CART'}
                     </button>
                  </div>
               </div>

               {/* Base44 Clean Tabs */}
               <div className="border-b border-stone-100 flex space-x-8">
                  {['details', 'reviews', 'qa'].map((tab) => (
                     <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-3 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-[#1B4332]' : 'text-stone-400 hover:text-stone-600'}`}
                     >
                        {tab === 'details' ? 'Description' : tab === 'reviews' ? 'Ratings' : 'FAQ'}
                        {activeTab === tab && (
                           <motion.div layoutId="tabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B4332]" />
                        )}
                     </button>
                  ))}
               </div>

               <div className="min-h-[150px]">
                  <AnimatePresence mode="wait">
                     {activeTab === 'details' && (
                        <motion.div 
                           key="details"
                           initial={{ opacity: 0, y: 5 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -5 }}
                           className="space-y-6"
                        >
                           <p className="text-stone-600 font-medium text-sm leading-relaxed whitespace-pre-wrap">{product.description}</p>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                              {[
                                 { icon: ShieldCheck, label: "Lab Tested & Certified" },
                                 { icon: CheckCircle, label: "Zero Chemical Residue" },
                              ].map((f, i) => (
                                 <div key={i} className="flex items-center space-x-3 p-3 bg-[#F7F4EF] rounded-xl border border-stone-100">
                                    <f.icon className="w-4 h-4 text-[#DC6827]" />
                                    <span className="text-[10px] font-black text-[#1B4332] uppercase tracking-wider">{f.label}</span>
                                 </div>
                              ))}
                           </div>
                        </motion.div>
                     )}

                     {activeTab === 'reviews' && (
                        <motion.div 
                           key="reviews"
                           initial={{ opacity: 0, y: 5 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -5 }}
                           className="space-y-6"
                        >
                           {MOCK_REVIEWS.map((review) => (
                              <div key={review.id} className="pb-6 border-b border-stone-100 last:border-0">
                                 <div className="flex justify-between items-start mb-2">
                                    <div>
                                       <div className="flex items-center space-x-1 mb-1">
                                          {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-[#DC6827] text-[#DC6827]" />)}
                                       </div>
                                       <p className="text-sm font-bold text-[#1B4332]">{review.user}</p>
                                    </div>
                                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{review.date}</span>
                                 </div>
                                 <p className="text-stone-500 text-sm leading-relaxed italic">&ldquo;{review.comment}&rdquo;</p>
                              </div>
                           ))}
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            </div>
          </div>
        </div>

        {/* Curated Bestsellers Style Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-10">
              <span className="bg-[#EAE4D9]/50 text-[#1B4332] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm inline-block mb-4">You May Also Like</span>
              <h2 className="text-4xl font-playfair font-bold text-[#1B4332]">Related Products</h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p, index) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                >
                   <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-10">
               <Link href="/products" className="inline-block px-8 py-3 rounded-full border border-[#1B4332] text-[#1B4332] text-[10px] font-black uppercase tracking-widest hover:bg-[#1B4332] hover:text-white transition-colors">
                 Explore All Products
               </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
