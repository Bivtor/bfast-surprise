import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '../types/product'

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity' | 'uniqueId'>) => void
  removeItem: (uniqueId: string) => void
  updateQuantity: (uniqueId: string, quantity: number) => void
  updateItemModifications: (uniqueId: string, modifications: Partial<CartItem>) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => ({
        items: [...state.items, { ...item, quantity: 1, uniqueId: crypto.randomUUID() }]
      })),
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
        const { items } = get()
        return items.reduce((total, item) => total + item.quantity, 0)
      },
      getTotalPrice: () => {
        const { items } = get()
        return items.reduce((total, item) => {
          const additionsPrice = item.additions?.reduce((sum, addition) => sum + addition.price, 0) || 0
          return total + ((item.price + additionsPrice) * item.quantity)
        }, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)