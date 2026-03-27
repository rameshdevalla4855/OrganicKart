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
  }
}));
