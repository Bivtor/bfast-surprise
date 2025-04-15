"use client";
import { useState } from "react";
import Navigation from "@/app/components/Navigation";
import { useCartStore } from "../store/cartStore";
import { useRouter } from "next/navigation";

const TEST = 1;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, getTotalItems } = useCartStore();
  const [formData, setFormData] = useState(TEST == 1 ? {
    purchaserEmail: "test@example.com",
    purchaserPhone: "1234567890",
    recipientPhone: "0987654321",
    deliveryDate: new Date(Date.now() + 86400000 + 86400000).toISOString().split("T")[0],
    deliveryTime: "12:00",
    deliveryAddress: "123 Test Street, Test City",
    customNote: "This is a test order",
  } : {
    purchaserEmail: "",
    purchaserPhone: "",
    recipientPhone: "",
    deliveryDate: "",
    deliveryTime: "",
    deliveryAddress: "",
    customNote: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalPrice = items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.purchaserEmail) {
      newErrors.purchaserEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.purchaserEmail)) {
      newErrors.purchaserEmail = "Invalid email format";
    }

    if (!formData.purchaserPhone) {
      newErrors.purchaserPhone = "Phone number is required";
    }

    if (!formData.deliveryDate) {
      newErrors.deliveryDate = "Delivery date is required";
    } else {
      const selectedDate = new Date(formData.deliveryDate);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      if (selectedDate < tomorrow) {
        newErrors.deliveryDate = "Delivery date must be at least tomorrow";
      }
    }

    if (!formData.deliveryTime) {
      newErrors.deliveryTime = "Delivery time is required";
    }

    if (!formData.deliveryAddress) {
      newErrors.deliveryAddress = "Delivery address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      if (response.ok) {
        router.push("/order-confirmation");
        // clearCart();
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setErrors({
        submit: "Failed to place order. Please try again.",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow rounded-lg p-6"
            >
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="purchaserEmail"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="purchaserEmail"
                    name="purchaserEmail"
                    value={formData.purchaserEmail}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.purchaserEmail && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.purchaserEmail}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="purchaserPhone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Phone Number
                  </label>
                  <input
                    type="tel"
                    id="purchaserPhone"
                    name="purchaserPhone"
                    value={formData.purchaserPhone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.purchaserPhone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.purchaserPhone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="recipientPhone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Recipient's Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="recipientPhone"
                    name="recipientPhone"
                    value={formData.recipientPhone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="deliveryDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Delivery Date
                  </label>
                  <input
                    type="date"
                    id="deliveryDate"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleInputChange}
                    min={
                      new Date(Date.now() + 86400000)
                        .toISOString()
                        .split("T")[0]
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.deliveryDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.deliveryDate}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="deliveryTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Delivery Time
                  </label>
                  <input
                    type="time"
                    id="deliveryTime"
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.deliveryTime && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.deliveryTime}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="deliveryAddress"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Delivery Address
                  </label>
                  <textarea
                    id="deliveryAddress"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    rows={3}
                    className="resize-none mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.deliveryAddress && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.deliveryAddress}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="customNote"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Custom Note (Optional)
                  </label>
                  <textarea
                    id="customNote"
                    name="customNote"
                    value={formData.customNote}
                    onChange={handleInputChange}
                    rows={3}
                    className="resize-none mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {errors.submit && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded">
                  {errors.submit}
                </div>
              )}
            </form>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-4">
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
                    <span>${(totalPrice / 100 + 5).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                className="hover:cursor-pointer mt-6 w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
