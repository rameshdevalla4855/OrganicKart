'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/firebase/firebaseInit';
import { collection, getDocs, doc, query, orderBy, updateDoc, deleteDoc } from 'firebase/firestore';
import { Loader2, Mail, MessageSquare, Clock, CheckCircle2, Trash2, Search, User, Phone, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface ContactMessage {
  id: string;
  name: string;
  mobile: string;
  message: string;
  status: 'read' | 'unread';
  createdAt: Date;
}

export default function AdminMessagesPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Protect Route (Admin Only)
  useEffect(() => {
    if (!authLoading && (!user || userData?.role !== 'admin')) {
      router.push('/');
    } else if (userData?.role === 'admin') {
      fetchMessages();
    }
  }, [user, userData, authLoading, router]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'contact_messages'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as ContactMessage[];
      setMessages(items);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleReadStatus = async (messageId: string, currentStatus: string) => {
    setUpdatingId(messageId);
    try {
      const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
      const msgRef = doc(db, 'contact_messages', messageId);
      await updateDoc(msgRef, { status: newStatus });
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, status: newStatus } : m));
    } catch (error) {
       console.error('Error toggling status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      await deleteDoc(doc(db, 'contact_messages', messageId));
      setMessages(prev => prev.filter(m => m.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.mobile.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || !userData || userData.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Admin Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-8 whitespace-nowrap overflow-x-auto no-scrollbar">
         <Link href="/admin/products" className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-primary transition-colors">Manage Products</Link>
         <Link href="/admin/orders" className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-primary transition-colors">Manage Orders</Link>
         <Link href="/admin/messages" className="px-6 py-4 text-sm font-bold text-primary border-b-2 border-primary">Customer Messages</Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900">Inquiry Hub</h1>
          <p className="text-gray-500 mt-1">Direct inquiries from your customers via the Contact form.</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center text-gray-500 text-sm font-medium mb-1">
            <Mail className="w-4 h-4 mr-2" /> Total Inquiries
          </div>
          <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center text-gray-500 text-sm font-medium mb-1 text-orange-600">
            <Clock className="w-4 h-4 mr-2" /> Unread Messages
          </div>
          <p className="text-2xl font-bold text-orange-600">{messages.filter(m => m.status === 'unread').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center text-gray-500 text-sm font-medium mb-1 text-green-600">
            <CheckCircle2 className="w-4 h-4 mr-2" /> Replied/Archived
          </div>
          <p className="text-2xl font-bold text-green-600">{messages.filter(m => m.status === 'read').length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex items-center">
        <Search className="w-5 h-5 text-gray-400 ml-2" />
        <input 
          type="text" 
          placeholder="Search by name or mobile..." 
          className="flex-grow px-4 py-2 outline-none text-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Message List */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                 <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                 <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                 <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Message</th>
                 <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                 <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {loading ? (
                  <tr><td colSpan={5} className="p-10 text-center text-gray-400"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> Loading...</td></tr>
               ) : filteredMessages.length === 0 ? (
                  <tr><td colSpan={5} className="p-10 text-center text-gray-400">No inquiries found.</td></tr>
               ) : (
                  filteredMessages.map((msg) => (
                     <tr key={msg.id} className={`hover:bg-gray-50/50 transition-colors ${msg.status === 'unread' ? 'bg-orange-50/10' : ''}`}>
                        <td className="px-6 py-4">
                           <button 
                             onClick={() => toggleReadStatus(msg.id, msg.status)}
                             disabled={updatingId === msg.id}
                             title={msg.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                             className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${msg.status === 'unread' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                           >
                              {msg.status}
                           </button>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-900 flex items-center"><User className="w-3 h-3 mr-1 text-gray-400" /> {msg.name}</span>
                              <span className="text-xs text-gray-500 flex items-center mt-1"><Phone className="w-3 h-3 mr-1 text-gray-400" /> {msg.mobile}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="max-w-md">
                              <p className={`text-sm leading-relaxed ${msg.status === 'unread' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                                 {msg.message}
                              </p>
                           </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <span className="text-xs text-gray-500">{msg.createdAt.toLocaleDateString()}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button 
                             onClick={() => deleteMessage(msg.id)}
                             className="p-2 text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-lg"
                           >
                              <Trash2 className="w-5 h-5" />
                           </button>
                        </td>
                     </tr>
                  ))
               )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
