import { Suspense } from 'react'
import ProductGrid from '@/app/browse/ProductGrid'
import Navigation from '../components/Navigation'

export const dynamic = 'force-dynamic'

export default async function BrowsePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Our Breakfast Options</h1>
        
        <Suspense fallback={<div className='text-black'>Loading products...</div>}>
          <ProductGrid />
        </Suspense>
      </main>
    </div>
  )
}