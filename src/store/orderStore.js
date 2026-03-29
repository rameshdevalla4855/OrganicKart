import { create } from 'zustand';
import { collection, doc, getDocs, updateDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/firebaseInit';

export const useOrderStore = create((set, get) => ({
  orders: [],
  loading: false,
  unsubscribe: null,

  // Subscription for Real-Time "Live" Updates
  subscribeToOrders: () => {
    // If already subscribed, don't do it again
    if (get().unsubscribe) return;

    set({ loading: true });
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      set({ orders: ordersData, loading: false });
    }, (error) => {
      console.error("Order subscription failed:", error);
      set({ loading: false });
    });

    set({ unsubscribe });
  },

  // Manual Fetch if needed
  fetchOrders: async () => {
    set({ loading: true });
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      set({ orders: ordersData, loading: false });
      return ordersData;
    } catch (error) {
      console.error("Manual order fetch failed:", error);
      set({ loading: false });
      return [];
    }
  },

  // UPDATE: Milestone status transition
  updateOrderStatus: async (id, status) => {
    try {
      const docRef = doc(db, 'orders', id);
      await updateDoc(docRef, { orderStatus: status });
      // Logic: If successfully updated in Firestore, the local onSnapshot listener will handle the state update
      return { success: true };
    } catch (error) {
      console.error("Error updating order status:", error);
      return { success: false, error: error.message };
    }
  },

  // CLEANUP: Unsubscribe from listeners
  cleanup: () => {
    const unsub = get().unsubscribe;
    if (unsub) {
      unsub();
      set({ unsubscribe: null });
    }
  }
}));
