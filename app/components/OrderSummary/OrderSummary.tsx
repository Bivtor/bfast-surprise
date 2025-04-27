import { useState } from "react";
import { CartItem, Product } from "../../types/product";
import { useCartStore } from "../../store/cartStore";
import EditItemModal from "../Cart/EditItemModal";
// import {motion, AnimatePresence} from "framer-motion";

interface OrderSummaryProps {
  isOpen?: boolean;
  products: Product[];
  isMobile?: boolean;
}

export default function OrderSummary({
  isOpen = false,
  products
}: OrderSummaryProps) {
  const { items, removeItem } = useCartStore();
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

  const handleEdit = (item: CartItem) => {
    const product = products.find((p) => p.id === item.id);
    if (product) {
      setEditingItem(item);
    }
  };

  if (items.length === 0) {
    return (
      <p className="text-gray-500 text-center p-6">
        Choose an item from the menu to get started
      </p>
    );
  }

  return (
    <>
      <div className="space-y-0 ">
        {items.map((item) => (
          <div
            key={item.uniqueId}
            className="py-4 px-6 mx-4 border-b border-gray-200 last:border-b-0 text-black text-sm "
          >
            {/* Basic item info - always visible */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="w-6 font-medium text-black-500">
                  {item.quantity}
                </span>
                <span className="font-medium text-base">{item.name}</span>
              </div>
              <span className="font-medium">
                ${((item.price * item.quantity) / 100).toFixed(2)}
              </span>
            </div>

            {/* Extended info - only visible when open */}
            {isOpen && (
              <div className="ml-10 mt-4">
                {item.additions && item.additions.length > 0 && (
                  <div className="text-sm text-gray-500 space-y-1">
                    {item.additions.map((addition) => (
                      <div key={addition.id}>+ {addition.name}</div>
                    ))}
                  </div>
                )}
                {item.note && (
                  <div className="mt-2 text-sm text-gray-500">
                    Note: {item.note}
                  </div>
                )}
                <div className="mt-3 space-x-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-gray-600 hover:text-gray-800 text-xs font-medium hover:cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeItem(item.uniqueId)}
                    className="text-gray-600 hover:text-gray-800 text-xs font-medium hover:cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {editingItem && products.find((p) => p.id === editingItem.id) && (
        <EditItemModal
          isOpen={true}
          onClose={() => setEditingItem(null)}
          product={products.find((p) => p.id === editingItem.id)!}
          editingItem={editingItem}
        />
      )}
    </>
  );
}
