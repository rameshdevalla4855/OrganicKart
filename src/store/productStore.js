import { create } from 'zustand';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/firebase/firebaseInit';

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  lastFetched: null,

  // Fetch products from Firestore and cache them in memory
  fetchProducts: async (force = false) => {
    const { products, lastFetched, loading } = get();
    
    // Skip if already loading
    if (loading) return;

    // Cache logic: only fetch if empty, if forced, or if data is older than 5 minutes
    const now = Date.now();
    const isCacheValid = lastFetched && (now - lastFetched < 5 * 60 * 1000);

    if (products.length > 0 && isCacheValid && !force) {
      return products;
    }

    set({ loading: true });
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      set({ 
        products: fetchedProducts, 
        lastFetched: now,
        loading: false 
      });
      return fetchedProducts;
    } catch (error) {
      console.error("Error fetching products from store:", error);
      set({ loading: false });
      return [];
    }
  },

  // Helper to get products for a specific category
  getProductsByCategory: (category) => {
    const { products } = get();
    if (category === 'All') return products;
    return products.filter(p => p.category === category);
  },

  // ADD: New product creation
  addProduct: async (productData) => {
    try {
      const docRef = doc(collection(db, 'products'));
      const newProduct = {
        ...productData,
        id: docRef.id,
        createdAt: new Date().toISOString()
      };
      await setDoc(docRef, newProduct);
      set((state) => ({ products: [newProduct, ...state.products] }));
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error adding product:", error);
      return { success: false, error: error.message };
    }
  },

  // UPDATE: Existing product modification
  updateProduct: async (id, productData) => {
    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, productData);
      set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...productData } : p)
      }));
      return { success: true };
    } catch (error) {
      console.error("Error updating product:", error);
      return { success: false, error: error.message };
    }
  },

  // DELETE: Product removal
  deleteProduct: async (id) => {
    try {
      const docRef = doc(db, 'products', id);
      await deleteDoc(docRef);
      set((state) => ({
        products: state.products.filter(p => p.id !== id)
      }));
      return { success: true };
    } catch (error) {
      console.error("Error deleting product:", error);
      return { success: false, error: error.message };
    }
  }
}));
