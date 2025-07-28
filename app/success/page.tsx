'use client';

import { useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '../store/cartStore';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

function SuccessContent() {
  const searchParams = useSearchParams();
  const clearCart = useCartStore((state) => state.clearCart);
  const updateTip = useCartStore((state) => state.updateTip);

  const amount = searchParams.get('amount');
  const date = searchParams.get('date');
  const time = searchParams.get('time');
  const address = searchParams.get('address');
  const tip = searchParams.get('tip');

  const resetCart = useCallback(() => {
    clearCart();
    updateTip({ type: 'percentage', value: 0 });
  }, [clearCart, updateTip]);

  useEffect(() => {
    resetCart();
  }, [resetCart]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-green-500 text-white px-6 py-4">
          <h1 className="text-2xl font-bold">Payment Successful!</h1>
          <p className="text-lg">Thank you for your order</p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span className="text-gray-600">Order Total:</span>
                <span className="font-medium">${(parseInt(amount || '0') / 100).toFixed(2)}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Tip Amount:</span>
                <span className="font-medium">${(parseInt(tip || '0') / 100).toFixed(2)}</span>
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span className="text-gray-600">Delivery Date:</span>
                <span className="font-medium">{date ? formatDate(date) : 'N/A'}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Delivery Time:</span>
                <span className="font-medium">{time ? formatTime(time) : 'N/A'}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Delivery Address:</span>
                <span className="font-medium text-right">{address ? decodeURIComponent(address) : 'N/A'}</span>
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <p className="text-center text-gray-600">
              A confirmation email has been sent to your email address.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <Suspense fallback={
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-green-500 text-white px-6 py-4">
              <h1 className="text-2xl font-bold">Payment Successful!</h1>
              <p className="text-lg">Loading order details...</p>
            </div>
          </div>
        </main>
      }>
        <SuccessContent />
      </Suspense>

      <Footer />
    </div>
  );
}