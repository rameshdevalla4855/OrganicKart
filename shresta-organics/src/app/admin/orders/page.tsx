'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/firebase/firebaseInit';
import { collection, getDocs, doc, query, orderBy, updateDoc } from 'firebase/firestore';
import { Loader2, Package, Search, ShoppingBag, Clock, CheckCircle2, Truck, ChevronDown, ChevronUp, User, MapPin, CreditCard } from 'lucide-react';
import { AdminTableSkeleton } from '@/components/Skeletons';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Protect Route (Admin Only)
  useEffect(() => {
    if (!authLoading && (!user || userData?.role !== 'admin')) {
      router.push('/');
    } else if (userData?.role === 'admin') {
      fetchOrders();
    }
  }, [user, userData, authLoading, router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setOrders(items);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { orderStatus: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.userId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (authLoading || !userData || userData.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Admin Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-8 whitespace-nowrap overflow-x-auto no-scrollbar">
         <Link href="/admin/products" className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-primary transition-colors">Manage Products</Link>
         <Link href="/admin/orders" className="px-6 py-4 text-sm font-bold text-primary border-b-2 border-primary">Manage Orders</Link>
         <Link href="/admin/messages" className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-primary transition-colors">Customer Messages</Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-500 mt-1">Track sales, processing, and delivery status of all orders.</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center text-gray-500 text-sm font-medium mb-1">
            <ShoppingBag className="w-4 h-4 mr-2" /> Total Orders
          </div>
          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center text-gray-500 text-sm font-medium mb-1">
            <Clock className="w-4 h-4 mr-2" /> Pending
          </div>
          <p className="text-2xl font-bold text-blue-600">{orders.filter(o => o.orderStatus === 'placed').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center text-gray-500 text-sm font-medium mb-1">
            <Truck className="w-4 h-4 mr-2" /> Shipped
          </div>
          <p className="text-2xl font-bold text-orange-500">{orders.filter(o => o.orderStatus === 'shipped').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center text-gray-500 text-sm font-medium mb-1">
            <CheckCircle2 className="w-4 h-4 mr-2" /> Delivered
          </div>
          <p className="text-2xl font-bold text-green-600">{orders.filter(o => o.orderStatus === 'delivered').length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex items-center">
        <Search className="w-5 h-5 text-gray-400 ml-2" />
        <input 
          type="text" 
          placeholder="Search by Order ID or User ID..." 
          className="flex-grow px-4 py-2 outline-none text-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
             <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
             <p className="text-gray-500 font-medium">Fetching orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
             <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
             <p className="text-gray-500 font-medium">No orders found.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden transition-all hover:shadow-md">
               {/* Order Row Header */}
               <div className="p-6 flex flex-wrap items-center justify-between gap-4 cursor-pointer" onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}>
                  <div className="flex items-center space-x-6">
                     <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                        <p className="text-sm font-bold text-primary font-mono">{order.orderId}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date</p>
                        <p className="text-sm font-medium text-gray-600">{order.createdAt.toLocaleDateString()}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Amount</p>
                        <p className="text-sm font-bold text-gray-900">₹{order.total}</p>
                     </div>
                     <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                     </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                     <select 
                        value={order.orderStatus} 
                        onChange={(e) => {
                           e.stopPropagation();
                           updateOrderStatus(order.id, e.target.value);
                        }}
                        disabled={updatingId === order.id}
                        className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-lg p-2 outline-none focus:ring-1 focus:ring-primary cursor-pointer disabled:opacity-50"
                     >
                        <option value="placed">Mark: Placed</option>
                        <option value="shipped">Mark: Shipped</option>
                        <option value="delivered">Mark: Delivered</option>
                        <option value="cancelled">Mark: Cancelled</option>
                     </select>
                     {expandedOrderId === order.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
               </div>

               {/* Expanded Details */}
               {expandedOrderId === order.id && (
                  <div className="p-6 bg-gray-50 border-t border-gray-100">
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Customer & Address */}
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                           <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                              <User className="w-3 h-3 mr-2" /> Customer Details
                           </h4>
                           <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                 <span className="text-gray-500">User ID:</span>
                                 <span className="font-mono text-xs">{order.userId.slice(0, 10)}...</span>
                              </div>
                              <div className="flex flex-col space-y-1 mt-4">
                                 <span className="text-gray-500 flex items-center"><MapPin className="w-3 h-3 mr-2" /> Shipping Address:</span>
                                 <span className="bg-gray-50 p-2 rounded text-xs leading-relaxed">{order.shippingAddress}</span>
                              </div>
                           </div>
                        </div>

                        {/* Order Items */}
                        <div className="lg:col-span-2 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                           <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                              <Package className="w-3 h-3 mr-2" /> Order Items
                           </h4>
                           <div className="space-y-3">
                              {order.items?.map((item: any, idx: number) => (
                                 <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                    <div className="flex items-center">
                                       <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold mr-3">{item.qty}x</span>
                                       <span className="text-sm font-medium text-gray-800">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">₹{item.price * item.qty}</span>
                                 </div>
                              ))}
                              <div className="pt-4 flex justify-between items-center font-bold text-primary">
                                 <span>Grand Total</span>
                                 <span className="text-lg">₹{order.total}</span>
                              </div>
                              <div className="mt-4 flex items-center text-xs text-gray-500">
                                 <CreditCard className="w-3 h-3 mr-2" /> 
                                 Payment: <span className="ml-1 font-bold uppercase">{order.paymentMethod}</span>
                                 <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {order.paymentStatus}
                                 </span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
