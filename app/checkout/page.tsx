"use client";

import { Elements } from "@stripe/react-stripe-js";
import Navigation from "../components/Navigation";
import CheckoutForm from "../components/Checkout/CheckoutForm";
import OrderSummaryContainer from "../components/OrderSummary/OrderSummaryContainer";
import { loadStripe } from "@stripe/stripe-js";
import { useCartStore } from "../store/cartStore";
import { useEffect, useState } from "react";
import { Product } from "../types/product";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("Stripe public key is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function CheckoutPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { items, clearCart, getTotalItems, getSubtotal, getTotalPrice} = useCartStore();
  const [clientSecret, setClientSecret] = useState<string>();

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


  useEffect(() => {
    console.log('getting new paymentIntent')
    fetch("/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: getTotalPrice(),
        items,
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [getTotalPrice(), items]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8  dark:text-[#88BFFF]">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 order-first lg:order-last">
            <div className="bg-white shadow-lg rounded-2xl">
              <OrderSummaryContainer
                products={products}
                isOpen={true}
                showCheckoutButton={false}
                isCheckout={true}
              />
            </div>
          </div>

          <div className="lg:col-span-8 order-last lg:order-first " >
            {getSubtotal() > 0 ? (
              <Elements
                stripe={stripePromise}
                options={{
                  mode: "payment",
                  amount: getTotalPrice(),
                  currency: "usd",
                }}
              >
                <CheckoutForm
                  loading={loading}
                  setLoading={setLoading}
                  clientSecret={clientSecret}
                />
              </Elements>
            ) : (
              <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
                Nothing in Cart
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
