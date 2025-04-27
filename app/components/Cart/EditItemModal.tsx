import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useCartStore } from '../../store/cartStore'
import { Product, CartItem, CartAddition, CartSubtraction } from '../../types/product'
import { useScrollLock } from '../../hooks/useScrollLock'

interface EditItemModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product
  editingItem: {
    uniqueId: string
    quantity: number
    additions: CartAddition[]
    subtractions: CartSubtraction[]
    note: string
  }
}

export default function EditItemModal({ isOpen, onClose, product, editingItem }: EditItemModalProps) {
  useScrollLock(isOpen)
  
  const { updateItemModifications, updateQuantity, removeItem } = useCartStore()
  const [selectedAdditions, setSelectedAdditions] = useState<CartAddition[]>([])
  const [selectedSubtractions, setSelectedSubtractions] = useState<CartSubtraction[]>([])
  const [note, setNote] = useState('')
  const [quantity, setQuantity] = useState(1)

  // Initialize state when editing an item
  useEffect(() => {
    if (editingItem) {
      setSelectedAdditions(editingItem.additions || [])
      setSelectedSubtractions(editingItem.subtractions || [])
      setNote(editingItem.note || '')
      setQuantity(editingItem.quantity)
    }
  }, [editingItem])

  // Add ESC key handler
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  const handleSave = () => {
    if (quantity === 0) {
      removeItem(editingItem.uniqueId)
    } else {
      updateItemModifications(editingItem.uniqueId, {
        additions: selectedAdditions,
        subtractions: selectedSubtractions,
        note
      })
      updateQuantity(editingItem.uniqueId, quantity)
    }
    onClose()
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(0, quantity + delta)
    setQuantity(newQuantity)
  }

  const toggleAddition = (addition: { id: number; name: string; price_cents: number }) => {
    setSelectedAdditions(prev => {
      const exists = prev.find(a => a.id === addition.id)
      if (exists) {
        return prev.filter(a => a.id !== addition.id)
      }
      return [...prev, { id: addition.id, name: addition.name, price: addition.price_cents }]
    })
  }

  const toggleSubtraction = (subtraction: { id: number; name: string }) => {
    setSelectedSubtractions(prev => {
      const exists = prev.find(s => s.id === subtraction.id)
      if (exists) {
        return prev.filter(s => s.id !== subtraction.id)
      }
      return [...prev, subtraction]
    })
  }

  const totalPrice = (product.price_cents + selectedAdditions.reduce((sum, addition) => sum + addition.price, 0)) * quantity

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] overflow-hidden"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-x-0 bottom-0 sm:bottom-auto sm:top-24 z-[70] bg-white rounded-t-2xl sm:rounded-2xl p-6 sm:max-w-lg sm:mx-auto max-h-[calc(100vh-6rem)] overflow-hidden"
          >
            <div className="absolute right-0 top-0 pr-4 pt-4">
              <button
                type="button"
                className="rounded-lg bg-white text-gray-400 hover:text-gray-500 cursor-pointer"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="h-full overflow-y-auto">
              <div className="space-y-6 pb-6">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  Edit {product.name}
                </h3>

                {product.additions && product.additions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Add Extra</h4>
                    <div className="mt-2 space-y-2">
                      {product.additions.map(addition => (
                        <label key={`${product.id}-addition-${addition.name}`} className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            checked={selectedAdditions.some(a => a.id === addition.id)}
                            onChange={() => toggleAddition(addition)}
                          />
                          <span className="ml-2 text-sm text-gray-600">
                            {addition.name} (+${(addition.price_cents / 100).toFixed(2)})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {product.subtractions && product.subtractions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Remove</h4>
                    <div className="mt-2 space-y-2">
                      {product.subtractions.map(subtraction => (
                        <label key={`${product.id}-subtraction-${subtraction.id}`} className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            checked={selectedSubtractions.some(s => s.id === subtraction.id)}
                            onChange={() => toggleSubtraction(subtraction)}
                          />
                          <span className="ml-2 text-sm text-gray-600">{subtraction.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="note" className="block text-sm font-medium text-gray-900">
                    Special Instructions
                  </label>
                  <textarea
                    id="note"
                    rows={3}
                    className="p-2 mt-2 block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 resize-none"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Any special instructions for preparing this item?"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 text-black">
                  <div className="flex items-center justify-center px-4 py-2 bg-gray-100 rounded-full">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className={`p-1 rounded-full hover:bg-gray-200 disabled:opacity-10 transition-colors hover:cursor-pointer`}
                      disabled={quantity <= 0}
                    >
                      <MinusIcon className="h-5 w-5" />
                    </button>
                    <span className="mx-2 text-lg font-medium w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors hover:cursor-pointer"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="flex-1 justify-center rounded-lg bg-indigo-600 px-3 py-3 text-sm font-normal text-white shadow-sm hover:bg-indigo-500 hover:cursor-pointer"
                    onClick={handleSave}
                  >
                    {quantity === 0 ? 'Remove Item' : `Update Item  |  ${((totalPrice) / 100).toFixed(2)}`}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}