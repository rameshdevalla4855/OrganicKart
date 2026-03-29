import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      
      addToCart: (product, qty = 1) => {
        set((state) => {
          const existingItem = state.cartItems.find(item => item.id === product.id);
          if (existingItem) {
            return {
              cartItems: state.cartItems.map(item =>
                item.id === product.id ? { ...item, qty: item.qty + qty } : item
              )
            };
          }
          return { cartItems: [...state.cartItems, { ...product, qty }] };
        });
      },
      
      removeFromCart: (productId) => {
        set((state) => ({
          cartItems: state.cartItems.filter(item => item.id !== productId)
        }));
      },
      
      updateQuantity: (productId, qty) => {
        set((state) => ({
          cartItems: state.cartItems.map(item =>
            item.id === productId ? { ...item, qty: Math.max(1, qty) } : item
          )
        }));
      },
      
      clearCart: () => set({ cartItems: [] }),
      
      getCartTotal: () => {
        return get().cartItems.reduce((total, item) => total + (item.discountPrice || item.price) * item.qty, 0);
      }
    }),
    {
      name: 'shresta-cart-storage',
    }
  )
);
