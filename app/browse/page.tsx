'use client'
import { Suspense } from 'react'
import ProductGrid from '@/app/browse/ProductGrid'
import Navigation from '../components/Navigation'
import Link from 'next/link'
import { useCartStore } from '../store/cartStore'
import { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'

export default function BrowsePage() {
  const { items, getTotalItems, getTotalPrice } = useCartStore()
  const [isVisible, setIsVisible] = useState(true)
  const [displayedPrice, setDisplayedPrice] = useState(0)
  const [displayedItems, setDisplayedItems] = useState(0)
  const [expandedSummary, setExpandedSummary] = useState(false)
  
  const totalPrice = getTotalPrice()

  useEffect(() => {
    const updateValues = () => {
      setIsVisible(false)
      setTimeout(() => {
        setDisplayedPrice(totalPrice)
        setDisplayedItems(getTotalItems())
        setIsVisible(true)
      }, 300)
    }
    
    if (displayedPrice !== totalPrice) {
      updateValues()
    }
  }, [totalPrice, displayedPrice, getTotalItems])

  useEffect(() => {
    setDisplayedPrice(totalPrice)
    setDisplayedItems(getTotalItems())
  }, [])

  return (
    <div className="min-h-screen bg-white ">
      <div className="sticky top-0 z-50 bg-white shadow">
        <Navigation />
      </div>
      
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-12">
        {/* <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Our Breakfast Options</h1> */}
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8  px-4 lg:px-0">
            <Suspense fallback={<div className='text-black'>Loading products...</div>}>
              <ProductGrid />
            </Suspense>
          </div>

          {/* Cart Summary - Desktop */}
          <div className="hidden lg:block lg:col-span-4 rounded-lg">
            <div className="bg-white shadow rounded-lg p-6 sticky top-20">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                <button 
                  onClick={() => setExpandedSummary(!expandedSummary)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {expandedSummary ? 'Collapse' : 'Expand'}
                </button>
              </div>
              
              {items.length === 0 ? (
                <p className="text-gray-500 text-center">Choose an item from the menu to get started</p>
              ) : (
                <>
                  <div className={`space-y-4 text-gray-700 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="max-h-96 overflow-y-auto">
                      {items.map((item, index) => (
                        <div key={item.uniqueId} className="py-2 border-b last:border-b-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <span className="text-gray-500 w-6">{index + 1}.</span>
                              <span className="font-medium">{item.name}</span>
                            </div>
                            <span>${((item.price * item.quantity) / 100).toFixed(2)}</span>
                          </div>
                          
                          {expandedSummary && (
                            <div className="ml-10 mt-2">
                              <div className="text-sm text-gray-600">
                                Quantity: {item.quantity}
                              </div>
                              {item.additions && item.additions.length > 0 && (
                                <div className="text-sm text-gray-500 mt-1">
                                  Extra: {item.additions.map(addition => addition.name).join(', ')}
                                </div>
                              )}
                              <div className="mt-2 space-x-4 text-sm">
                                <button className="text-blue-600 hover:text-blue-800 underline">
                                  Edit
                                </button>
                                <button className="text-red-600 hover:text-red-800 underline">
                                  Remove
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between font-bold border-t pt-4">
                      <span>Subtotal ({displayedItems} items)</span>
                      <span className="text-lg">${(displayedPrice / 100).toFixed(2)}</span>
                    </div>
                    
                    <Link
                      href="/cart"
                      className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      View Cart
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Cart Button */}
        <div className="fixed bottom-6 left-0 right-0 px-4 lg:hidden">
          <Link
            href="/cart"
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-full shadow-lg text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            View Cart ({displayedItems} items) - ${(displayedPrice / 100).toFixed(2)}
          </Link>
        </div>
      </main>
    </div>
  )
}