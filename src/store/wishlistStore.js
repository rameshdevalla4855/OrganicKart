import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlistItems: [],
      
      toggleWishlist: (product) => {
        set((state) => {
          const exists = state.wishlistItems.find(item => item.id === product.id);
          if (exists) {
            return {
              wishlistItems: state.wishlistItems.filter(item => item.id !== product.id)
            };
          }
          return { wishlistItems: [...state.wishlistItems, product] };
        });
      },
      
      removeFromWishlist: (productId) => {
        set((state) => ({
          wishlistItems: state.wishlistItems.filter(item => item.id !== productId)
        }));
      },
      
      clearWishlist: () => set({ wishlistItems: [] }),
      
      isInWishlist: (productId) => {
        return get().wishlistItems.some(item => item.id === productId);
      }
    }),
    {
      name: 'shresta-wishlist-storage',
    }
  )
);
