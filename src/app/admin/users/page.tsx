'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/firebaseInit';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Calendar, 
  ChevronRight, 
  UserCheck, 
  Shield,
  Activity,
  MoreVertical,
  ArrowRight
} from 'lucide-react';
import { useOrderStore } from '@/store/orderStore';

interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  createdAt?: any;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { orders, subscribeToOrders, cleanup } = useOrderStore();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    subscribeToOrders();
    return () => cleanup();
  }, [subscribeToOrders, cleanup]);

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCustomerOrdersCount = (userId: string) => {
    return orders.filter((o: any) => o.userId === userId).length;
  };

  return (
    <div className="space-y-12">
      {/* Header & Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
         <div className="space-y-3">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/40 flex items-center">
               <Activity className="w-3.5 h-3.5 mr-2" /> Community Growth Stream
            </h2>
            <h1 className="text-4xl md:text-5xl font-playfair font-black text-slate-900 italic">
               Harvester <span className="text-primary">Registry</span>
            </h1>
         </div>
         
         <div className="flex items-center space-x-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-soft">
            <div className="flex flex-col border-r border-slate-100 pr-8">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Members</span>
               <span className="text-2xl font-black text-slate-900">{users.length}</span>
            </div>
            <div className="flex flex-col pl-4">
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated Roles</span>
               <span className="text-2xl font-black text-primary flex items-center">
                 <Shield className="w-5 h-5 mr-2" /> Admin 01
               </span>
            </div>
         </div>
      </div>

      {/* SEARCH COMMAND CENTER */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft p-10">
         <div className="flex flex-col lg:flex-row items-center gap-6 mb-12">
            <div className="relative group flex-grow w-full">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary" />
               <input 
                 type="text" 
                 placeholder="Search by Harvester Name or Electronic Mail..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-transparent focus:bg-white focus:border-primary/20 rounded-2xl text-[13px] font-black text-slate-700 transition-all outline-none"
               />
            </div>
            <button className="p-5 bg-slate-50 text-slate-400 rounded-2xl hover:text-primary hover:bg-white border border-transparent hover:border-primary/20 transition-all">
               <Filter className="w-5 h-5" />
            </button>
         </div>

         {/* PROFESSIONAL CUSTOMER GRID */}
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[1000px]">
               <thead>
                  <tr className="border-b border-slate-50">
                     <th className="pb-8 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 pl-4">Biological Identity</th>
                     <th className="pb-8 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Auth Status</th>
                     <th className="pb-8 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Harvest Activity</th>
                     <th className="pb-8 text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Connection Date</th>
                     <th className="pb-8 text-right text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 pr-4">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  <AnimatePresence mode="popLayout">
                    {filteredUsers.map((user, i) => (
                       <motion.tr 
                         key={user.id}
                         layout
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: i * 0.05 }}
                         className="group border-none hover:bg-slate-50 transition-colors"
                       >
                          <td className="py-7 pl-4">
                             <div className="flex items-center space-x-6">
                                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-sm font-black shadow-glow">
                                   {user.name ? user.name[0].toUpperCase() : 'U'}
                                </div>
                                <div className="flex flex-col">
                                   <p className="text-[14px] font-black text-slate-900 leading-tight mb-1 uppercase tracking-tight">{user.name || 'Anonymous'}</p>
                                   <div className="flex items-center text-slate-400">
                                      <Mail className="w-3 h-3 mr-2" />
                                      <span className="text-[10px] font-black">{user.email}</span>
                                   </div>
                                </div>
                             </div>
                          </td>
                          <td className="py-7">
                             <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                user.role === 'admin' ? 'bg-accent/10 text-accent' : 'bg-primary/5 text-primary'
                             }`}>
                                {user.role === 'admin' ? <Shield className="w-3 h-3 mr-2" /> : <UserCheck className="w-3 h-3 mr-2" />}
                                {user.role || 'Member'}
                             </span>
                          </td>
                          <td className="py-7">
                             <div className="flex flex-col">
                                <span className="text-sm font-black text-slate-900">{getCustomerOrdersCount(user.id)} Orders</span>
                                <p className="text-[9px] font-black text-slate-300 uppercase italic">Supply Chain Interactions</p>
                             </div>
                          </td>
                          <td className="py-7">
                             <div className="flex items-center space-x-3 text-slate-500">
                                <Calendar className="w-4 h-4 text-slate-200" />
                                <span className="text-[11px] font-black uppercase tracking-tighter">Joined 2024</span>
                             </div>
                          </td>
                          <td className="py-7 pr-4 text-right">
                             <div className="flex items-center justify-end space-x-2">
                                <button className="flex items-center px-6 py-3 bg-white text-primary border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-soft hover:shadow-premium transition-all group">
                                   Access Profile <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="p-3 bg-slate-50 text-slate-300 rounded-xl hover:text-primary transition-all">
                                   <MoreVertical className="w-4 h-4" />
                                </button>
                             </div>
                          </td>
                       </motion.tr>
                    ))}
                  </AnimatePresence>
               </tbody>
            </table>
         </div>
         
         {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <div className="w-10 h-10 border-4 border-primary/10 border-t-primary rounded-full animate-spin mb-4" />
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Synchronizing Community Registry...</p>
            </div>
         )}
      </div>
    </div>
  );
}
