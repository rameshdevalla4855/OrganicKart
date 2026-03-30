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
    <div className="min-h-screen bg-[#FDFCFB] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Profile Branding Header */}
        <div className="mb-16">
           <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-[1px] bg-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">Marketplace Identity</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-playfair font-black text-primary italic">
              User <span className="text-secondary">Dashboard</span>
           </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Dashboard Sidebar - Hidden on mobile if a tab is active (except the main profile menu if we consider it as such) */}
          <aside className={`lg:col-span-3 space-y-2 ${activeTab !== 'menu' ? 'hidden lg:block' : 'block'}`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedOrderId(null); }}
                className={`w-full flex items-center justify-between p-5 rounded-[1.5rem] transition-all duration-500 group ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white shadow-premium' 
                    : 'bg-white text-primary/60 border border-stone-100 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                   <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-primary/20 group-hover:text-primary'} transition-colors`} />
                   <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'rotate-90 lg:rotate-0' : ''}`} />
              </button>
            ))}
            
            <div className="pt-8 border-t border-stone-100 mt-8">
               <button 
                 onClick={handleLogout}
                 className="w-full flex items-center justify-between p-5 rounded-[1.5rem] bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all duration-500 group"
               >
                 <div className="flex items-center space-x-4">
                    <LogOut className="w-5 h-5 opacity-50 group-hover:opacity-100" />
                    <span className="text-xs font-black uppercase tracking-widest">Logout Account</span>
                 </div>
               </button>
            </div>
          </aside>

          {/* Main Dashboard Content - Mobile Back Button added */}
          <main className={`lg:col-span-9 ${activeTab === 'menu' ? 'hidden lg:block' : 'block'}`}>
            {/* Mobile Back Button */}
            <div className="lg:hidden mb-10">
               <button 
                 onClick={() => { setActiveTab('menu'); setSelectedOrderId(null); }}
                 className="flex items-center space-x-4 text-[10px] font-black text-primary/40 uppercase tracking-[0.3em] group"
               >
                  <div className="w-12 h-12 rounded-full border border-stone-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                     <ChevronLeft className="w-5 h-5" />
                  </div>
                  <span>Return to Menu</span>
               </button>
            </div>
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-soft p-10 md:p-14">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                        <div className="flex items-center space-x-8">
                           <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-black shadow-premium ring-8 ring-primary/5">
                              {userData?.fullName?.charAt(0) || 'U'}
                           </div>
                           <div>
                              <h3 className="text-3xl font-playfair font-black text-primary mb-1 italic">
                                {userData?.name || userData?.fullName || 'Organic Enthusiast'}
                              </h3>
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 flex items-center">
                                 <ShieldCheck className="w-3.5 h-3.5 mr-2 text-primary" /> Verified Harvest Member
                              </p>
                           </div>
                        </div>
                        <button className="px-8 py-3 bg-stone-50 text-primary border border-stone-100 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
                           Edit Detailed Profile
                        </button>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-stone-50">
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-primary/30 uppercase tracking-[0.3em]">Full Biological Name</p>
                           <p className="text-sm font-black text-primary">{userData?.name || userData?.fullName || 'Not Provided'}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-primary/30 uppercase tracking-[0.3em]">Electronic Mail Address</p>
                           <p className="text-sm font-black text-primary">{user?.email}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-primary/30 uppercase tracking-[0.3em]">Account Role</p>
                           <p className="text-sm font-black text-accent uppercase tracking-widest">{userData?.role}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-primary/30 uppercase tracking-[0.3em]">Member Since</p>
                           <p className="text-sm font-black text-primary">January 2024</p>
                        </div>
                     </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && !selectedOrderId && (
                <motion.div
                  key="orders-list"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid gap-6">
                    {MOCK_ORDERS.map((order) => (
                      <div key={order.id} className="bg-white rounded-[2rem] border border-stone-100 shadow-soft p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-10 group hover:border-primary/20 transition-all">
                        <div className="flex items-start space-x-6">
                           <div className="w-16 h-16 rounded-2xl bg-stone-50 flex items-center justify-center text-primary/20">
                              <Package className="w-8 h-8" />
                           </div>
                           <div>
                              <div className="flex items-center space-x-3 mb-2">
                                 <h4 className="text-lg font-black text-primary tracking-tight">{order.id}</h4>
                                 <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-primary/5 text-primary'}`}>
                                    {order.status}
                                 </span>
                              </div>
                              <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest mb-4">Ordered on {order.date}</p>
                              <div className="flex flex-wrap gap-2">
                                 {order.items.map(p => (
                                    <span key={p.name} className="text-[10px] font-black px-3 py-1 bg-stone-50 rounded-lg text-primary/40 border border-stone-100">{p.name}</span>
                                 ))}
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center justify-between md:flex-col md:items-end gap-4 min-w-[120px]">
                           <div className="text-right">
                              <p className="text-[10px] font-black text-primary/30 uppercase tracking-tight">Total Amount</p>
                              <p className="text-xl font-black text-primary tracking-tighter">₹{order.total}</p>
                           </div>
                           <button 
                             onClick={() => setSelectedOrderId(order.id)}
                             className="flex items-center text-[10px] font-black text-primary uppercase tracking-[0.2em] group border-b border-primary/20 pb-1"
                           >
                              View Milestone <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && selectedOrderId && selectedOrder && (
                 <motion.div
                    key="order-detail"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-8"
                 >
                    {/* Back Button */}
                    <button 
                      onClick={() => setSelectedOrderId(null)}
                      className="flex items-center space-x-3 text-[10px] font-black text-primary/40 uppercase tracking-[0.3em] hover:text-primary transition-colors group mb-6"
                    >
                       <div className="w-10 h-10 rounded-full border border-stone-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                          <ChevronLeft className="w-5 h-5" />
                       </div>
                       <span>Back to History</span>
                    </button>

                    {/* Milestone Detail Header */}
                    <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-soft p-10">
                       <div className="flex flex-col md:flex-row justify-between gap-10 mb-16 px-4">
                          <div className="space-y-3">
                             <h4 className="text-3xl font-playfair font-black text-primary italic">Tracking Harvest <span className="text-secondary">#{selectedOrder.id}</span></h4>
                             <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.4em]">Ordered {selectedOrder.date}</p>
                          </div>
                          <div className="bg-primary/5 p-6 rounded-2xl md:text-right">
                             <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest mb-1">Total Harvest Value</p>
                             <p className="text-2xl font-black text-primary">₹{selectedOrder.total}</p>
                          </div>
                       </div>

                       {/* Flipkart Style Progress Tracker */}
                       <div className="relative grid grid-cols-1 md:grid-cols-4 gap-12 px-6">
                          {/* Progress Line - Desktop */}
                          <div className="hidden md:block absolute top-[2.2rem] left-20 right-20 h-[2px] bg-stone-100 -z-0">
                             <div 
                               className="h-full bg-green-500 transition-all duration-1000" 
                               style={{ width: selectedOrder.status === 'Delivered' ? '100%' : '75%' }} 
                             />
                          </div>
                          
                          {selectedOrder.tracking.map((track, i) => (
                             <div key={track.step} className="relative z-10 flex flex-col items-center text-center space-y-4">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-700 border-4 border-white shadow-premium ${track.completed ? 'bg-green-500 text-white' : track.current ? 'bg-primary text-white animate-pulse' : 'bg-stone-50 text-stone-300'}`}>
                                   {track.completed ? <CheckCircle2 className="w-8 h-8" /> : track.current ? <Truck className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
                                </div>
                                <div>
                                   <p className={`text-[12px] font-black uppercase tracking-widest mb-1 ${track.completed || track.current ? 'text-primary' : 'text-primary/20'}`}>{track.step}</p>
                                   <p className="text-[9px] font-bold text-primary/30 uppercase">{track.date}</p>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>

                    {/* Context Cards: Shipping & Payment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="bg-white rounded-[2rem] border border-stone-100 p-8">
                          <div className="flex items-center space-x-3 mb-6">
                             <MapPin className="w-5 h-5 text-primary" />
                             <h5 className="text-[11px] font-black uppercase tracking-widest text-primary">Shipping Context</h5>
                          </div>
                          <p className="text-sm font-bold text-primary/60 leading-relaxed uppercase tracking-widest">
                             {selectedOrder.shippingAddress}
                          </p>
                       </div>
                       <div className="bg-white rounded-[2rem] border border-stone-100 p-8">
                          <div className="flex items-center space-x-3 mb-6">
                             <CreditCard className="w-5 h-5 text-primary" />
                             <h5 className="text-[11px] font-black uppercase tracking-widest text-primary">Payment Logistics</h5>
                          </div>
                          <p className="text-sm font-black text-primary uppercase tracking-widest">
                             {selectedOrder.paymentMethod}
                          </p>
                       </div>
                    </div>

                    {/* Itemized Harvest List */}
                    <div className="bg-primary/5 rounded-[2.5rem] p-8 md:p-12">
                       <h5 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/40 mb-10 text-center">Harvest Breakdown</h5>
                       <div className="space-y-6">
                          {selectedOrder.items.map((item, i) => (
                             <div key={i} className="flex items-center justify-between p-6 bg-white rounded-2xl border border-stone-100 shadow-soft">
                                <div className="flex items-center space-x-6">
                                   <div className="w-12 h-12 rounded-xl bg-stone-50 flex items-center justify-center text-primary/10">
                                      <Box className="w-6 h-6" />
                                   </div>
                                   <div>
                                      <h6 className="text-[13px] font-black text-primary uppercase tracking-tight">{item.name}</h6>
                                      <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest">Quantity: {item.qty}</p>
                                   </div>
                                </div>
                                <p className="text-lg font-black text-primary tracking-tighter">₹{item.price}</p>
                             </div>
                          ))}
                       </div>
                       
                       <div className="mt-12 pt-10 border-t border-primary/5 flex justify-between items-center text-primary">
                          <div className="flex items-center space-x-4">
                             <HelpCircle className="w-5 h-5 text-primary/20" />
                             <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Need help with this harvest?</span>
                          </div>
                          <button className="text-[10px] font-black uppercase tracking-[0.3em] text-accent hover:underline">Contact Farm Support</button>
                       </div>
                    </div>
                 </motion.div>
              )}

              {activeTab === 'address' && (
                 <motion.div
                    key="address"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                 >
                    <div className="bg-white rounded-[2.5rem] border-2 border-primary shadow-premium p-10 relative overflow-hidden">
                       <CheckCircle2 className="absolute top-6 right-6 w-6 h-6 text-primary" />
                       <div className="bg-primary/5 w-12 h-12 rounded-full flex items-center justify-center mb-8">
                          <MapPin className="w-6 h-6 text-primary" />
                       </div>
                       <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 mb-2">Primary Residence</h4>
                       <p className="text-lg font-black text-primary mb-6 leading-tight uppercase tracking-tight">Home Sweet Home</p>
                       <p className="text-sm font-bold text-gray-500 leading-relaxed max-w-[200px] mb-8">
                          Apartment 402, Green Meadows,<br/>Telangana, Hyderabad<br/>500032
                       </p>
                       <div className="flex gap-4">
                          <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Modify</button>
                       </div>
                    </div>

                    <button className="bg-[#FDFCFB] rounded-[2.5rem] border border-dashed border-stone-200 flex flex-col items-center justify-center p-10 hover:border-primary/50 transition-all group">
                       <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-soft group-hover:scale-110 transition-transform">
                          <Plus className="w-6 h-6 text-primary/20" />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 group-hover:text-primary transition-colors">Add New Address</span>
                    </button>
                 </motion.div>
              )}

              {activeTab === 'wishlist' && (
                 <motion.div 
                    key="wishlist"
                    className="py-12 px-6 bg-white rounded-[3rem] border border-stone-100 text-center"
                 >
                    <Heart className="w-16 h-16 text-primary/10 mx-auto mb-8" />
                    <h3 className="text-2xl font-playfair font-black text-primary mb-4">Saved Discoveries</h3>
                    <p className="text-gray-400 font-bold mb-10 max-w-xs mx-auto">Your favorite organic picks are waiting for you in your curated wishlist.</p>
                    <Link href="/wishlist" className="px-10 py-5 bg-primary text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-premium active:scale-95 transition-all">
                       Vew My Wishlist
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
