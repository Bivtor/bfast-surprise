'use client'

import { useState } from 'react'
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useCartStore } from '../store/cartStore'
import Navigation from '../components/Navigation'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore()
  const [expandedSummary, setExpandedSummary] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const displayedItems = items.reduce((total, item) => total + item.quantity, 0)
  const displayedPrice = getTotalPrice()
  
  const handleUpdateQuantity = (uniqueId: string, currentQuantity: number, increment: boolean) => {
    const newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1
    if (newQuantity > 0) {
      updateQuantity(uniqueId, newQuantity)
    } else {
      removeItem(uniqueId)
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
                  key={item.uniqueId}
                  className="flex items-start p-6 border-b last:border-b-0"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    
                    {/* Display additions */}
                    {item.additions && item.additions.length > 0 && (
                      <div className="mt-1">
                        <p className="text-sm text-gray-600">
                          Extra: {item.additions.map(addition => 
                            `${addition.name} (+$${(addition.price / 100).toFixed(2)})`
                          ).join(', ')}
                        </p>
                      </div>
                    )}
                    
                    {/* Display subtractions */}
                    {item.subtractions && item.subtractions.length > 0 && (
                      <div className="mt-1">
                        <p className="text-sm text-gray-600">
                          Without: {item.subtractions.map(sub => sub.name).join(', ')}
                        </p>
                      </div>
                    )}
                    
                    {/* Display special instructions */}
                    {item.note && (
                      <div className="mt-1">
                        <p className="text-sm text-gray-600 italic">
                          Note: {item.note}
                        </p>
                      </div>
                    )}
                    
                    <p className="mt-1 text-gray-600">
                      ${((item.price + (item.additions?.reduce((sum, addition) => sum + addition.price, 0) || 0)) / 100).toFixed(2)} each
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-black">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.uniqueId, item.quantity, false)}
                        className="p-1 rounded-full hover:bg-gray-100 hover:cursor-pointer"
                      >
                        <MinusIcon className="h-5 w-5" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.uniqueId, item.quantity, true)}
                        className="p-1 rounded-full hover:bg-gray-100 hover:cursor-pointer"
                      >
                        <PlusIcon className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.uniqueId)}
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                <button 
                  onClick={() => setExpandedSummary(!expandedSummary)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {expandedSummary ? 'Collapse' : 'Expand'}
                </button>
              </div>
              
              <div className={`space-y-4 text-gray-700 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                {!expandedSummary ? (
                  // Collapsed view
                  <div className="space-y-2">
                    {items.map((item, index) => (
                      <div key={item.uniqueId} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">{index + 1}.</span>
                          <span>{item.name}</span>
                        </div>
                        <span>${((item.price * item.quantity) / 100).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Expanded view
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div key={item.uniqueId} className="pb-3 border-b last:border-b-0">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-2">
                            <span className="text-gray-500">{index + 1}.</span>
                            <div>
                              <span>{item.name}</span>
                              {item.additions?.length > 0 && (
                                <div className="text-sm text-gray-600 mt-1">
                                  Extra: {item.additions.map(addition => 
                                    `${addition.name} (+$${(addition.price / 100).toFixed(2)})`
                                  ).join(', ')}
                                </div>
                              )}
                              {item.subtractions?.length > 0 && (
                                <div className="text-sm text-gray-600 mt-1">
                                  Without: {item.subtractions.map(sub => sub.name).join(', ')}
                                </div>
                              )}
                            </div>
                          </div>
                          <span>${((item.price * item.quantity) / 100).toFixed(2)}</span>
                        </div>
                        <div className="mt-2 space-x-4">
                          <button 
                            onClick={() => handleUpdateQuantity(item.uniqueId, item.quantity, true)}
                            className="text-blue-600 hover:text-blue-800 underline text-sm"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => removeItem(item.uniqueId)}
                            className="text-red-600 hover:text-red-800 underline text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>$5.00</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({displayedItems} items)</span>
                    <span className="font-bold">${(displayedPrice / 100).toFixed(2)}</span>
                  </div>
                </div>
                
                <Link
                  href="/checkout"
                  className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}