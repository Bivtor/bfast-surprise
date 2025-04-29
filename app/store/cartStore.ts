import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../types/product';
import { calculateFinalPrice } from '../../lib/calculateFinalPrice';

interface CartStore {
  items: CartItem[];
  tip: number;
  addItem: (item: Omit<CartItem, 'quantity' | 'uniqueId'>) => void;
  removeItem: (uniqueId: string) => void;
  updateQuantity: (uniqueId: string, quantity: number) => void;
  updateItemModifications: (uniqueId: string, modifications: Partial<CartItem>) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTotalPrice: () => number;
  updateTipPercentage: (tip: number) => void;
  getTipPercentage: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      tip: 0,
      updateTipPercentage: (tip) => set({ tip }),
      getTipPercentage: () => get().tip,
      items: [],
      addItem: (item) => set((state) => {
        // Check if an identical item already exists in the cart
        const existingItem = state.items.find((cartItem) => {
          const sameProduct = cartItem.id === item.id;
          const sameAdditions = JSON.stringify(cartItem.additions) === JSON.stringify(item.additions);
          const sameSubtractions = JSON.stringify(cartItem.subtractions) === JSON.stringify(item.subtractions);
          const sameNote = cartItem.note === item.note;
          
          return sameProduct && sameAdditions && sameSubtractions && sameNote;
        });

        if (existingItem) {
          // Update quantity of existing item
          return {
            items: state.items.map((cartItem) =>
              cartItem.uniqueId === existingItem.uniqueId
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            ),
          };
        }

        // Add new item if no identical item exists
        return {
          items: [...state.items, { ...item, quantity: 1, uniqueId: crypto.randomUUID() }],
        };
      }),
      removeItem: (uniqueId) =>
        set((state) => ({
          items: state.items.filter((item) => item.uniqueId !== uniqueId),
        })),
      updateQuantity: (uniqueId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.uniqueId === uniqueId ? { ...item, quantity } : item
          ),
        })),
      updateItemModifications: (uniqueId, modifications) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.uniqueId === uniqueId ? { ...item, ...modifications } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      getSubtotal: () => {
        const { items } = get();
        // Use our centralized calculation function but only return the subtotal
        const priceBreakdown = calculateFinalPrice(items, false);
        return priceBreakdown.subtotal;
      },
      getTotalPrice: () => {
        const { items } = get();
        // including tip value
        const priceBreakdown = calculateFinalPrice(items, true, get().getTipPercentage()); 
        return priceBreakdown.total;
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);