'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { handleCheckout } from '@/lib/checkout';
import { useAuth } from '@/context/AuthContext';
import { Trash2, Plus, Minus, ArrowRight, Loader2, MapPin, CreditCard, ChevronDown, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  
  // Checkout Steps: 1: Login/Summary, 2: Address, 3: Payment
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState('Online'); // 'Online' or 'COD'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [address, setAddress] = useState({
    name: userData?.fullName || '',
    phone: '',
    pincode: '',
    locality: '',
    fullAddress: '',
    city: '',
    state: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleRazorpayPayment = async () => {
    try {
      setLoading(true);
      // 1. Create order on server
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: getCartTotal() }),
      });
      const orderData = await orderRes.json();

      if (orderData.error) throw new Error(orderData.error);

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Shresta Organics",
        description: "Premium Organic Essentials",
        order_id: orderData.id,
        handler: async function (response: RazorpayResponse) {
          // 3. On Success: Complete Firestore Order
          const shippingString = `${address.fullAddress}, ${address.locality}, ${address.city}, ${address.state} - ${address.pincode}. Phone: ${address.phone}`;
          const res = await handleCheckout(user!.uid, cartItems, shippingString, 'Razorpay');
          if (res.success) {
            setSuccess(`Payment Successful! Order ID: ${res.orderId}`);
            clearCart();
          } else {
            setError('Payment captured but order failed to save. Please contact support.');
          }
          setLoading(false);
        },
        prefill: {
          name: address.name,
          email: user?.email || '',
          contact: address.phone
        },
        theme: { color: "#1B5E20" }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Payment initiation failed';
      setError(errorMessage);
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
    const res = await handleCheckout(user.uid, cartItems, shippingString, 'COD');
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-md text-center">Looks like you haven&apos;t added any premium organic products yet.</p>
        <Link href="/">
          <button className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-medium transition-transform hover:scale-105">
            Start Shopping
          </button>
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 scale-up">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-4xl font-playfair font-bold text-gray-800 mb-4">Ordered Successfully!</h2>
        <p className="text-lg text-gray-600 mb-8 font-medium">Your organic essentials are on their way.</p>
        <div className="bg-gray-50 p-6 rounded-2xl mb-8 max-w-md w-full border border-gray-100">
           <p className="text-sm text-gray-500 mb-2">Order ID</p>
           <p className="font-bold text-primary break-all">{success.split(': ')[1]}</p>
        </div>
        <Link href="/">
          <button className="bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-xl font-bold transition-all hover:shadow-lg">
            Keep Shopping
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50/30">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Main Flow (Steps) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* STEP 1: LOGIN/ITEMS */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className={`p-4 flex items-center ${currentStep === 1 ? 'bg-primary text-white' : 'bg-gray-50'}`}>
              <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold mr-4 ${currentStep === 1 ? 'bg-white text-primary' : 'bg-gray-300 text-white'}`}>1</span>
              <h3 className={`font-bold uppercase tracking-wider ${currentStep === 1 ? 'text-white' : 'text-gray-400'}`}>Order Summary</h3>
              {currentStep > 1 && <span className="ml-auto text-xs font-bold bg-green-500 text-white px-2 py-1 rounded">COMPLETED</span>}
            </div>
            
            {currentStep === 1 ? (
              <div className="p-4 space-y-4">
                {cartItems.map((item: CartItem) => (
                  <div key={item.id} className="flex items-start py-4 border-b border-gray-100 last:border-0">
                    <div className="w-20 h-24 relative rounded overflow-hidden flex-shrink-0 bg-gray-50">
                      <Image src={item.image_url || '/placeholder.svg'} alt={item.name} fill className="object-cover" unoptimized={!!item.image_url} />
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-bold text-gray-900">{item.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">{item.weight}</p>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center border rounded">
                           <button onClick={() => updateQuantity(item.id, item.qty - 1)} className="p-1 hover:bg-gray-100"><Minus className="w-4 h-4" /></button>
                           <span className="w-8 text-center text-sm font-bold">{item.qty}</span>
                           <button onClick={() => updateQuantity(item.id, item.qty + 1)} className="p-1 hover:bg-gray-100"><Plus className="w-4 h-4" /></button>
                        </div>
                        <span className="font-bold text-primary">₹{(item.discountPrice || item.price) * item.qty}</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end pt-4">
                   <button 
                     onClick={() => setCurrentStep(2)}
                     className="bg-[#fb641b] text-white px-10 py-3 rounded font-bold shadow-md hover:bg-[#e65c1a] transition-colors uppercase tracking-wider"
                    >
                      Proceed to Address
                    </button>
                </div>
              </div>
            ) : (
                <div className="p-4 text-sm text-gray-600 flex justify-between">
                   <span>{cartItems.length} Items in your cart</span>
                   <button onClick={() => setCurrentStep(1)} className="text-primary font-bold hover:underline">Edit</button>
                </div>
            )}
          </div>

          {/* STEP 2: DELIVERY ADDRESS */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <div className={`p-4 flex items-center ${currentStep === 2 ? 'bg-primary text-white' : 'bg-gray-50'}`}>
                <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold mr-4 ${currentStep === 2 ? 'bg-white text-primary' : 'bg-gray-300 text-white'}`}>2</span>
                <h3 className={`font-bold uppercase tracking-wider ${currentStep === 2 ? 'text-white' : 'text-gray-400'}`}>Delivery Address</h3>
                {currentStep > 2 && <span className="ml-auto text-xs font-bold bg-green-500 text-white px-2 py-1 rounded">SAVED</span>}
             </div>

             {currentStep === 2 ? (
                <div className="p-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Name</label>
                        <input name="name" value={address.name} onChange={handleInputChange} placeholder="Full Name" className="w-full p-2 border rounded focus:ring-1 focus:ring-primary outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                        <input name="phone" value={address.phone} onChange={handleInputChange} placeholder="10-digit mobile number" className="w-full p-2 border rounded focus:ring-1 focus:ring-primary outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Pincode</label>
                        <input name="pincode" value={address.pincode} onChange={handleInputChange} placeholder="6-digit pincode" className="w-full p-2 border rounded focus:ring-1 focus:ring-primary outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Locality</label>
                        <input name="locality" value={address.locality} onChange={handleInputChange} placeholder="Locality/Town" className="w-full p-2 border rounded focus:ring-1 focus:ring-primary outline-none" />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Address (Area and Street)</label>
                        <textarea name="fullAddress" value={address.fullAddress} onChange={handleInputChange} placeholder="House No, Apartment, Street" className="w-full p-2 border rounded focus:ring-1 focus:ring-primary outline-none min-h-[100px]" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">City/District/Town</label>
                        <input name="city" value={address.city} onChange={handleInputChange} placeholder="City" className="w-full p-2 border rounded focus:ring-1 focus:ring-primary outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">State</label>
                        <input name="state" value={address.state} onChange={handleInputChange} placeholder="State" className="w-full p-2 border rounded focus:ring-1 focus:ring-primary outline-none" />
                      </div>
                   </div>
                   <div className="mt-8 flex justify-end gap-4">
                      <button onClick={() => setCurrentStep(1)} className="px-6 py-2 text-primary font-bold hover:bg-gray-50 uppercase tracking-wider">Back</button>
                      <button 
                        disabled={!address.name || !address.phone || !address.pincode}
                        onClick={() => setCurrentStep(3)} 
                        className="bg-[#fb641b] text-white px-10 py-3 rounded font-bold shadow-md disabled:opacity-50 uppercase tracking-wider"
                      >
                        Save and Deliver Here
                      </button>
                   </div>
                </div>
             ) : currentStep > 2 ? (
                <div className="p-4 text-sm text-gray-600 flex justify-between">
                   <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-primary" />
                      <span className="font-bold mr-2">{address.name}</span>
                      <span className="truncate max-w-xs">{address.fullAddress}, {address.city}...</span>
                   </div>
                   <button onClick={() => setCurrentStep(2)} className="text-primary font-bold hover:underline">Change</button>
                </div>
             ) : null}
          </div>

          {/* STEP 3: PAYMENT OPTIONS */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <div className={`p-4 flex items-center ${currentStep === 3 ? 'bg-primary text-white' : 'bg-gray-50'}`}>
                <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold mr-4 ${currentStep === 3 ? 'bg-white text-primary' : 'bg-gray-300 text-white'}`}>3</span>
                <h3 className={`font-bold uppercase tracking-wider ${currentStep === 3 ? 'text-white' : 'text-gray-400'}`}>Payment Options</h3>
             </div>

             {currentStep === 3 && (
                <div className="p-0">
                   {/* Online Payment */}
                   <div 
                     onClick={() => setPaymentMode('Online')}
                     className={`p-6 border-b border-gray-100 cursor-pointer transition-colors ${paymentMode === 'Online' ? 'bg-green-50/50' : 'hover:bg-gray-50'}`}
                   >
                      <div className="flex items-start">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 mt-1 ${paymentMode === 'Online' ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                           {paymentMode === 'Online' && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div>
                           <h4 className="font-bold text-gray-900 flex items-center">
                             PhonePe / Google Pay / Credit Cards / Netbanking
                             <Image src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" width={20} height={20} className="ml-2" />
                           </h4>
                           <p className="text-xs text-gray-500 mt-1">Safe and Secure payments via Razorpay</p>
                           {paymentMode === 'Online' && (
                              <button 
                                onClick={onFinalOrder}
                                disabled={loading}
                                className="mt-6 bg-[#fb641b] text-white px-10 py-4 rounded font-black shadow-lg hover:bg-[#e65c1a] transition-all uppercase tracking-widest flex items-center group"
                              >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Pay ₹{getCartTotal()} <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" /></>}
                              </button>
                           )}
                        </div>
                      </div>
                   </div>

                   {/* Cash on Delivery */}
                   <div 
                     onClick={() => setPaymentMode('COD')}
                     className={`p-6 cursor-pointer transition-colors ${paymentMode === 'COD' ? 'bg-green-50/50' : 'hover:bg-gray-50'}`}
                   >
                      <div className="flex items-start">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 mt-1 ${paymentMode === 'COD' ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                           {paymentMode === 'COD' && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div className="flex-1">
                           <h4 className="font-bold text-gray-900">Cash on Delivery</h4>
                           <p className="text-xs text-gray-500 mt-1">Pay with cash at your doorstep</p>
                           {paymentMode === 'COD' && (
                              <div className="mt-6">
                                <button 
                                  onClick={onFinalOrder}
                                  disabled={loading}
                                  className="bg-[#fb641b] text-white px-10 py-4 rounded font-black shadow-lg hover:bg-[#e65c1a] transition-all uppercase tracking-widest flex items-center group"
                                >
                                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Confirm Order <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" /></>}
                                </button>
                              </div>
                           )}
                        </div>
                      </div>
                   </div>
                </div>
             )}
          </div>
          
          {error && <div className="bg-red-50 text-red-600 p-4 rounded text-sm font-bold border border-red-100">{error}</div>}

        </div>

        {/* Right: Sidebar Fixings (Flipkart Logic) */}
        <div className="lg:col-span-4">
           <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-28 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                 <h3 className="font-bold text-gray-400 uppercase tracking-wider text-sm">Price Details</h3>
              </div>
              <div className="p-4 space-y-4">
                 <div className="flex justify-between">
                    <span>Price ({cartItems.length} items)</span>
                    <span>₹{getCartTotal()}</span>
                 </div>
                 <div className="flex justify-between">
                    <span>Discount</span>
                    <span className="text-green-600">− ₹0</span>
                 </div>
                 <div className="flex justify-between border-b border-dashed border-gray-300 pb-4">
                    <span>Delivery Charges</span>
                    <span className="text-green-600">FREE</span>
                 </div>
                 <div className="flex justify-between text-lg font-bold pt-2">
                    <span>Total Amount</span>
                    <span>₹{getCartTotal()}</span>
                 </div>
              </div>
              <div className="p-4 bg-gray-50 text-green-600 font-bold text-sm border-t border-gray-200">
                 You will save ₹0 on this order
              </div>
           </div>
           
           <div className="mt-8 flex items-center text-gray-400 font-bold text-xs uppercase tracking-widest justify-center space-x-4">
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1" /> Secure Payment</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1" /> 100% Genuine</div>
           </div>
        </div>

      </div>
    </div>
  );
}
