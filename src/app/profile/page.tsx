'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  ChevronRight, 
  ChevronLeft,
  LogOut, 
  ShieldCheck, 
  CreditCard,
  Bell,
  CheckCircle2,
  Clock,
  ArrowRight,
  Truck,
  Box,
  ShoppingCart,
  HelpCircle
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebaseInit';
import Link from 'next/link';

// Detailed Mock Data for Order History & Tracking
const MOCK_ORDERS = [
  {
    id: 'SHO-74291',
    date: '24 Mar 2024',
    status: 'Delivered',
    total: 1240,
    shippingAddress: 'Apartment 402, Green Meadows, Hyderabad, TS - 500032',
    paymentMethod: 'Credit Card (via Stripe)',
    items: [
      { name: 'Cold Pressed Groundnut Oil', qty: 1, price: 950 },
      { name: 'Pink Rock Salt', qty: 1, price: 290 }
    ],
    tracking: [
      { step: 'Order Placed', date: '24 Mar 2024, 10:32 AM', completed: true },
      { step: 'Packed & Ready', date: '24 Mar 2024, 02:15 PM', completed: true },
      { step: 'In Transit', date: '25 Mar 2024, 09:00 AM', completed: true },
      { step: 'Delivered', date: '26 Mar 2024, 04:45 PM', completed: true }
    ]
  },
  {
    id: 'SHO-74285',
    date: '28 Mar 2024',
    status: 'In Transit',
    total: 850,
    shippingAddress: 'Apartment 402, Green Meadows, Hyderabad, TS - 500032',
    paymentMethod: 'UPI (PhonePe)',
    items: [
      { name: 'A2 Cow Ghee (500ml)', qty: 1, price: 850 }
    ],
    tracking: [
      { step: 'Order Placed', date: '28 Mar 2024, 11:20 AM', completed: true },
      { step: 'Packed & Ready', date: '28 Mar 2024, 05:00 PM', completed: true },
      { step: 'In Transit', date: '29 Mar 2024, 08:30 AM', current: true },
      { step: 'Delivered', date: 'Expected tomorrow', completed: false }
    ]
  }
];

