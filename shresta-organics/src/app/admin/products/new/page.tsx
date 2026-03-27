'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { db, storage } from '@/firebase/firebaseInit';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Loader2, UploadCloud, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddProductPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Oils');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stockCount, setStockCount] = useState('');
  const [weight, setWeight] = useState('');
  const [description, setDescription] = useState('');
  const [isWoodPressed, setIsWoodPressed] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Protect Route (Admin Only)
  useEffect(() => {
    if (!authLoading && (!user || userData?.role !== 'admin')) {
      router.push('/');
    }
  }, [user, userData, authLoading, router]);

  if (authLoading || !userData || userData.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let imageUrl = '';
      
      // Upload Image if present
      if (imageFile) {
        if (imageFile.type === "text/uri-list") {
          // User pasted a direct web link
          imageUrl = imageFile.name; 
        } else {
          // Real File, Upload via our Server-Side API to bypass CORS
          const formData = new FormData();
          formData.append('file', imageFile);
          
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          
          if (!uploadRes.ok) {
            const errorData = await uploadRes.json();
            throw new Error(`Upload failed: ${errorData.error}`);
          }
          
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url;
        }
      } else {
        throw new Error("Product Image is required.");
      }

      // Automatically generate slug
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'products'), {
        name,
        slug,
        category,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : null,
        stock_count: Number(stockCount),
        weight,
        description,
        isWoodPressed,
        image_url: imageUrl,
        rating: 5.0,
        reviewsCount: 0,
        createdAt: serverTimestamp()
      });

      setSuccess(`Product added successfully! ID: ${docRef.id}`);
      
      // Reset form
      setName(''); setPrice(''); setDiscountPrice(''); setStockCount(''); setWeight(''); setDescription(''); setImageFile(null);
    } catch (err: any) {
      setError(err.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link 
        href="/admin/products"
        className="inline-flex items-center text-gray-500 hover:text-primary mb-6 font-medium transition-colors"
      >
        <ChevronLeft className="w-5 h-5 mr-1" /> Back to Product Management
      </Link>
      <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-8">Add New Product</h1>

      <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100">
        {success && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl">{success}</div>}
        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary bg-white">
                <option>Oils</option>
                <option>Spices</option>
                <option>Sweeteners</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Regular Price (₹)</label>
              <input type="number" required min="0" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount Price (₹) [Optional]</label>
              <input type="number" min="0" value={discountPrice} onChange={e => setDiscountPrice(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Initial Stock Quantity</label>
              <input type="number" required min="1" value={stockCount} onChange={e => setStockCount(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight / Volume (e.g. 1 Litre, 500g)</label>
              <input type="text" required value={weight} onChange={e => setWeight(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
            <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-primary resize-none" />
          </div>

          <div className="flex items-center border border-gray-200 p-4 rounded-xl">
            <input type="checkbox" id="woodPressed" checked={isWoodPressed} onChange={e => setIsWoodPressed(e.target.checked)} className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary" />
            <label htmlFor="woodPressed" className="ml-3 text-sm font-medium text-gray-700">Is this product Wood Pressed?</label>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Product Image</label>
            </div>
            
            <div className="mb-6 space-y-4">
              {/* Primary: File Upload */}
              <div className="relative flex flex-col items-center justify-center w-full h-40 px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl overflow-hidden hover:bg-gray-50 border-primary cursor-pointer transition-colors group">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }} 
                />
                
                {imageFile && imageFile.type !== "text/uri-list" ? (
                  <div className="text-center z-20">
                    <p className="text-sm text-gray-900 font-bold mb-2 bg-white px-2 py-1 rounded shadow-sm line-clamp-1">{imageFile.name}</p>
                    <button type="button" onClick={(e) => { e.preventDefault(); setImageFile(null); }} className="text-sm text-white bg-red-500 px-3 py-1 rounded-full font-bold shadow-md hover:bg-red-600 relative z-30">
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 text-center z-0">
                    <UploadCloud className="mx-auto h-10 w-10 text-primary opacity-70 group-hover:scale-110 transition-transform" />
                    <div className="text-sm text-gray-600 font-medium">
                      <span className="text-primary font-bold">Recommended: Upload Image File</span>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, or WEBP up to 5MB</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Secondary Helper: Paste URL fallback */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              <input 
                type="url" 
                placeholder="Alternative: Paste Web Image URL" 
                className="w-full px-4 py-3 rounded-xl border border-gray-100 outline-none focus:border-primary bg-gray-50 text-sm"
                onChange={(e) => {
                   if(e.target.value) {
                     setImageFile(new File([], e.target.value, {type: "text/uri-list"}));
                   } else {
                     setImageFile(null);
                   }
                }}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none disabled:opacity-70 transition-colors">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Publish Product to Store'}
          </button>
        </form>
      </div>
    </div>
  );
}
