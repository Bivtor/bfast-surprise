import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCartStore } from "../store/cartStore";

interface CheckoutFormProps {
  amount: number;
}

export default function CheckoutForm({ amount }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string>();
  const { items, clearCart, getTotalItems } = useCartStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    purchaserEmail: "",
    purchaserPhone: "",
    recipientPhone: "",
    deliveryDate: "",
    deliveryTime: "",
    deliveryAddress: "",
    customNote: "",
  });

    useEffect(() => {
      fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          items,
        }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }, [amount, items]);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setLoading(false);
      setErrors((prev) => ({
        ...prev,
        submit: submitError.message || "An unknown error occurred",
      }));
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/success?amount=${amount}`,
      },
    });

    if (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "An unknown error occurred",
      }));
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
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
            <p className="mt-1 text-sm text-red-600">{errors.purchaserEmail}</p>
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
            <p className="mt-1 text-sm text-red-600">{errors.purchaserPhone}</p>
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
            min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.deliveryDate && (
            <p className="mt-1 text-sm text-red-600">{errors.deliveryDate}</p>
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
            <p className="mt-1 text-sm text-red-600">{errors.deliveryTime}</p>
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
            <p className="mt-1 text-sm text-red-600">{errors.deliveryAddress}</p>
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

      {clientSecret && <PaymentElement
        className="py-10 w-full"
        id="payment-element"
        options={{
          layout: "tabs",
          wallets: {
            applePay: "auto",
            googlePay: "auto",
          },
        }}
      />
    }

      <button
        type="submit"
        disabled={!stripe || loading}
        className="mt-6 w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 hover:cursor-pointer disabled:opacity-50 transition-colors disabled:animate-pulse"
      >
        {!loading ? `Pay $${amount}` : "Processing..."}
      </button>
    </form>
  );
}