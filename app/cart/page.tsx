'use client'
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import Navigation from '../components/Navigation'
import { useCartStore } from '../store/cartStore'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalItems } = useCartStore()
  
  const totalPrice = items.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)

  const handleUpdateQuantity = (id: number, currentQuantity: number, increment: boolean) => {
    const newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity)
    } else {
      removeItem(id)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mt-4 text-gray-600">Browse our delicious breakfast options to get started</p>
            <Link
              href="/browse"
              className="mt-8 inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700"
            >
              Browse Menu
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="bg-white shadow rounded-lg">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center p-6 border-b last:border-b-0"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gray-600">
                      ${(item.price / 100).toFixed(2)} each
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-black">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, false)}
                        className="p-1 rounded-full hover:bg-gray-100 hover:cursor-pointer"
                      >
                        <MinusIcon className="h-5 w-5" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, true)}
                        className="p-1 rounded-full hover:bg-gray-100 hover:cursor-pointer"
                      >
                        <PlusIcon className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 hover:cursor-pointer rounded-full"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-4">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4 text-gray-700">
                <div className="flex justify-between">
                  <span>Items ({getTotalItems()})</span>
                  <span>${(totalPrice / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>$5.00</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${((totalPrice / 100) + 5).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <Link
                href="/checkout"
                className="mt-6 w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}