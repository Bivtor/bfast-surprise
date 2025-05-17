'use client';

import { useEditModalStore } from '../store/editModalStore';
import EditItemModal from './Cart/EditItemModal';
import { useEffect, useState } from 'react';
import { Product } from '../types/product';
import { useScrollLock } from '../hooks/useScrollLock';

export default function EditModalProvider() {
  const { editingItem, setEditingItem } = useEditModalStore();
  const { unlockScroll } = useScrollLock();
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products when needed
  useEffect(() => {
    if (editingItem) {
      fetch('/api/products')
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch((error) => console.error('Error fetching products:', error));
    }
  }, [editingItem]);

  const handleClose = () => {
    unlockScroll();
    setEditingItem(null);
  };

  if (!editingItem) return null;

  const product = products.find((p) => p.id === editingItem.id);
  if (!product) return null;

  return (
    <EditItemModal
      isOpen={true}
      onClose={handleClose}
      product={product}
      editingItem={editingItem}
    />
  );
}
