'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/firebase/firebaseInit';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Loader2, Plus, Trash2, Edit, ExternalLink, Package, Search } from 'lucide-react';
import { AdminTableSkeleton } from '@/components/Skeletons';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminProductsPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Protect Route (Admin Only)
  useEffect(() => {
    if (!authLoading && (!user || userData?.role !== 'admin')) {
      router.push('/');
    } else if (userData?.role === 'admin') {
      fetchProducts();
    }
  }, [user, userData, authLoading, router]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(items);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
    
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(prev => prev.filter(p => p.id !== id));
      alert('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || !userData || userData.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Admin Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-8 whitespace-nowrap overflow-x-auto no-scrollbar">
         <Link href="/admin/products" className="px-6 py-4 text-sm font-bold text-primary border-b-2 border-primary">Manage Products</Link>
         <Link href="/admin/orders" className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-primary transition-colors">Manage Orders</Link>
         <Link href="/admin/messages" className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-primary transition-colors">Customer Messages</Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900">Manage Products</h1>
          <p className="text-gray-500 mt-1">Add, view, or remove items from your store inventory.</p>
        </div>
        
        <Link 
          href="/admin/products/new"
          className="inline-flex items-center bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-medium transition-transform hover:scale-[1.02] shadow-md"
        >
          <Plus className="w-5 h-5 mr-2" /> Add New Product
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center text-gray-500 text-sm font-medium mb-1">
            <Package className="w-4 h-4 mr-2" /> Total Products
          </div>
          <p className="text-2xl font-bold text-gray-900">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center text-gray-500 text-sm font-medium mb-1">
            <Loader2 className="w-4 h-4 mr-2" /> Out of Stock
          </div>
          <p className="text-2xl font-bold text-red-600">{products.filter(p => p.stock_count <= 0).length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center text-gray-500 text-sm font-medium mb-1">
             Low Stock (Under 10)
          </div>
          <p className="text-2xl font-bold text-orange-500">{products.filter(p => p.stock_count > 0 && p.stock_count < 10).length}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex items-center">
        <Search className="w-5 h-5 text-gray-400 ml-2" />
        <input 
          type="text" 
          placeholder="Search items by name or category..." 
          className="flex-grow px-4 py-2 outline-none text-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-bottom border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <AdminTableSkeleton />
              ) : filteredProducts.length === 0 ? (
                <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                     No products found. Add some to get started!
                   </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                          <Image 
                            src={p.image_url || '/placeholder.svg'} 
                            alt={p.name} 
                            fill 
                            className="object-cover"
                            unoptimized={!!p.image_url}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900">{p.name}</div>
                          <div className="text-xs text-gray-500">{p.weight}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-600">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">₹{p.price}</div>
                      {p.discountPrice && <div className="text-xs text-gray-400 line-through">₹{p.discountPrice}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm font-medium ${p.stock_count <= 0 ? 'text-red-600' : 'text-gray-700'}`}>
                        {p.stock_count} units
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                         <Link 
                           href={`/products/${p.id}`}
                           target="_blank"
                           className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-primary/5 rounded-lg"
                           title="Preview Live"
                         >
                           <ExternalLink className="w-5 h-5" />
                         </Link>
                         <button 
                           onClick={() => handleDelete(p.id, p.name)}
                           disabled={deletingId === p.id}
                           className="p-2 text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-lg disabled:opacity-50"
                           title="Delete Product"
                         >
                           {deletingId === p.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                         </button>
                      </div>
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
