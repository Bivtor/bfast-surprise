import Navigation from '../components/Navigation'
import Link from 'next/link'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="mt-4 text-lg text-gray-600">
            Thank you for your order. We'll make sure your breakfast surprise is delivered on time.
          </p>
          <div className="mt-8">
            <Link
              href="/browse"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Order Another Surprise
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}