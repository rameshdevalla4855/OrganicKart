'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useProductStore } from '@/store/productStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  MoreVertical, 
  ArrowUpDown,
  CheckCircle2,
  Layers,
  X,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import Image from 'next/image';
import { NextConfig } from 'next';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  stock_count: number;
  weight?: string;
  image_url: string;
  description?: string;
}

export default function AdminProducts() {
  const { products, loading, fetchProducts, addProduct, updateProduct, deleteProduct } = useProductStore() as any;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'Grains',
    price: 0,
    discountPrice: 0,
    stock_count: 0,
    weight: '1kg',
    image_url: '',
    description: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: (product as any).name || '',
        category: (product as any).category || 'Grains',
        price: (product as any).price || 0,
        discountPrice: (product as any).discountPrice || 0,
        stock_count: (product as any).stock_count || 0,
        weight: (product as any).weight || '1kg',
        image_url: (product as any).image_url || '',
        description: (product as any).description || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: 'Grains',
        price: 0,
        discountPrice: 0,
        stock_count: 0,
        weight: '1kg',
        image_url: '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    
    let res;
    if (editingProduct) {
      res = await updateProduct(editingProduct.id, formData);
    } else {
      res = await addProduct(formData);
    }

    if (res.success) {
      setIsModalOpen(false);
      fetchProducts(true); // Force refresh
    } else {
      alert(res.error);
    }
    setActionLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this harvest from the catalogue?')) {
      await deleteProduct(id);
    }
  };

  const nextConfig: NextConfig = {
    images: {
      unoptimized: true
    }
  };

  const filteredProducts = products.filter((p: any) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Grains', 'Oils', 'Sweeteners', 'Spices', 'Ghees', 'Essentials'];

  return (
    <div className="space-y-10">
      {/* Header & Metric Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
         <div className="space-y-3">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/40 flex items-center">
               <Layers className="w-3.5 h-3.5 mr-2" /> Storage Inventory Hub
            </h2>
            <h1 className="text-3xl lg:text-5xl font-playfair font-black text-slate-900 italic">
               Inventory <span className="text-primary">Controller</span>
            </h1>
         </div>
         
         <div className="flex flex-wrap items-center gap-4">
            <div className="px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-soft flex items-center space-x-6">
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Sku</span>
                  <span className="text-lg font-black text-slate-900">{products.length}</span>
               </div>
               <div className="w-[1px] h-8 bg-slate-100" />
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Low Stock</span>
                  <span className="text-lg font-black text-amber-500">
                    {products.filter((p: any) => (p.stock_count || 0) < 10).length} Items
                  </span>
               </div>
            </div>
            
            <button 
              onClick={() => handleOpenModal()}
              className="flex-grow lg:flex-none flex items-center justify-center px-10 py-5 bg-primary text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-premium hover:shadow-xl hover:bg-primary/90 transition-all active:scale-95"
            >
               <Plus className="w-4.5 h-4.5 mr-3" /> New Harvest
            </button>
         </div>
      </div>

      {/* FILTER & SEARCH COMMAND CENTER */}
      <div className="bg-white rounded-[2rem] lg:rounded-[2.5rem] border border-slate-100 shadow-soft p-6 lg:p-10">
         <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative group flex-1">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search by Harvest Name or ID..." 
                 className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-transparent focus:bg-white focus:border-primary/20 rounded-2xl text-[13px] font-black text-slate-700 transition-all outline-none"
               />
            </div>
            
            <div className="flex items-center gap-4">
               <div className="relative group">
                  <Filter className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-14 pr-12 py-5 bg-slate-50 border border-transparent hover:border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 appearance-none cursor-pointer outline-none transition-all"
                  >
                     {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
               </div>
            </div>
         </div>

         {/* MOBILE CARD VIEW */}
         <div className="lg:hidden mt-8 space-y-4">
            <AnimatePresence mode="popLayout">
               {filteredProducts.map((p: any) => (
                  <motion.div 
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm"
                  >
                     <div className="flex items-center space-x-4 mb-4">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-soft flex-shrink-0 bg-white">
                           <Image src={p.image_url || '/placeholder.svg'} alt={p.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <h4 className="text-[13px] font-black text-slate-900 truncate">{p.name}</h4>
                           <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">SKU-{p.id.slice(0, 8)}</span>
                        </div>
                        <span className="px-3 py-1.5 bg-white border border-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">{p.category}</span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white">
                        <div className="bg-white p-3 rounded-2xl">
                           <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Pricing</p>
                           <p className="text-sm font-black text-slate-900">₹{p.price}</p>
                        </div>
                        <div className="bg-white p-3 rounded-2xl">
                           <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Stock</p>
                           <p className={`text-sm font-black ${p.stock_count < 10 ? 'text-amber-500' : 'text-slate-900'}`}>{p.stock_count || 0}</p>
                        </div>
                     </div>
                     
                     <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest text-emerald-500">
                           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                           <span>Active</span>
                        </div>
                        <div className="flex items-center space-x-2">
                           <button onClick={() => handleOpenModal(p)} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 active:scale-95 transition-all">
                              <Edit3 className="w-4 h-4" />
                           </button>
                           <button onClick={() => handleDelete(p.id)} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 active:scale-95 transition-all">
                              <Trash2 className="w-4 h-4 text-red-400" />
                           </button>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </AnimatePresence>
         </div>

         {/* DESKTOP DATA TABLE */}
         <div className="hidden lg:block mt-12 overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[1000px]">
               <thead>
                  <tr className="border-b border-slate-50">
                     <th className="pb-8 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 pl-4">Biological Item</th>
                     <th className="pb-8 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Category</th>
                     <th className="pb-8 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 px-6 font-bold">Price Node</th>
                     <th className="pb-8 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Stock Capacity</th>
                     <th className="pb-8 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Operational Status</th>
                     <th className="pb-8 text-right text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 pr-4">Action Pipeline</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((p: any, i: number) => (
                       <motion.tr 
                         key={p.id}
                         layout
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, x: -20 }}
                         className="group border-none hover:bg-slate-50/50 transition-colors"
                       >
                          <td className="py-6 pl-4">
                             <div className="flex items-center space-x-6">
                                <div className="relative w-16 h-16 rounded-[1.25rem] overflow-hidden border border-slate-100 shadow-soft bg-white group-hover:scale-105 transition-transform duration-500">
                                   <Image src={p.image_url || '/placeholder.svg'} alt={p.name} fill className="object-cover" />
                                </div>
                                <div>
                                   <p className="text-[13px] font-black text-slate-900 group-hover:text-primary transition-colors leading-tight mb-0.5">{p.name}</p>
                                   <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">SKU-{p.id.slice(0, 8)}</p>
                                </div>
                             </div>
                          </td>
                          <td className="py-6">
                             <span className="px-5 py-2 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-full">{p.category}</span>
                          </td>
                          <td className="py-6 px-6">
                             <div className="flex flex-col">
                                <span className="text-sm font-black text-slate-900">₹{p.price}</span>
                                {p.discountPrice > 0 && <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">₹{p.discountPrice} Promo</span>}
                             </div>
                          </td>
                          <td className="py-6">
                             <div className="flex items-center">
                                <div className="h-1.5 w-16 bg-slate-100 rounded-full mr-4 overflow-hidden">
                                   <div className={`h-full ${(p.stock_count || 0) > 10 ? 'bg-emerald-500' : 'bg-amber-500'} rounded-full`} style={{ width: `${Math.min((p.stock_count || 0) * 2, 100)}%` }} />
                                </div>
                                <span className={`text-[12px] font-black ${ (p.stock_count || 0) < 10 ? 'text-amber-500' : 'text-slate-700'}`}>{p.stock_count || 0}</span>
                             </div>
                          </td>
                          <td className="py-6">
                             <div className="flex items-center space-x-2 text-emerald-500">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Active Site</span>
                             </div>
                          </td>
                          <td className="py-6 pr-4 text-right">
                             <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button 
                                  onClick={() => handleOpenModal(p)}
                                  className="p-3 bg-white text-slate-400 border border-slate-100 rounded-xl hover:text-primary hover:border-primary/20 transition-all shadow-soft"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDelete(p.id)}
                                  className="p-3 bg-white text-slate-400 border border-slate-100 rounded-xl hover:text-red-500 hover:border-red-100 transition-all shadow-soft"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                             </div>
                          </td>
                       </motion.tr>
                    ))}
                  </AnimatePresence>
               </tbody>
            </table>
         </div>
      </div>

      {/* ADD/EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-premium overflow-hidden border border-slate-100"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-10">
                   <div>
                      <h3 className="text-2xl font-playfair font-black text-slate-900 italic">
                        {editingProduct ? 'Modify Existing Harvest' : 'Register New Harvest'}
                      </h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Operational Data Entry</p>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 transition-all">
                      <X className="w-5 h-5" />
                   </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Harvest Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-slate-50 border border-transparent focus:bg-white focus:border-primary/20 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all"
                      />
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Category Node</label>
                       <select 
                         value={formData.category}
                         onChange={(e) => setFormData({...formData, category: e.target.value})}
                         className="w-full bg-slate-50 border border-transparent focus:bg-white focus:border-primary/20 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all appearance-none"
                       >
                          {categories.slice(1).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                       </select>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Standard Weight</label>
                       <input 
                         type="text" 
                         value={formData.weight}
                         onChange={(e) => setFormData({...formData, weight: e.target.value})}
                         placeholder="e.g. 1kg, 500ml"
                         className="w-full bg-slate-50 border border-transparent focus:bg-white focus:border-primary/20 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all"
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Base Price (₹)</label>
                       <input 
                         required
                         type="number" 
                         value={formData.price}
                         onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                         className="w-full bg-slate-50 border border-transparent focus:bg-white focus:border-primary/20 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all"
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Current Stock</label>
                       <input 
                         required
                         type="number" 
                         value={formData.stock_count}
                         onChange={(e) => setFormData({...formData, stock_count: Number(e.target.value)})}
                         className="w-full bg-slate-50 border border-transparent focus:bg-white focus:border-primary/20 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all"
                       />
                    </div>

                    <div className="col-span-2 space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Harvest Image URL</label>
                       <div className="relative">
                          <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <input 
                            required
                            type="text" 
                            value={formData.image_url}
                            onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                            placeholder="https://..."
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-transparent focus:bg-white focus:border-primary/20 rounded-2xl text-sm font-bold outline-none transition-all"
                          />
                       </div>
                    </div>
                  </div>

                  <button 
                    disabled={actionLoading}
                    type="submit"
                    className="w-full py-6 mt-6 bg-primary text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-premium hover:shadow-xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {actionLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-white" /> : (editingProduct ? 'Commit Modification' : 'Deploy To Storefront')}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
