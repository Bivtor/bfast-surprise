'use client'

import { useEffect, useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useCartStore } from '../store/cartStore'

interface Product {
  id: number
  name: string
  description: string
  price_cents: number
  image_url: string
  available: boolean
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error))
  }, [])

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price_cents,
    })
    console.log('Added to cart:', product)
  }

  return (
    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
      {products.map((product) => (
        <motion.div
          key={product.id}
          className="group relative bg-white rounded-lg shadow-md overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{product.description}</p>
              </div>
              <button
                onClick={() => handleAddToCart(product)}
                className="hover:cursor-pointer relative flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="sr-only">Add to cart</span>
                <PlusIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-900">
              ${(product.price_cents / 100).toFixed(2)}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}