'use client'
import { PlusIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import Navigation from '../components/Navigation'
import { useCartStore } from '../store/cartStore'

// This would normally come from your database
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: 'Continental Breakfast',
    description: 'A classic spread of croissants, jam, fresh fruit, and coffee',
    price: 2499,
    image_url: '/breakfast1.jpg',
    available: true,
  },
  {
    id: 2,
    name: 'American Breakfast',
    description: 'Pancakes, eggs, bacon, and fresh orange juice',
    price: 2699,
    image_url: '/breakfast2.jpg',
    available: true,
  },
  {
    id: 3,
    name: 'Healthy Start',
    description: 'Acai bowl, granola, fresh berries, and green tea',
    price: 2299,
    image_url: '/breakfast3.jpg',
    available: true,
  },
]

export default function BrowsePage() {
  const addToCart = useCartStore((state) => state.addItem)

  const handleAddToCart = (product: typeof SAMPLE_PRODUCTS[0]) => {
    const element = document.getElementById(`product-${product.id}`)
    const cart = document.querySelector('.cart-icon')
    
    if (element && cart) {
      const clone = element.cloneNode(true) as HTMLElement
      const rect = element.getBoundingClientRect()
      const cartRect = cart.getBoundingClientRect()
      
      clone.style.position = 'fixed'
      clone.style.top = `${rect.top}px`
      clone.style.left = `${rect.left}px`
      clone.style.width = `${rect.width}px`
      clone.style.height = `${rect.height}px`
      clone.style.transition = 'all 0.5s ease-in-out'
      clone.style.zIndex = '50'
      
      document.body.appendChild(clone)
      
      setTimeout(() => {
        clone.style.transform = `translate(${cartRect.left - rect.left}px, ${cartRect.top - rect.top}px) scale(0.1)`
        clone.style.opacity = '0'
      }, 0)
      
      setTimeout(() => {
        clone.remove()
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
        })
      }, 500)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Our Breakfast Options</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SAMPLE_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  id={`product-${product.id}`}
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {product.name}
                </h2>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    ${(product.price / 100).toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="inline-flex items-center justify-center p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}