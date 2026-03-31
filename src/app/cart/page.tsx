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
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-12 bg-[#F7F4EF]">
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm border border-stone-100">
           <ShoppingCart className="w-8 h-8 text-stone-300" />
        </div>
        <h2 className="text-3xl font-playfair font-bold text-[#1B4332] mb-3">Your basket is empty</h2>
        <p className="text-stone-500 mb-8 max-w-sm text-center text-sm">Looks like you haven&apos;t added any products yet.</p>
        <Link href="/products">
          <button className="bg-[#1B4332] text-white px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#1B4332]/90 active:scale-95 transition-all">
            Browse Products
          </button>
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center px-6 text-center bg-[#F7F4EF]">
        <motion.div 
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-sm"
        >
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </motion.div>
        <h2 className="text-4xl font-playfair font-bold text-[#1B4332] mb-4">Order Confirmed!</h2>
        <p className="text-stone-500 mb-8 text-sm max-w-md">Your organic essentials are being carefully packed for delivery.</p>
        
        <div className="bg-white p-6 rounded-2xl mb-10 max-w-md w-full border border-stone-100 shadow-sm">
           <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Order ID</p>
           <p className="font-bold text-[#1B4332] text-sm break-all">{success.split(': ')[1]}</p>
        </div>
        
        <Link href="/products">
          <button className="bg-[#1B4332] hover:bg-[#1B4332]/90 text-white px-10 py-3.5 rounded-full font-black text-xs uppercase tracking-widest transition-all active:scale-95">
            Continue Shopping
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F4EF] min-h-screen pb-32 pt-20">
      {/* Checkout Navbar Lookalike for trust */}
      <div className="bg-transparent py-4 mb-4">
         <div className="max-w-screen-lg mx-auto px-4 flex items-center justify-between">
            <h1 className="text-3xl font-playfair font-bold text-[#1B4332]">Checkout</h1>
            <div className="flex items-center space-x-2">
               <ShieldCheck className="w-4 h-4 text-[#1B4332]" />
               <span className="text-[9px] font-black uppercase tracking-widest text-[#1B4332]/60 hidden sm:inline-block">Secure Checkout</span>
            </div>
         </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Main Checkout Flow */}
          <div className="md:col-span-8 space-y-6">
            
            {/* STEP 1: SUMMARY */}
            <motion.div layout className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
               <div 
                 onClick={() => currentStep > 1 && setCurrentStep(1)}
                 className={`p-6 flex items-center cursor-pointer transition-colors ${currentStep === 1 ? 'bg-stone-50/50' : 'hover:bg-stone-50'}`}
               >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black mr-4 transition-colors ${currentStep === 1 ? 'bg-[#1B4332] text-white' : 'bg-stone-100 text-stone-400'}`}>1</span>
                  <h3 className="font-bold text-sm text-[#1B4332]">Order Summary</h3>
                  {currentStep > 1 && (
                     <div className="ml-auto text-[#1B4332]"><CheckCircle2 className="w-5 h-5" /></div>
                  )}
               </div>

               <AnimatePresence>
                  {currentStep === 1 && (
                     <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-6 space-y-4 overflow-hidden"
                     >
                        {cartItems.map((item: CartItem) => (
                           <div key={item.id} className="flex items-center py-4 border-b border-stone-100 last:border-0">
                              <div className="w-20 h-20 relative rounded-xl overflow-hidden flex-shrink-0 bg-[#F7F4EF] border border-stone-100 p-2">
                                 <Image src={item.image_url || '/placeholder.svg'} alt={item.name} fill className="object-contain" unoptimized={!!item.image_url} />
                              </div>
                              <div className="ml-4 flex-1">
                                 <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-[#1B4332] text-sm">{item.name}</h4>
                                 </div>
                                 <div className="flex justify-between items-center mt-2">
                                     <span className="font-bold text-[#1B4332]">₹{(item.discountPrice || item.price) * item.qty}</span>
                                     <div className="flex items-center">
                                       <div className="flex items-center bg-white rounded-full border border-stone-200 shadow-sm px-1 py-0.5">
                                          <button onClick={() => updateQuantity(item.id, item.qty - 1)} className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-[#1B4332] transition-colors font-bold">—</button>
                                          <span className="w-6 text-center text-xs font-bold text-[#1B4332]">{item.qty}</span>
                                          <button onClick={() => updateQuantity(item.id, item.qty + 1)} className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-[#1B4332] transition-colors font-bold">+</button>
                                       </div>
                                       <button onClick={() => removeFromCart(item.id)} className="ml-4 text-stone-400 hover:text-red-500 transition-colors">
                                          <Trash2 className="w-4 h-4" />
                                       </button>
                                     </div>
                                 </div>
                              </div>
                           </div>
                        ))}
                        <div className="flex justify-end pt-4">
                           <button onClick={() => setCurrentStep(2)} className="bg-[#1B4332] text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#1B4332]/90 transition-all active:scale-95 flex items-center">
                              Continue to Address <ArrowRight className="w-3 h-3 ml-2" />
                           </button>
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>
            </motion.div>

            {/* STEP 2: ADDRESS */}
            <motion.div layout className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
               <div 
                 onClick={() => currentStep > 2 && setCurrentStep(2)}
                 className={`p-6 flex items-center cursor-pointer transition-colors ${currentStep === 2 ? 'bg-stone-50/50' : 'hover:bg-stone-50'}`}
               >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black mr-4 transition-colors ${currentStep === 2 ? 'bg-[#1B4332] text-white' : 'bg-stone-100 text-stone-400'}`}>2</span>
                  <h3 className="font-bold text-sm text-[#1B4332]">Shipping Address</h3>
                  {currentStep > 2 && <div className="ml-auto text-[#1B4332]"><CheckCircle2 className="w-5 h-5" /></div>}
               </div>

               <AnimatePresence>
                  {currentStep === 2 && (
                     <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-6 space-y-6 overflow-hidden"
                     >
                         {userData?.lastAddress && (
                           <div className="mb-4 p-5 bg-[#F7F4EF]/50 border border-stone-200 rounded-2xl relative overflow-hidden group cursor-pointer" onClick={() => setUseSavedAddress(true)}>
                              <div className="flex items-start gap-4">
                                 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all ${useSavedAddress ? 'border-[#1B4332] bg-[#1B4332]' : 'border-stone-300'}`}>
                                    {useSavedAddress && <div className="w-2 h-2 rounded-full bg-white" />}
                                 </div>
                                 <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                       <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Saved Address</p>
                                       <button 
                                         onClick={(e) => { e.stopPropagation(); setUseSavedAddress(false); }} 
                                         className="text-[10px] font-black text-[#DC6827] hover:text-[#DC6827]/80 uppercase tracking-wider"
                                       >
                                          Enter New
                                       </button>
                                    </div>
                                    <p className="text-xs font-medium text-[#1B4332] leading-relaxed line-clamp-3">{userData.lastAddress}</p>
                                 </div>
                              </div>
                           </div>
                         )}

                         <AnimatePresence>
                           {(!useSavedAddress || !userData?.lastAddress) && (
                             <motion.div 
                               initial={{ opacity: 0, height: 0 }}
                               animate={{ opacity: 1, height: 'auto' }}
                               exit={{ opacity: 0, height: 0 }}
                               className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-hidden"
                             >
                               {[
                                  { label: 'Full Name', name: 'name', type: 'text' },
                                  { label: 'Phone', name: 'phone', type: 'text' },
                                  { label: 'Pincode', name: 'pincode', type: 'text' },
                                  { label: 'Locality', name: 'locality', type: 'text' },
                                  { label: 'City', name: 'city', type: 'text' },
                                  { label: 'State', name: 'state', type: 'text' }
                               ].map((field) => (
                                  <div key={field.name} className="space-y-1.5">
                                     <label className="text-[10px] font-black text-stone-500 uppercase tracking-wider pl-1">{field.label}</label>
                                     <input 
                                        name={field.name} 
                                        value={(address as any)[field.name]} 
                                        onChange={handleInputChange} 
                                        className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:border-[#1B4332] outline-none transition-all" 
                                     />
                                  </div>
                               ))}
                               <div className="sm:col-span-2 space-y-1.5">
                                  <label className="text-[10px] font-black text-stone-500 uppercase tracking-wider pl-1">Complete Address</label>
                                   <textarea 
                                     name="fullAddress" 
                                     value={address.fullAddress} 
                                     onChange={handleInputChange} 
                                     className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:border-[#1B4332] outline-none transition-all min-h-[80px]" 
                                   />
                               </div>
                             </motion.div>
                           )}
                         </AnimatePresence>
                        <div className="pt-4 flex justify-end">
                           <button 
                             disabled={!address.name || !address.phone || !address.pincode}
                             onClick={() => setCurrentStep(3)} 
                             className="bg-[#1B4332] text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest disabled:opacity-40 transition-all active:scale-95"
                           >
                             Save & Continue
                           </button>
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>
            </motion.div>


            {/* STEP 3: PAYMENT */}
            <motion.div layout className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
               <div className={`p-6 flex items-center ${currentStep === 3 ? 'bg-stone-50/50' : 'bg-white'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black mr-4 ${currentStep === 3 ? 'bg-[#1B4332] text-white' : 'bg-stone-100 text-stone-400'}`}>3</span>
                  <h3 className="font-bold text-sm text-[#1B4332]">Payment Method</h3>
               </div>

               {currentStep === 3 && (
                  <div className="p-0">
                     {[
                        { id: 'Online', title: 'Card / UPI / NetBanking', desc: 'Secure payment gateway', icon: CreditCard },
                        { id: 'COD', title: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: Truck }
                     ].map((mode) => (
                        <div 
                          key={mode.id}
                          onClick={() => setPaymentMode(mode.id)}
                          className={`p-6 border-b border-stone-100 cursor-pointer transition-all duration-300 ${paymentMode === mode.id ? 'bg-[#F7F4EF]/30' : 'hover:bg-stone-50'}`}
                        >
                           <div className="flex items-start">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 mt-0.5 transition-all ${paymentMode === mode.id ? 'border-[#1B4332] bg-[#1B4332]' : 'border-stone-300'}`}>
                                 {paymentMode === mode.id && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                              <div className="flex-1">
                                 <h4 className="font-bold text-sm text-[#1B4332] mb-1">{mode.title}</h4>
                                 <p className="text-xs text-stone-500 mb-4">{mode.desc}</p>
                                 {paymentMode === mode.id && (
                                    <motion.button 
                                      initial={{ opacity: 0, x: -5 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      onClick={onFinalOrder}
                                      disabled={loading}
                                      className="bg-[#1B4332] text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#1B4332]/90 flex items-center transition-all active:scale-95"
                                    >
                                      {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : <>Pay & Place Order <ArrowRight className="w-3 h-3 ml-2" /></>}
                                    </motion.button>
                                 )}
                              </div>
                              <mode.icon className={`w-6 h-6 ${paymentMode === mode.id ? 'text-[#1B4332]' : 'text-stone-300'}`} />
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </motion.div>
            
            {error && <div className="flex items-center p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-bold"><ShieldAlert className="w-4 h-4 mr-2" /> {error}</div>}
          </div>

          {/* Sidebar Summary */}
          <div className="md:col-span-4 md:sticky md:top-24">
             <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-stone-100 bg-stone-50/50">
                   <h3 className="font-bold text-sm text-[#1B4332]">Order Summary</h3>
                </div>
                <div className="p-6 space-y-4">
                   <div className="flex justify-between text-sm text-stone-600">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span className="font-bold text-[#1B4332]">₹{getCartTotal()}</span>
                   </div>
                   <div className="flex justify-between text-sm text-stone-600 pb-4 border-b border-stone-100">
                      <span>Shipping</span>
                      <span className="font-bold text-[#DC6827]">Free</span>
                   </div>
                   <div className="flex justify-between items-end pt-2">
                      <div>
                         <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Total</p>
                         <p className="text-2xl font-black text-[#1B4332]">₹{getCartTotal()}</p>
                      </div>
                   </div>
                </div>
                <div className="p-4 bg-[#F7F4EF]/50 text-stone-500 text-[10px] font-black uppercase tracking-widest text-center border-t border-stone-100">
                   100% Organic Certified
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
