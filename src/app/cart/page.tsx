'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { handleCheckout } from '@/lib/checkout';
import { useAuth } from '@/context/AuthContext';
import { Trash2, Plus, Minus, ArrowRight, Loader2, MapPin, CreditCard, ChevronDown, CheckCircle2, ShieldCheck, Truck, ShieldAlert, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface CartItem {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  qty: number;
  weight: string;
  image_url: string;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCartStore();
  const { user, userData } = useAuth();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState('Online');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [address, setAddress] = useState({
    name: userData?.fullName || '',
    phone: '',
    pincode: '',
    locality: '',
    fullAddress: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    if (userData?.lastAddressObj) {
      setAddress(userData.lastAddressObj);
      setUseSavedAddress(true);
    }
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleRazorpayPayment = async () => {
    try {
      setLoading(true);
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: getCartTotal() }),
      });
      const orderData = await orderRes.json();

      if (orderData.error) throw new Error(orderData.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Shresta Organics",
        description: "Premium Organic Essentials",
        order_id: orderData.id,
        handler: async function (response: RazorpayResponse) {
          const shippingString = `${address.fullAddress}, ${address.locality}, ${address.city}, ${address.state} - ${address.pincode}. Phone: ${address.phone}`;
          const res = await handleCheckout(user!.uid, cartItems, shippingString, 'Razorpay', address as any);
          if (res.success) {
            setSuccess(`Payment Successful! Order ID: ${res.orderId}`);
            clearCart();
          } else {
            setError('Payment captured but order failed to save.');
          }
          setLoading(false);
        },
        prefill: {
          name: address.name,
          email: user?.email || '',
          contact: address.phone
        },
        theme: { color: "#1B4332" }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Payment initiation failed');
      setLoading(false);
    }
  };

   const onFinalOrder = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (paymentMode === 'Online') {
      await handleRazorpayPayment();
      return;
    }

    setLoading(true);
    setError('');
    const shippingString = `${address.fullAddress}, ${address.locality}, ${address.city}, ${address.state} - ${address.pincode}. Phone: ${address.phone}`;
    const res = await handleCheckout(user.uid, cartItems, shippingString, 'COD', address as any);
    if (res.success) {
      setSuccess(`Order successfully placed! Order ID: ${res.orderId}`);
      clearCart();
    } else {
      setError(res.error || 'Checkout failed');
    }
    setLoading(false);
  };

  if (cartItems.length === 0 && !success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-12 bg-white">
        <div className="w-24 h-24 rounded-full bg-stone-50 flex items-center justify-center mb-8 border border-black/5 shadow-premium">
           <ShoppingCart className="w-10 h-10 text-primary/20" />
        </div>
        <h2 className="text-4xl font-playfair font-black text-primary mb-4">Your basket is empty</h2>
        <p className="text-gray-400 mb-12 max-w-sm text-center font-bold">Looks like you haven&apos;t added any premium harvests yet.</p>
        <Link href="/products">
          <button className="bg-primary text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-premium hover:scale-105 active:scale-95 transition-all">
            Browse Collections
          </button>
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center px-6 text-center bg-white">
        <motion.div 
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 shadow-premium"
        >
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </motion.div>
        <h2 className="text-5xl font-playfair font-black text-primary mb-6 italic">Order Confirmed!</h2>
        <p className="text-xl text-gray-500 mb-10 font-bold max-w-md">Your organic essentials are being carefully packed for harvest-fresh delivery.</p>
        
        <div className="bg-stone-50 p-8 rounded-[2.5rem] mb-12 max-w-md w-full border border-black/5 shadow-soft">
           <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-3">Shipment Identifier</p>
           <p className="font-black text-primary text-sm break-all">{success.split(': ')[1]}</p>
        </div>
        
        <Link href="/products">
          <button className="bg-primary hover:bg-primary-hover text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] transition-all shadow-premium active:scale-95">
            Continue Shopping
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-stone-50/50 min-h-screen pb-32">
      {/* Checkout Navbar Lookalike for trust */}
      <div className="bg-white border-b border-stone-100 py-6 mb-12">
         <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <h1 className="text-2xl font-playfair font-black text-primary italic">Premium Checkout</h1>
            <div className="flex items-center space-x-4">
               <ShieldCheck className="w-5 h-5 text-primary" />
               <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Secure SSL Encryption</span>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Checkout Flow */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* STEP 1: SUMMARY */}
            <motion.div layout className="bg-white rounded-[2.5rem] shadow-premium border border-black/5 overflow-hidden">
               <div 
                 onClick={() => currentStep > 1 && setCurrentStep(1)}
                 className={`p-8 flex items-center cursor-pointer transition-colors ${currentStep === 1 ? 'bg-primary text-white' : 'hover:bg-stone-50'}`}
               >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black mr-6 transition-colors ${currentStep === 1 ? 'bg-white text-primary' : 'bg-stone-100 text-primary/40'}`}>01</span>
                  <h3 className="font-black uppercase tracking-[0.2em] text-[11px]">Harvest Summary</h3>
                  {currentStep > 1 && (
                     <div className="ml-auto bg-primary text-white p-1 rounded-full"><CheckCircle2 className="w-4 h-4" /></div>
                  )}
               </div>

               <AnimatePresence>
                  {currentStep === 1 && (
                     <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-8 space-y-6 overflow-hidden"
                     >
                        {cartItems.map((item: CartItem) => (
                           <div key={item.id} className="flex items-start py-6 border-b border-stone-50 last:border-0 group">
                              <div className="w-24 h-28 relative rounded-3xl overflow-hidden flex-shrink-0 bg-stone-50 border border-black/5 shadow-soft">
                                 <Image src={item.image_url || '/placeholder.svg'} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized={!!item.image_url} />
                              </div>
                              <div className="ml-8 flex-1">
                                 <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-black text-primary text-lg leading-tight uppercase tracking-tight">{item.name}</h4>
                                    <span className="font-black text-xl text-primary">₹{(item.discountPrice || item.price) * item.qty}</span>
                                 </div>
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">{item.weight}</p>
                                 
                                 <div className="flex items-center justify-between">
                                    <div className="flex items-center bg-stone-50 rounded-2xl p-1 border border-black/5">
                                       <button onClick={() => updateQuantity(item.id, item.qty - 1)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-primary transition-colors text-lg font-black">—</button>
                                       <span className="w-10 text-center text-sm font-black text-primary">{item.qty}</span>
                                       <button onClick={() => updateQuantity(item.id, item.qty + 1)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-primary transition-colors text-lg font-black">+</button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="text-[10px] font-black text-red-400 hover:text-red-500 uppercase tracking-[0.2em] transition-colors flex items-center group">
                                       Remove <Trash2 className="w-3.5 h-3.5 ml-2 group-hover:scale-110 transition-transform" />
                                    </button>
                                 </div>
                              </div>
                           </div>
                        ))}
                        <div className="flex justify-end pt-8">
                           <button onClick={() => setCurrentStep(2)} className="bg-accent text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-premium hover:shadow-[#BC6C25]/30 group transition-all active:scale-95">
                              Deliver To Address <ArrowRight className="w-4 h-4 ml-4 group-hover:translate-x-2 transition-transform duration-500" />
                           </button>
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>
            </motion.div>

            {/* STEP 2: ADDRESS */}
            <motion.div layout className="bg-white rounded-[2.5rem] shadow-premium border border-black/5 overflow-hidden">
               <div 
                 onClick={() => currentStep > 2 && setCurrentStep(2)}
                 className={`p-8 flex items-center cursor-pointer transition-colors ${currentStep === 2 ? 'bg-primary text-white' : 'hover:bg-stone-50'}`}
               >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black mr-6 transition-colors ${currentStep === 2 ? 'bg-white text-primary' : 'bg-stone-100 text-primary/40'}`}>02</span>
                  <h3 className="font-black uppercase tracking-[0.2em] text-[11px]">Dispatch Details</h3>
                  {currentStep > 2 && <div className="ml-auto bg-primary text-white p-1 rounded-full"><CheckCircle2 className="w-4 h-4" /></div>}
               </div>

               <AnimatePresence>
                  {currentStep === 2 && (
                     <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-8 space-y-8 overflow-hidden"
                     >
                         {userData?.lastAddress && (
                           <div className="mb-6 p-8 bg-stone-50 border border-primary/10 rounded-[2.5rem] relative overflow-hidden group">
                              <div className="flex items-start gap-6">
                                 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 transition-all ${useSavedAddress ? 'border-primary bg-primary' : 'border-stone-200'}`}>
                                    {useSavedAddress && <div className="w-2.5 h-2.5 rounded-full bg-white scale-up" />}
                                 </div>
                                 <div className="flex-1" onClick={() => setUseSavedAddress(true)}>
                                    <div className="flex items-center justify-between mb-4">
                                       <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em]">Selected Destination</p>
                                       <button 
                                         onClick={(e) => { e.stopPropagation(); setUseSavedAddress(false); }} 
                                         className="text-[10px] font-black text-secondary hover:text-secondary/70 uppercase tracking-widest underline decoration-2 underline-offset-4"
                                       >
                                          Change Address
                                       </button>
                                    </div>
                                    <p className="text-sm font-black text-primary leading-relaxed uppercase tracking-tight line-clamp-3">{userData.lastAddress}</p>
                                 </div>
                              </div>
                              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                 <MapPin className="w-12 h-12 text-primary" />
                              </div>
                           </div>
                         )}

                         <AnimatePresence>
                           {(!useSavedAddress || !userData?.lastAddress) && (
                             <motion.div 
                               initial={{ opacity: 0, height: 0 }}
                               animate={{ opacity: 1, height: 'auto' }}
                               exit={{ opacity: 0, height: 0 }}
                               className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden"
                             >
                               {[
                                  { label: 'Recipient Name', name: 'name', type: 'text' },
                                  { label: 'Phone Number', name: 'phone', type: 'text' },
                                  { label: 'Pincode', name: 'pincode', type: 'text' },
                                  { label: 'Locality / Area', name: 'locality', type: 'text' },
                                  { label: 'City', name: 'city', type: 'text' },
                                  { label: 'State', name: 'state', type: 'text' }
                               ].map((field) => (
                                  <div key={field.name} className="space-y-3">
                                     <label className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] ml-2">{field.label}</label>
                                     <input 
                                        name={field.name} 
                                        value={(address as any)[field.name]} 
                                        onChange={handleInputChange} 
                                        className="w-full bg-stone-50 border border-black/5 rounded-2xl px-6 py-4 text-sm font-bold text-primary focus:bg-white focus:border-primary/20 outline-none transition-all" 
                                     />
                                  </div>
                               ))}
                               <div className="md:col-span-2 space-y-3">
                                  <label className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] ml-2">Complete Shipping Address</label>
                                   <textarea 
                                     name="fullAddress" 
                                     value={address.fullAddress} 
                                     onChange={handleInputChange} 
                                     className="w-full bg-stone-50 border border-black/5 rounded-[2rem] px-6 py-5 text-sm font-bold text-primary focus:bg-white focus:border-primary/20 outline-none transition-all min-h-[120px]" 
                                   />
                               </div>
                             </motion.div>
                           )}
                         </AnimatePresence>
                        <div className="pt-8 flex justify-end">
                           <button 
                             disabled={!address.name || !address.phone || !address.pincode}
                             onClick={() => setCurrentStep(3)} 
                             className="bg-accent text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-premium disabled:opacity-40 transition-all active:scale-95"
                           >
                             Verify & Save Address
                           </button>
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>
            </motion.div>

            {/* STEP 3: PAYMENT */}
            <motion.div layout className="bg-white rounded-[2.5rem] shadow-premium border border-black/5 overflow-hidden">
               <div className={`p-8 flex items-center ${currentStep === 3 ? 'bg-primary text-white' : 'bg-gray-50/50'}`}>
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black mr-6 ${currentStep === 3 ? 'bg-white text-primary' : 'bg-stone-100 text-primary/40'}`}>03</span>
                  <h3 className="font-black uppercase tracking-[0.2em] text-[11px]">Settlement Panel</h3>
               </div>

               {currentStep === 3 && (
                  <div className="p-0">
                     {[
                        { id: 'Online', title: 'Digital Payment', desc: 'Secure encryption via Razorpay Hub', icon: ShieldCheck },
                        { id: 'COD', title: 'Cash on Delivery', desc: 'Settle at your doorstep upon arrival', icon: Truck }
                     ].map((mode) => (
                        <div 
                          key={mode.id}
                          onClick={() => setPaymentMode(mode.id)}
                          className={`p-10 border-b border-stone-50 cursor-pointer transition-all duration-500 ${paymentMode === mode.id ? 'bg-stone-50' : 'hover:bg-stone-50/20'}`}
                        >
                           <div className="flex items-start">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-8 mt-1 transition-all ${paymentMode === mode.id ? 'border-primary bg-primary' : 'border-stone-200'}`}>
                                 {paymentMode === mode.id && <div className="w-2.5 h-2.5 rounded-full bg-white scale-up" />}
                              </div>
                              <div className="flex-1">
                                 <h4 className="font-black text-lg text-primary uppercase tracking-tight mb-2">{mode.title}</h4>
                                 <p className="text-sm font-bold text-gray-400 mb-8">{mode.desc}</p>
                                 {paymentMode === mode.id && (
                                    <motion.button 
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      onClick={onFinalOrder}
                                      disabled={loading}
                                      className="bg-accent text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-premium hover:shadow-[#BC6C25]/30 group transition-all"
                                    >
                                      {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : <>Complete Order <ArrowRight className="w-4 h-4 ml-4 group-hover:translate-x-2 transition-transform duration-500" /></>}
                                    </motion.button>
                                 )}
                              </div>
                              <mode.icon className={`w-12 h-12 transition-colors ${paymentMode === mode.id ? 'text-primary/20' : 'text-stone-100'}`} />
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </motion.div>
            
            {error && <div className="flex items-center p-6 bg-red-50 text-red-600 rounded-[2rem] border border-red-100 text-sm font-bold"><ShieldAlert className="w-5 h-5 mr-3" /> {error}</div>}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
             <div className="bg-white rounded-[2.5rem] shadow-premium border border-black/5 overflow-hidden">
                <div className="p-8 border-b border-stone-50">
                   <h3 className="font-black text-[10px] text-primary/40 uppercase tracking-[0.3em]">Harvest Valuation</h3>
                </div>
                <div className="p-10 space-y-6">
                   <div className="flex justify-between text-sm font-bold text-gray-500">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span className="text-primary font-black uppercase">₹{getCartTotal()}</span>
                   </div>
                   <div className="flex justify-between text-sm font-bold text-gray-500">
                      <span>Promotional Access</span>
                      <span className="text-secondary font-black uppercase">− ₹0</span>
                   </div>
                   <div className="flex justify-between text-sm font-bold text-gray-500 pb-6 border-b border-dashed border-stone-200">
                      <span>Harvest Transport</span>
                      <span className="text-secondary font-black uppercase tracking-widest">Complimentary</span>
                   </div>
                   <div className="flex justify-between items-end pt-4">
                      <div>
                         <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1">Estimated Total</p>
                         <p className="text-3xl font-black text-primary">₹{getCartTotal()}</p>
                      </div>
                      <ShieldCheck className="w-8 h-8 text-primary shadow-soft p-1 rounded-full" />
                   </div>
                </div>
                <div className="p-8 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] text-center border-t border-black/5">
                   You are supporting local Indian farms
                </div>
             </div>
             
             <div className="mt-10 px-8 flex flex-wrap gap-4 justify-center">
                <div className="flex items-center text-[9px] font-black text-primary/30 uppercase tracking-widest"><ShieldCheck className="w-3 h-3 mr-2" /> 100% Genuine</div>
                <div className="flex items-center text-[9px] font-black text-primary/30 uppercase tracking-widest"><Truck className="w-3 h-3 mr-2" /> Express Dispatch</div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