function ProfileContent() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'menu');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/profile');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading) return (
     <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
     </div>
  );

  const tabs = [
    { id: 'profile', label: 'Personal Details', icon: User },
    { id: 'orders', label: 'Order History', icon: Package },
    { id: 'address', label: 'Shipping Addresses', icon: MapPin },
    { id: 'wishlist', label: 'My Wishlist', icon: Heart },
  ];

  const selectedOrder = MOCK_ORDERS.find(o => o.id === selectedOrderId);

  return (
    <div className="min-h-screen bg-[#F7F4EF] pt-28 pb-24">
      <div className="max-w-screen-lg mx-auto px-4">
        
        {/* Profile Branding Header */}
        <div className="mb-12">
           <h1 className="text-4xl md:text-5xl font-playfair font-bold text-[#1B4332]">
              My Account
           </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Dashboard Sidebar - Hidden on mobile if a tab is active */}
          <aside className={`lg:col-span-3 space-y-2 ${activeTab !== 'menu' ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white rounded-2xl border border-stone-100 p-4 shadow-sm">
               {tabs.map((tab) => (
                 <button
                   key={tab.id}
                   onClick={() => { setActiveTab(tab.id); setSelectedOrderId(null); }}
                   className={`w-full flex items-center p-3.5 rounded-xl transition-all duration-300 group mb-1 last:mb-0 ${
                     activeTab === tab.id 
                       ? 'bg-[#1B4332] text-white shadow-sm' 
                       : 'bg-transparent text-stone-500 hover:bg-[#F7F4EF] hover:text-[#1B4332]'
                   }`}
                 >
                   <div className="flex items-center space-x-3">
                      <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-stone-400 group-hover:text-[#1B4332]'} transition-colors`} />
                      <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
                   </div>
                 </button>
               ))}
               
               <div className="pt-4 border-t border-stone-100 mt-4">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center p-3.5 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-3">
                       <LogOut className="w-4 h-4" />
                       <span className="text-[11px] font-black uppercase tracking-widest">Sign Out</span>
                    </div>
                  </button>
               </div>
            </div>
          </aside>

          {/* Main Dashboard Content - Mobile Back Button added */}
          <main className={`lg:col-span-9 ${activeTab === 'menu' ? 'hidden lg:block' : 'block'}`}>
            {/* Mobile Back Button */}
            <div className="lg:hidden mb-6">
               <button 
                 onClick={() => { setActiveTab('menu'); setSelectedOrderId(null); }}
                 className="flex items-center text-[10px] font-black text-stone-500 hover:text-[#1B4332] uppercase tracking-widest transition-colors"
               >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Return to Menu
               </button>
            </div>
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-8">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div className="flex items-center space-x-6">
                           <div className="w-20 h-20 rounded-full bg-[#1B4332] flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                              {userData?.fullName?.charAt(0) || 'U'}
                           </div>
                           <div>
                              <h3 className="text-2xl font-playfair font-bold text-[#1B4332] mb-1">
                                {userData?.name || userData?.fullName || 'Organic Enthusiast'}
                              </h3>
                              <p className="text-[10px] font-black uppercase tracking-widest text-[#DC6827]">
                                 Verified Member
                              </p>
                           </div>
                        </div>
                        <button className="px-6 py-2.5 border border-stone-200 text-[#1B4332] rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#F7F4EF] transition-all self-start md:self-center">
                           Edit Profile
                        </button>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-stone-100">
                        <div className="bg-[#F7F4EF] p-5 rounded-2xl">
                           <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Full Name</p>
                           <p className="text-sm font-bold text-[#1B4332]">{userData?.name || userData?.fullName || 'Not Provided'}</p>
                        </div>
                        <div className="bg-[#F7F4EF] p-5 rounded-2xl">
                           <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Email Address</p>
                           <p className="text-sm font-bold text-[#1B4332]">{user?.email}</p>
                        </div>
                        <div className="bg-[#F7F4EF] p-5 rounded-2xl">
                           <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Account Role</p>
                           <p className="text-sm font-bold text-[#DC6827] uppercase tracking-widest">{userData?.role}</p>
                        </div>
                        <div className="bg-[#F7F4EF] p-5 rounded-2xl">
                           <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Member Since</p>
                           <p className="text-sm font-bold text-[#1B4332]">January 2024</p>
                        </div>
                     </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && !selectedOrderId && (
                <motion.div
                  key="orders-list"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {MOCK_ORDERS.map((order) => (
                    <div key={order.id} className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-[#1B4332]/20">
                      <div className="flex items-start space-x-6">
                         <div className="w-14 h-14 rounded-full bg-[#F7F4EF] flex items-center justify-center text-[#1B4332]">
                            <Package className="w-6 h-6" />
                         </div>
                         <div>
                            <div className="flex items-center space-x-3 mb-1">
                               <h4 className="text-lg font-bold text-[#1B4332]">{order.id}</h4>
                               <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-[#EAE4D9]/50 text-[#1B4332]'}`}>
                                  {order.status}
                               </span>
                            </div>
                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">Ordered on {order.date}</p>
                            <div className="flex flex-wrap gap-2">
                               {order.items.map(p => (
                                  <span key={p.name} className="text-[10px] font-black px-3 py-1.5 bg-[#F7F4EF] rounded-lg text-stone-500">{p.name}</span>
                               ))}
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center justify-between md:flex-col md:items-end gap-4 border-t md:border-t-0 border-stone-100 pt-4 md:pt-0 min-w-[120px]">
                         <div className="text-right">
                            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-0.5">Total</p>
                            <p className="text-xl font-bold text-[#1B4332]">₹{order.total}</p>
                         </div>
                         <button 
                           onClick={() => setSelectedOrderId(order.id)}
                           className="flex items-center text-[10px] font-black text-[#1B4332] uppercase tracking-widest hover:text-[#DC6827] transition-colors"
                         >
                            View Details <ArrowRight className="ml-2 w-3 h-3" />
                         </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'orders' && selectedOrderId && selectedOrder && (
                 <motion.div
                    key="order-detail"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                 >
                    {/* Back Button */}
                    <button 
                      onClick={() => setSelectedOrderId(null)}
                      className="flex items-center text-[10px] font-black text-stone-500 hover:text-[#1B4332] uppercase tracking-widest transition-colors mb-4"
                    >
                       <ChevronLeft className="w-4 h-4 mr-1" /> Back to Orders
                    </button>

                    {/* Milestone Detail Header */}
                    <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-8">
                       <div className="flex flex-col md:flex-row justify-between gap-6 mb-12">
                          <div className="space-y-2">
                             <h4 className="text-2xl font-playfair font-bold text-[#1B4332]">Order <span className="text-[#DC6827]">#{selectedOrder.id}</span></h4>
                             <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Placed on {selectedOrder.date}</p>
                          </div>
                          <div className="bg-[#F7F4EF] p-4 rounded-xl md:text-right">
                             <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">Total</p>
                             <p className="text-xl font-bold text-[#1B4332]">₹{selectedOrder.total}</p>
                          </div>
                       </div>

                       {/* Progress Tracker */}
                       <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
                          {/* Progress Line - Desktop */}
                          <div className="hidden md:block absolute top-6 left-16 right-16 h-[2px] bg-stone-100 -z-0">
                             <div 
                               className="h-full bg-[#1B4332] transition-all duration-1000" 
                               style={{ width: selectedOrder.status === 'Delivered' ? '100%' : '75%' }} 
                             />
                          </div>
                          
                          {selectedOrder.tracking.map((track, i) => (
                             <div key={track.step} className="relative z-10 flex flex-col items-center text-center space-y-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all bg-white border-4 border-white shadow-sm ${track.completed ? 'text-[#1B4332] bg-[#F7F4EF]' : track.current ? 'text-white bg-[#1B4332]' : 'text-stone-300 bg-stone-50'}`}>
                                   {track.completed ? <CheckCircle2 className="w-5 h-5" /> : track.current ? <Truck className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                </div>
                                <div>
                                   <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${track.completed || track.current ? 'text-[#1B4332]' : 'text-stone-400'}`}>{track.step}</p>
                                   <p className="text-[9px] font-bold text-stone-400 uppercase">{track.date}</p>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="bg-white rounded-3xl border border-stone-100 p-6 shadow-sm">
                          <div className="flex items-center space-x-2 mb-4">
                             <MapPin className="w-4 h-4 text-[#1B4332]" />
                             <h5 className="text-[10px] font-black uppercase tracking-widest text-[#1B4332]">Shipping Address</h5>
                          </div>
                          <p className="text-sm font-bold text-stone-500 leading-relaxed uppercase tracking-wider">
                             {selectedOrder.shippingAddress}
                          </p>
                       </div>
                       <div className="bg-white rounded-3xl border border-stone-100 p-6 shadow-sm">
                          <div className="flex items-center space-x-2 mb-4">
                             <CreditCard className="w-4 h-4 text-[#1B4332]" />
                             <h5 className="text-[10px] font-black uppercase tracking-widest text-[#1B4332]">Payment Method</h5>
                          </div>
                          <p className="text-sm font-bold text-stone-500 uppercase tracking-wider">
                             {selectedOrder.paymentMethod}
                          </p>
                       </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-8">
                       <h5 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-6">Order Items</h5>
                       <div className="space-y-4">
                          {selectedOrder.items.map((item, i) => (
                             <div key={i} className="flex items-center justify-between p-4 bg-[#F7F4EF] rounded-xl border border-stone-100">
                                <div className="flex items-center space-x-4">
                                   <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-stone-400">
                                      <Box className="w-5 h-5" />
                                   </div>
                                   <div>
                                      <h6 className="text-xs font-bold text-[#1B4332]">{item.name}</h6>
                                      <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest mt-1">Qty: {item.qty}</p>
                                   </div>
                                </div>
                                <p className="text-sm font-bold text-[#1B4332]">₹{item.price}</p>
                             </div>
                          ))}
                       </div>
                    </div>
                 </motion.div>
              )}

              {activeTab === 'address' && (
                 <motion.div
                    key="address"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                 >
                    <div className="bg-white rounded-3xl border-2 border-[#1B4332] shadow-sm p-8 relative overflow-hidden">
                       <CheckCircle2 className="absolute top-5 right-5 w-5 h-5 text-[#1B4332]" />
                       <h4 className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-2">Primary Residence</h4>
                       <p className="text-lg font-bold text-[#1B4332] mb-4">Home</p>
                       <p className="text-sm font-medium text-stone-500 leading-relaxed max-w-[200px] mb-6">
                          Apartment 402, Green Meadows,<br/>Telangana, Hyderabad<br/>500032
                       </p>
                       <button className="text-[10px] font-black uppercase tracking-widest text-[#1B4332] hover:underline">Edit</button>
                    </div>

                    <button className="bg-[#F7F4EF] rounded-3xl border border-dashed border-stone-300 flex flex-col items-center justify-center p-8 hover:border-[#1B4332]/50 transition-all group">
                       <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                          <Plus className="w-5 h-5 text-stone-400" />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-stone-500 group-hover:text-[#1B4332] transition-colors">Add New Address</span>
                    </button>
                 </motion.div>
              )}

              {activeTab === 'wishlist' && (
                 <motion.div 
                    key="wishlist"
                    className="py-16 px-6 bg-white rounded-3xl border border-stone-100 text-center shadow-sm"
                 >
                    <div className="w-16 h-16 rounded-full bg-[#F7F4EF] flex items-center justify-center mx-auto mb-6">
                       <Heart className="w-6 h-6 text-stone-300" />
                    </div>
                    <h3 className="text-2xl font-playfair font-bold text-[#1B4332] mb-3">Saved Discoveries</h3>
                    <p className="text-stone-500 mb-8 max-w-xs mx-auto text-sm">Your favorite organic picks are waiting for you in your curated wishlist.</p>
                    <Link href="/wishlist" className="inline-block px-8 py-3 bg-[#1B4332] text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#1B4332]/90 active:scale-95 transition-all">
                       View My Wishlist
                    </Link>
                 </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

// Global Plus component for accessibility
const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ProfileContent />
    </Suspense>
  );
}
