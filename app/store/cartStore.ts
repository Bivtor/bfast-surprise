import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, TipStructure } from "../types/product";
import { calculateFinalPriceCents } from "../../lib/calculateFinalPrice";
import { DEFAULT_TIP_PERCENTAGE } from "../constants/pricing";

interface CartStore {
  
  // Tip
  tip: TipStructure;
  updateTip: (tip: TipStructure) => void;
  getTipAmount: () => number;

  // Cart items
  items: CartItem[];
  addItem: (item: Omit<CartItem, "uniqueId">) => void;
  removeItem: (uniqueId: string) => void;
  updateQuantity: (uniqueId: string, quantity: number) => void;
  updateItemModifications: (
    uniqueId: string,
    modifications: Partial<CartItem>
  ) => void;
  getTotalItems: () => number;

  // Cart
  clearCart: () => void;

  // Cart calculations
  getSubtotal: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      tip: {
        type: "percentage",
        value: DEFAULT_TIP_PERCENTAGE
      },
      addItem: (item) =>
        set((state) => {
          // Check if an identical item already exists in the cart
          const existingItem = state.items.find((cartItem) => {
            const sameProduct = cartItem.id === item.id;
            const sameAdditions =
              JSON.stringify(cartItem.additions) ===
              JSON.stringify(item.additions);
            const sameSubtractions =
              JSON.stringify(cartItem.subtractions) ===
              JSON.stringify(item.subtractions);
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

          // Generate a deterministic ID
          const uniqueId = `${item.id}-${Date.now()}-${state.items.length}`;

          // Add new item if no identical item exists
          return {
            items: [
              ...state.items,
              { ...item, uniqueId },
            ],
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
        // Use our centralized calculation function but only return the subtotal
        const { items } = get();
        const priceBreakdown = calculateFinalPriceCents(items, false);
        return priceBreakdown.subtotal;
      },
      updateTip: (tip) => set({ tip }),
      getTipAmount: () => {
        const { tip } = get();
        const subtotal = get().getSubtotal();
        // Calculate tip cents value based on percentage of subtotal
        if (tip.type === "percentage") {
          return Math.round((subtotal * tip.value) / 100);
        }
        return tip.value; // tip.value should already be in cents
      },
      getTotalPrice: () => { 
        const { items } = get();
        const tipAmount = get().getTipAmount();
        const priceBreakdown = calculateFinalPriceCents(items, true, tipAmount);
        return priceBreakdown.total;
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
