'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useOrderStore } from '@/store/orderStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  MoreVertical,
  AlertTriangle,
  MapPin,
  Calendar,
  Activity,
  ChevronDown,
  ChevronRight,
  Eye,
  Loader2
} from 'lucide-react';

export default function AdminOrders() {
  const { orders, loading, subscribeToOrders, updateOrderStatus, cleanup } = useOrderStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [statusLoading, setStatusLoading] = useState<string | null>(null);

  useEffect(() => {
    subscribeToOrders();
    return () => cleanup();
  }, [subscribeToOrders, cleanup]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setStatusLoading(orderId);
    await updateOrderStatus(orderId, newStatus);
    setStatusLoading(null);
  };

  const filteredOrders = orders.filter((o: any) => {
    const searchLow = searchQuery.toLowerCase();
    const matchesSearch = (o as any).shippingAddress?.toLowerCase().includes(searchLow) || (o as any).id?.toLowerCase().includes(searchLow) || (o as any).orderId?.toLowerCase().includes(searchLow);
    const matchesFilter = activeFilter === 'All' || (o as any).orderStatus === activeFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getPriority = (status: string) => {
    if (status === 'placed') return { label: 'Urgent', color: 'text-red-500 bg-red-50' };
    if (status === 'processing') return { label: 'Priority', color: 'text-amber-500 bg-amber-50' };
    return { label: 'Standard', color: 'text-slate-400 bg-slate-50' };
  };

  return (
    <div className="space-y-12">
      {/* Logistics Overview Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
         <div className="space-y-3">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/40 flex items-center">
               <Activity className="w-3.5 h-3.5 mr-2" /> Global Logistics Flow
            </h2>
            <h1 className="text-4xl md:text-5xl font-playfair font-black text-slate-900 italic">
               Order <span className="text-primary">Pipeline</span>
            </h1>
         </div>
         
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
            {[
               { label: 'Pending Harvests', count: orders.filter((o: any) => (o as any).orderStatus === 'placed').length, color: 'text-amber-500', bg: 'bg-amber-50' },
               { label: 'In Transit', count: orders.filter((o: any) => (o as any).orderStatus === 'shipped').length, color: 'text-primary', bg: 'bg-primary/5' },
               { label: 'Completed', count: orders.filter((o: any) => (o as any).orderStatus === 'delivered').length, color: 'text-emerald-500', bg: 'bg-emerald-50' },
               { label: 'Total Node', count: orders.length, color: 'text-slate-500', bg: 'bg-slate-50' },
            ].map(stat => (
               <div key={stat.label} className={`${stat.bg} ${stat.color} p-5 rounded-2xl flex flex-col min-w-[120px]`}>
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">{stat.label}</span>
                  <span className="text-2xl font-black">{stat.count}</span>
               </div>
            ))}
         </div>
      </div>

      {/* COMMAND CENTER: FILTER & SEARCH */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft p-10">
         <div className="flex flex-col lg:flex-row items-center gap-6 mb-12">
            <div className="relative group flex-grow w-full">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary" />
               <input 
                 type="text" 
                 placeholder="Search Harvest ID, Customer, or Address..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-transparent focus:bg-white focus:border-primary/20 rounded-2xl text-[13px] font-black text-slate-700 transition-all outline-none"
               />
            </div>
            
            <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto no-scrollbar">
               {['All', 'Placed', 'Processing', 'Shipped', 'Delivered'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`whitespace-nowrap px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === f ? 'bg-slate-900 text-white shadow-soft' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >
                     {f}
                  </button>
               ))}
            </div>
         </div>

         {/* PROFESSIONAL LOGISTICS GRID */}
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[1100px]">
               <thead>
                  <tr className="border-b border-slate-50">
                     <th className="pb-8 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 pl-4">Biological Order</th>
                     <th className="pb-8 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Milestone Status</th>
                     <th className="pb-8 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Logistics Node</th>
                     <th className="pb-8 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Transaction</th>
                     <th className="pb-8 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Operational Priority</th>
                     <th className="pb-8 text-right text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 pr-4">Action Pipeline</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  <AnimatePresence mode="popLayout">
                    {filteredOrders.map((order: any, i: number) => (
                       <motion.tr 
                         key={order.id}
                         layout
                         initial={{ opacity: 0, scale: 0.98 }}
                         animate={{ opacity: 1, scale: 1 }}
                         transition={{ delay: i * 0.05 }}
                         className="group border-none hover:bg-slate-50 transition-colors"
                       >
                          <td className="py-7 pl-4">
                             <div className="flex items-center space-x-6">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                   <ShoppingCart className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col">
                                   <p className="text-[13px] font-black text-slate-900 leading-tight">#{order.orderId || order.id.slice(0, 8)}</p>
                                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">UID: {order.userId?.slice(0, 6)}</p>
                                </div>
                             </div>
                          </td>
                          <td className="py-7">
                             <div className="flex items-center space-x-3">
                                <span className={`flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                  order.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
                                  order.orderStatus === 'shipped' ? 'bg-indigo-50 text-indigo-600' :
                                  'bg-amber-50 text-amber-600'
                                }`}>
                                   <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                      order.orderStatus === 'delivered' ? 'bg-emerald-500' :
                                      order.orderStatus === 'shipped' ? 'bg-indigo-500' :
                                      'bg-amber-500'
                                   }`} />
                                   {order.orderStatus}
                                </span>
                             </div>
                          </td>
                          <td className="py-7">
                             <div className="flex items-center space-x-3">
                                <MapPin className="w-4 h-4 text-slate-300" />
                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-tighter max-w-[150px] truncate">{order.shippingAddress || 'N/A'}</span>
                             </div>
                          </td>
                          <td className="py-7">
                             <div className="flex flex-col">
                                <p className="text-sm font-black text-slate-900 tracking-tighter">₹{order.total || 0}</p>
                                <p className="text-[9px] font-black text-slate-300 uppercase italic">{order.items?.length || 0} Product Units</p>
                             </div>
                          </td>
                          <td className="py-7">
                             <div className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getPriority(order.orderStatus).color}`}>
                                {getPriority(order.orderStatus).label}
                             </div>
                          </td>
                          <td className="py-7 pr-4 text-right">
                             <div className="flex items-center justify-end space-x-2">
                                <div className="relative group/menu">
                                   <button className="flex items-center px-6 py-3 bg-white text-primary border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-soft hover:shadow-premium transition-all">
                                      {statusLoading === order.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <>Update Node <ChevronDown className="ml-2 w-3.5 h-3.5" /></>}
                                   </button>
                                   
                                   {/* Status Dropdown */}
                                   <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-premium opacity-0 group-hover/menu:opacity-100 pointer-events-none group-hover/menu:pointer-events-auto transition-all z-20 py-2">
                                      {['Placed', 'Processing', 'Shipped', 'Delivered'].map(status => (
                                         <button 
                                           key={status}
                                           onClick={() => handleUpdateStatus(order.id, status.toLowerCase())}
                                           className="w-full text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors"
                                         >
                                            Move To {status}
                                         </button>
                                      ))}
                                   </div>
                                </div>
                                <button className="p-3 bg-slate-50 text-slate-300 rounded-xl hover:text-primary transition-all shadow-soft">
                                   <MoreVertical className="w-4 h-4" />
                                </button>
                             </div>
                          </td>
                       </motion.tr>
                    ))}
                    {orders.length === 0 && !loading && (
                       <tr>
                          <td colSpan={6} className="py-20 text-center">
                             <div className="flex flex-col items-center">
                                <Clock className="w-12 h-12 text-slate-100 mb-4" />
                                <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Pipeline Empty: Awaiting Harvests</p>
                             </div>
                          </td>
                       </tr>
                    )}
                  </AnimatePresence>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
