'use client'
import { useEffect, useState } from 'react'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import ProductGrid from '@/app/browse/ProductGrid'
import Navigation from '../components/Navigation'
import OrderSummaryContainer from '../components/OrderSummary/OrderSummaryContainer'
import { useCartStore } from '../store/cartStore'
import { Product } from '../types/product'
import { useScrollLock } from '@/app/hooks/useScrollLock'

export const dynamic = 'force-dynamic'

export default function BrowsePage() {
  const { lockScroll, unlockScroll } = useScrollLock();
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const { getTotalItems } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSummary, setExpandedSummary] = useState(false);

  useEffect(() => {
    setIsCartLoaded(true);
  }, []);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="sticky top-0 z-50 bg-white shadow">
        <Navigation />
      </div>
      
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 px-4 lg:px-0">
            {loading ? (
              <div className='text-black'>Loading...</div>
            ) : (
              <ProductGrid products={products} />
            )}
          </div>

          {/* Cart Summary - Desktop */}
          <div className="hidden lg:block lg:col-span-4 ">
            <div className="bg-white shadow-lg rounded-2xl sticky top-25">
              <OrderSummaryContainer
                products={products}
                isOpen={expandedSummary}
                onToggle={() => setExpandedSummary(!expandedSummary)}
              />
            </div>
          </div>
        </div>

        {/* Mobile Cart Button */}
        <div className="fixed bottom-6 left-0 right-0 px-4 lg:hidden">
          {getTotalItems() > 0 && isCartLoaded && (
            <button
              onClick={() => {
                lockScroll();
                setIsMobileCartOpen(true)
              }}
              className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-full shadow-lg text-base font-medium text-white bg-blue-600 hover:bg-blue-700 hover:cursor-pointer"
            >
              <ShoppingBagIcon className="h-5 w-5 mr-2" />
              {getTotalItems()} Items in Order
            </button>
          )}
        </div>

        {/* Mobile Cart Slide-up */}
        <AnimatePresence>
          {isMobileCartOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 lg:hidden bg-black/40 backdrop-blur-sm"
                onClick={() => {
                  unlockScroll();
                  setIsMobileCartOpen(false)
                }}
              />
              <div className="fixed inset-0 z-[51] lg:hidden overflow-hidden">
                <OrderSummaryContainer
                  products={products}
                  isOpen={true}
                  isMobile={true}
                  onClose={() => {
                    unlockScroll();
                    setIsMobileCartOpen(false)
                  }}
                />
              </div>
            </>
          )}
        </AnimatePresence>
      </main>
      

    </div>
  )
}