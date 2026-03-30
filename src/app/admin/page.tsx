'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Users, 
  Package, 
  DollarSign, 
  ArrowUpRight, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  Eye,
  Activity,
  Layers,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useOrderStore } from '@/store/orderStore';
import { useProductStore } from '@/store/productStore';

export default function AdminDashboard() {
  const { orders, subscribeToOrders, cleanup: cleanupOrders, loading: ordersLoading } = useOrderStore();
  const { products, fetchProducts, loading: productsLoading } = useProductStore();

  useEffect(() => {
    fetchProducts();
    subscribeToOrders();
    return () => cleanupOrders();
  }, [fetchProducts, subscribeToOrders, cleanupOrders]);

  // Dynamic Metrics Calculation
  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
    const totalOrders = orders.length;
    const lowStockCount = products.filter((p: any) => (p.stock_count || 0) < 10).length;
    const valutation = totalRevenue.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
    
    return [
      { label: 'Total Revenue', value: valutation, trend: '+12.5%', isUp: true, icon: DollarSign, color: 'bg-emerald-500' },
      { label: 'Total Harvests', value: totalOrders.toString(), trend: '+8.2%', isUp: true, icon: ShoppingCart, color: 'bg-indigo-500' },
      { label: 'Stock Alerts', value: lowStockCount.toString(), trend: '+0.5%', isUp: true, icon: AlertTriangle, color: 'bg-amber-500' },
      { label: 'Product Range', value: products.length.toString(), trend: '+2', isUp: true, icon: Package, color: 'bg-primary' },
    ];
  }, [orders, products]);

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  if (ordersLoading && orders.length === 0) {
    return (
       <div className="flex items-center justify-center py-40">
          <div className="w-10 h-10 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
       </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Dashboard Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
         <div className="space-y-3">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/40 flex items-center">
               <Activity className="w-3.5 h-3.5 mr-2" /> Live Analytics Stream
            </h2>
            <h1 className="text-3xl md:text-5xl font-playfair font-black text-slate-900 leading-tight italic">
               The <span className="text-primary">Executive Overlook</span>
            </h1>
         </div>
         <div className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-soft self-start md:self-auto">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">System Online</span>
         </div>
      </div>

      {/* PRIMARY METRIC GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
         {metrics.map((stat, i) => (
            <motion.div
               key={stat.label}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-soft hover:shadow-premium group transition-all duration-500 cursor-pointer overflow-hidden relative"
            >
               <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-110 group-hover:bg-primary/5" />
               <div className="relative z-10">
                  <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-glow`}>
                     <stat.icon className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{stat.label}</p>
                  <h3 className="text-3xl font-black text-slate-900 mb-4">{stat.value}</h3>
                  <div className={`flex items-center text-[11px] font-black uppercase tracking-tighter ${stat.isUp ? 'text-emerald-500' : 'text-amber-500'}`}>
                     {stat.isUp ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                     {stat.trend} <span className="text-slate-300 ml-1">vs last month</span>
                  </div>
               </div>
            </motion.div>
         ))}
      </div>

      {/* PERFORMANCE & ANALYSIS CANVAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* Main Chart Section (Simulated Pro Chart) */}
         <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-soft p-6 md:p-10 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-12">
               <div>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight flex items-center mb-1 leading-none uppercase italic">
                     Revenue Velocity
                  </h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Biological Sales Trends 2024</p>
               </div>
               <div className="flex gap-2">
                  {['Week', 'Month', 'Year'].map((p) => (
                    <button key={p} className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${p === 'Month' ? 'bg-primary text-white shadow-soft shadow-primary/20' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                       {p}
                    </button>
                  ))}
               </div>
            </div>

            {/* Performance Bar Chart (Horizontal labels) */}
            <div className="h-80 w-full relative group/chart mt-8">
               <div className="absolute inset-0 flex items-end justify-between px-4 pb-8 space-x-1">
                  {[50, 70, 45, 90, 65, 85, 40, 75, 95, 60, 80, 55].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center group/bar">
                       <motion.div 
                         initial={{ height: 0 }}
                         animate={{ height: `${h}%` }}
                         transition={{ delay: i * 0.05, duration: 1 }}
                         className={`w-full max-w-[12px] rounded-full relative transition-all duration-500 ${i === 8 ? 'bg-primary shadow-glow' : 'bg-slate-100 hover:bg-primary/20'}`}
                       />
                    </div>
                  ))}
               </div>
               {/* Grid Lines */}
               <div className="absolute inset-0 flex flex-col justify-between pointer-events-none border-b border-slate-50 pb-16">
                  {[1, 2, 3, 4].map(l => <div key={l} className="w-full h-[1px] bg-slate-50" />)}
               </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-between">
               <div className="flex items-center space-x-6">
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Projected Earnings</span>
                     <span className="text-lg font-black text-slate-800 tracking-tighter italic">₹2.4L Yearly</span>
                  </div>
                  <div className="w-[1px] h-8 bg-slate-100" />
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Conversion Node</span>
                     <span className="text-lg font-black text-primary tracking-tighter italic">14.2% Growth</span>
                  </div>
               </div>
               <button className="flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-primary group">
                  Download Detailed Audit <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
         </div>

         {/* Inventory Low-Stock Hub */}
         <div className="lg:col-span-4 bg-white rounded-[2.5rem] border border-slate-100 shadow-soft p-6 md:p-10 flex flex-col">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h4 className="text-xl font-black text-slate-900 uppercase italic leading-none mb-1">Inventory Alert</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center">
                     <AlertTriangle className="w-3.5 h-3.5 mr-2" /> Critical Stock Levels
                  </p>
               </div>
               <button className="p-3 bg-amber-50 text-amber-500 rounded-xl hover:bg-amber-100 transition-colors">
                  <Package className="w-6 h-6" />
               </button>
            </div>

            <div className="flex-1 space-y-4 mb-10">
               {products.filter((p: any) => (p.stock_count || 0) < 10).slice(0, 5).map((item: any, i: number) => (
                  <div key={item.id} className="p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-amber-200 transition-all flex items-center justify-between group">
                     <div>
                        <h6 className="text-[12px] font-black text-slate-800 leading-tight mb-1">{item.name}</h6>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.category}</p>
                     </div>
                     <div className="text-right">
                        <span className="text-sm font-black text-amber-500 group-hover:scale-110 transition-transform block">{item.stock_count || 0}</span>
                        <span className="text-[8px] font-black uppercase text-slate-300">Left</span>
                     </div>
                  </div>
               ))}
               {products.filter((p: any) => (p.stock_count || 0) < 10).length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                     <CheckCircle2 className="w-10 h-10 text-emerald-500/20 mb-4" />
                     <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Inventory Healthy</p>
                  </div>
               )}
            </div>

            <button className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-soft hover:bg-slate-800 transition-all active:scale-95">
               Auto-Replenish Inventory
            </button>
         </div>
      </div>

      {/* FINAL ROW: LIVE ORDERS & ANOMALY DETECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
         
         {/* Live Order Stream */}
         <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-soft p-6 md:p-10 overflow-hidden relative group">
            <div className="flex items-center justify-between mb-12">
               <div>
                  <h4 className="text-xl font-black text-slate-900 uppercase italic">Live Harvest Operations</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Latest Transactions Synchronized</p>
               </div>
               <Link href="/admin/orders" className="text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:underline">View All Pipeline</Link>
            </div>

            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full min-w-[600px]">
                  <thead>
                     <tr className="text-left">
                        <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Harvest ID</th>
                        <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Biological Customer</th>
                        <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Milestone Status</th>
                        <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 text-right">Valuation</th>
                        <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 text-right">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {recentOrders.map((order: any) => (
                        <tr key={order.id} className="group/row">
                           <td className="py-5">
                              <span className="text-[12px] font-black text-slate-700 tracking-tight">#{order.orderId || order.id}</span>
                              <p className="text-[9px] font-bold text-slate-300">2024</p>
                           </td>
                           <td className="py-5 font-black text-slate-900 text-[13px]">{order.userId}</td>
                           <td className="py-5">
                              <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                 order.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
                                 order.orderStatus === 'placed' ? 'bg-indigo-50 text-indigo-600' :
                                 'bg-amber-50 text-amber-600'
                              }`}>
                                 <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                    order.orderStatus === 'delivered' ? 'bg-emerald-500' :
                                    order.orderStatus === 'placed' ? 'bg-indigo-500' :
                                    'bg-amber-500'
                                 }`} />
                                 {order.orderStatus}
                              </span>
                           </td>
                           <td className="py-5 text-right font-black text-slate-900">₹{order.total}</td>
                           <td className="py-5 text-right">
                              <Link href="/admin/orders">
                                 <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-primary/5 hover:text-primary transition-all">
                                    <Eye className="w-4 h-4" />
                                 </button>
                              </Link>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Technical Diagnostics Overlay */}
         <div className="bg-primary text-white rounded-[2.5rem] shadow-premium p-6 md:p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col h-full">
               <div className="flex items-center justify-between mb-10">
                  <h4 className="text-xl font-playfair font-black italic">Platform Pulse</h4>
                  <Layers className="w-8 h-8 opacity-20" />
               </div>
               
               <div className="space-y-8 flex-1">
                  <div className="space-y-4">
                     <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">System Capacity</span>
                        <span className="text-sm font-black">74% Optimal</span>
                     </div>
                     <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '74%' }} className="h-full bg-white shadow-glow" />
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Inventory Turnover</span>
                        <span className="text-sm font-black">9.2x High</span>
                     </div>
                     <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-white shadow-glow" />
                     </div>
                  </div>
               </div>

               <div className="pt-10 mt-auto border-t border-white/5">
                  <button className="w-full flex items-center justify-center p-5 bg-white text-primary rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-premium hover:shadow-xl transition-all">
                     Run Technical Diagnosis
                  </button>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
}
