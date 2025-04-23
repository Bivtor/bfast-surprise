import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useCartStore } from '../store/cartStore'
import { Product, Addition, Subtraction, CartAddition, CartSubtraction } from '../types/product'

interface AddToCartModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product
}

export default function AddToCartModal({ isOpen, onClose, product }: AddToCartModalProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [selectedAdditions, setSelectedAdditions] = useState<CartAddition[]>([])
  const [selectedSubtractions, setSelectedSubtractions] = useState<CartSubtraction[]>([])
  const [note, setNote] = useState('')

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

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price_cents,
      additions: selectedAdditions,
      subtractions: selectedSubtractions,
      note
    })
    onClose()
    // Reset state
    setSelectedAdditions([])
    setSelectedSubtractions([])
    setNote('')
  }

  const toggleAddition = (addition: Addition) => {
    setSelectedAdditions(prev => {
      const exists = prev.find(a => a.id === addition.id)
      if (exists) {
        return prev.filter(a => a.id !== addition.id)
      }
      return [...prev, { id: addition.id, name: addition.name, price: addition.price_cents }]
    })
  }

  const toggleSubtraction = (subtraction: Subtraction) => {
    setSelectedSubtractions(prev => {
      const exists = prev.find(s => s.id === subtraction.id)
      if (exists) {
        return prev.filter(s => s.id !== subtraction.id)
      }
      return [...prev, subtraction]
    })
  }

  const totalPrice = (product.price_cents + selectedAdditions.reduce((sum, addition) => sum + addition.price, 0))

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-x-0 bottom-0 sm:bottom-auto sm:top-24 z-[70] bg-white rounded-t-2xl sm:rounded-2xl p-6 sm:max-w-lg sm:mx-auto sm:h-[calc(100vh-12rem)] sm:overflow-hidden"
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

            <div className="mt-3 h-full sm:overflow-y-auto">
              <div className="space-y-6 pb-6">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  Customize {product.name}
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
                            checked={selectedAdditions.some(a => a.name === addition.name)}
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

                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-base font-semibold text-gray-900">
                    ${(totalPrice / 100).toFixed(2)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row-reverse gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="flex-1 justify-center rounded-lg bg-indigo-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="flex-1 justify-center rounded-lg bg-white px-3 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={onClose}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}