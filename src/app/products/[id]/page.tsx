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
     <div className="max-w-7xl mx-auto px-6 py-12 animate-pulse">
        <div className="h-6 w-48 bg-stone-100 rounded mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
           <div className="h-[600px] bg-stone-50 rounded-[3rem]" />
           <div className="space-y-8">
              <div className="h-4 w-24 bg-stone-100 rounded" />
              <div className="h-12 w-3/4 bg-stone-100 rounded" />
              <div className="h-24 w-full bg-stone-100 rounded" />
              <div className="h-16 w-1/2 bg-stone-100 rounded" />
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
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs - Flipkart Style */}
      <div className="max-w-7xl mx-auto px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center space-x-2">
         <Link href="/" className="hover:text-primary">Home</Link>
         <span>/</span>
         <Link href="/products" className="hover:text-primary">Shop</Link>
         <span>/</span>
         <Link href={`/products?category=${product.category}`} className="hover:text-primary">{product.category}</Link>
         <span>/</span>
         <span className="text-primary truncate">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Image Center (Sticky Carousel) */}
          <div className="lg:col-span-6 lg:sticky lg:top-32 h-fit">
            <div className="relative aspect-square w-full rounded-[2rem] lg:rounded-[3.5rem] overflow-hidden bg-stone-50 border border-black/5 shadow-premium">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImageIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={(product.images && product.images.length > 0 ? product.images[activeImageIndex] : product.image_url) || '/placeholder.svg'}
                    alt={product.name}
                    fill
                    className="object-cover object-center"
                    unoptimized={true}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                 {product.isWoodPressed && (
                    <div className="bg-secondary text-white px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest shadow-premium">
                       Wood Pressed
                    </div>
                 )}
                 <div className="bg-white text-primary px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest shadow-premium border border-black/5">
                    100% Organic
                 </div>
              </div>

              {/* Interaction Overlay */}
              <div className="absolute top-6 right-6 flex flex-col gap-2">
                 <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:scale-110 transition-all shadow-premium">
                    <Heart className="w-4.5 h-4.5" />
                 </button>
              </div>

              {/* Carousel Pagination Dots */}
              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${activeImageIndex === idx ? 'w-6 bg-primary' : 'w-1.5 bg-primary/20'}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Selection */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 mt-6 overflow-x-auto no-scrollbar pb-2">
                 {product.images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImageIndex === idx ? 'border-primary' : 'border-black/5'}`}
                    >
                      <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" unoptimized />
                    </button>
                 ))}
              </div>
            )}
          </div>

          {/* Right Column: Information Hub */}
          <div className="lg:col-span-6">
            <div className="mb-10">
              <span className="text-secondary font-black text-[11px] uppercase tracking-[0.3em] mb-4 block">Harvested with care</span>
              <h1 className="text-4xl md:text-6xl font-playfair font-black text-primary mb-6 leading-[1.1]">{product.name}</h1>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center bg-green-50 px-4 py-2 rounded-xl group cursor-pointer hover:bg-green-100 transition-colors">
                  <Star className="w-4 h-4 text-primary fill-current mr-2" />
                  <span className="text-primary font-black text-sm">5.0</span>
                  <span className="text-gray-400 text-xs ml-3 font-bold">(142 Reviews)</span>
                </div>
                <div className="h-6 w-px bg-stone-100" />
                <div className="flex items-center text-gray-400">
                   <Package className="w-4 h-4 mr-2" />
                   <span className="text-xs font-black uppercase tracking-widest">{product.weight} Pack</span>
                </div>
              </div>
            </div>

            {/* Pricing Marketplace View */}
            <div className="mb-12 p-8 rounded-[2.5rem] bg-stone-50 border border-black/5 relative overflow-hidden">
              <div className="flex items-end space-x-5 mb-3">
                 <span className="text-5xl font-black text-gray-900">₹{product.discountPrice || product.price}</span>
                 {product.discountPrice && (
                    <>
                       <span className="text-xl text-gray-400 line-through font-bold mb-1">₹{product.price}</span>
                       <span className="text-lg text-accent font-black mb-1">{discountPercent}% OFF</span>
                    </>
                 )}
              </div>
              <p className="text-[11px] font-black text-primary/40 uppercase tracking-[0.2em] flex items-center">
                 <ShieldCheck className="w-3.5 h-3.5 mr-2 text-primary" /> Trusted Flipkart-Grade Quality Guaranteed
              </p>
              
              <div className="mt-8 pt-8 border-t border-black/5 grid grid-cols-2 gap-6">
                 <div className="flex items-center text-xs font-black text-gray-600 uppercase tracking-widest">
                    <Truck className="w-4 h-4 mr-3 text-secondary" /> Faster Delivery
                 </div>
                 <div className="flex items-center text-xs font-black text-gray-600 uppercase tracking-widest">
                    <RefreshCcw className="w-4 h-4 mr-3 text-secondary" /> 7 Day Returns
                 </div>
              </div>
            </div>

            <div className="space-y-12">
               {/* Action Area */}
               <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="flex items-center p-2 bg-stone-50 rounded-[2rem] border border-black/5 w-full sm:w-auto">
                    <button 
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-14 h-14 flex items-center justify-center text-gray-400 hover:text-primary transition-colors text-2xl font-black"
                    >—</button>
                    <div className="w-16 text-center font-black text-primary text-xl">{qty}</div>
                    <button 
                      onClick={() => setQty(qty + 1)}
                      className="w-14 h-14 flex items-center justify-center text-gray-400 hover:text-primary transition-colors text-2xl font-black"
                    >+</button>
                  </div>
                  
                  <button
                    disabled={product.stock_count <= 0}
                    onClick={() => addToCart(product, qty)}
                    className="flex-grow w-full bg-primary hover:bg-primary-hover text-white py-6 px-10 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex justify-center items-center transition-all hover:scale-[1.02] shadow-premium hover:shadow-[#1B4332]/30 active:scale-95 disabled:opacity-50"
                  >
                    <ShoppingCart className="w-5 h-5 mr-4" />
                    {product.stock_count <= 0 ? 'Out of Stock' : 'Add to Basket'}
                  </button>
               </div>

               {/* Sticky Mobile Add to Cart (App-Style Flush Footer) */}
               <div className="lg:hidden fixed bottom-16 left-0 right-0 z-50 px-6 py-5 bg-white border-t border-stone-100 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                  <div className="flex items-center gap-6 max-w-md mx-auto">
                     <div className="flex flex-col">
                        <p className="text-[9px] font-black text-primary/40 uppercase tracking-widest leading-none mb-1">Total Valuation</p>
                        <p className="text-xl font-black text-primary tracking-tighter leading-none">₹{(product.discountPrice || product.price) * qty}</p>
                     </div>
                     <button
                        disabled={product.stock_count <= 0}
                        onClick={() => addToCart(product, qty)}
                        className="flex-grow bg-primary text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-premium active:scale-95 flex items-center justify-center gap-3"
                     >
                        <ShoppingCart className="w-4 h-4" />
                        {product.stock_count <= 0 ? 'Stock Zero' : 'Secure Checkout'}
                     </button>
                  </div>
               </div>

               {/* Flipkart Style Tabs */}
               <div className="border-b border-stone-100 flex space-x-12">
                  {['details', 'reviews', 'qa'].map((tab) => (
                     <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? 'text-primary' : 'text-gray-300 hover:text-gray-500'}`}
                     >
                        {tab === 'details' ? 'Description' : tab === 'reviews' ? 'Ratings' : 'FAQ'}
                        {activeTab === tab && (
                           <motion.div layoutId="tabUnderline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
                        )}
                     </button>
                  ))}
               </div>

               <div className="min-h-[200px]">
                  <AnimatePresence mode="wait">
                     {activeTab === 'details' && (
                        <motion.div 
                           key="details"
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -10 }}
                           className="space-y-8"
                        >
                           <p className="text-gray-500 font-bold leading-relaxed whitespace-pre-wrap">{product.description}</p>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[
                                 { icon: FaLeaf, label: "Pure Organic Sourced" },
                                 { icon: ShieldCheck, label: "Government Certified" },
                                 { icon: CheckCircle, label: "Zero Chemical Additives" },
                                 { icon: Info, label: "Heritage Extraction Process" }
                              ].map((f, i) => (
                                 <div key={i} className="flex items-center space-x-4 p-5 bg-stone-50 rounded-2xl border border-black/5">
                                    <f.icon className="w-5 h-5 text-secondary" />
                                    <span className="text-[11px] font-black text-primary uppercase tracking-widest">{f.label}</span>
                                 </div>
                              ))}
                           </div>
                        </motion.div>
                     )}

                     {activeTab === 'reviews' && (
                        <motion.div 
                           key="reviews"
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -10 }}
                           className="space-y-6"
                        >
                           <div className="flex items-center justify-between mb-8 pb-8 border-b border-black/5">
                              <div>
                                 <h3 className="text-4xl font-black text-primary">5.0 / 5.0</h3>
                                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-2">Based on 142 verified buyers</p>
                              </div>
                              <button className="px-8 py-3 bg-stone-50 hover:bg-stone-100 border border-black/5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">Write Review</button>
                           </div>
                           
                           {MOCK_REVIEWS.map((review) => (
                              <div key={review.id} className="p-8 bg-stone-50 rounded-[2rem] border border-black/5">
                                 <div className="flex justify-between items-start mb-4">
                                    <div>
                                       <div className="flex items-center space-x-1 mb-2">
                                          {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />)}
                                       </div>
                                       <p className="text-sm font-black text-primary">{review.user}</p>
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{review.date}</span>
                                 </div>
                                 <p className="text-gray-500 font-bold text-sm leading-relaxed mb-4 italic">&ldquo;{review.comment}&rdquo;</p>
                                 <div className="flex items-center text-[10px] font-black text-green-600 uppercase tracking-[0.2em]">
                                    <CheckCircle className="w-3 h-3 mr-2" /> Verified Harvest Bundle
                                 </div>
                              </div>
                           ))}
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            </div>
          </div>
        </div>

        {/* Similar Items - Flipkart Style Horizontal Bar */}
        {relatedProducts.length > 0 && (
          <div className="mt-40">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div>
                <span className="text-secondary font-black text-[11px] uppercase tracking-[0.3em] mb-4 block">Smart Recommendations</span>
                <h2 className="text-5xl font-playfair font-black text-primary">Explore <span className="text-secondary italic">Similar</span> Harvests</h2>
              </div>
              
              <Link 
                href={`/products?category=${product.category}`} 
                className="group flex items-center p-4 pr-10 bg-primary text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-premium hover:shadow-[#1B4332]/30 active:scale-95 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-6 group-hover:bg-accent transition-colors">
                   <ArrowRight className="w-4 h-4" />
                </div>
                View full collection
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
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
          </div>
        )}
      </div>
    </div>
  );
}
