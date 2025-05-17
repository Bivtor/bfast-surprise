import { create } from "zustand";
import { CartItem } from "../types/product";

interface EditModalStore {
  editingItem: CartItem | null;
  setEditingItem: (item: CartItem | null) => void;
}

export const useEditModalStore = create<EditModalStore>()((set) => ({
  editingItem: null,
  setEditingItem: (item) => set({ editingItem: item }),
}));
