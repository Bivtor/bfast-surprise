import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { TIP_PERCENTAGES } from "@/app/constants/pricing";
import { useCartStore } from "@/app/store/cartStore";
import CustomTipModal from "@/app/components/Checkout/CustomTipModal";

const TEST_MODE = process.env.NODE_ENV === "development";

const TEST_DATA = {
  purchaserEmail: "victorinaldi@ucla.edu",
  purchaserPhone: "+18057227847",
  recipientPhone: "+18057227847",
  deliveryDate: (() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  })(),
  deliveryTime: "09:00",
  deliveryAddress: "123 Test Street, San Francisco, CA 94103",
  customNote: "This is a test order",
};

interface CheckoutFormProps {
  loading?: boolean;
  clientSecret?: string;
  setLoading: (loading: boolean) => void;
}

export default function CheckoutForm({
  clientSecret,
  loading,
  setLoading
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { getSubtotal, getTotalPrice, updateTip, tip, getTipAmount } = useCartStore();
  const [isCustomTipModalOpen, setIsCustomTipModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState(
    TEST_MODE
      ? TEST_DATA
      : {
          purchaserEmail: "",
          purchaserPhone: "",
          recipientPhone: "",
          deliveryDate: "",
          deliveryTime: "",
          deliveryAddress: "",
          customNote: "",
        }
  );

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
    console.log("payment submit pressed")

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
        return_url: `${window.location.origin}/success?amount=$}`,
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

  const handleTipSelection = (percentage: number) => {
    updateTip({
      type: "percentage",
      value: percentage
    });
  };

  const handleCustomTip = (amount: number) => {
    updateTip({
      type: "flat",
      value: Math.round(amount * 100) // Convert dollars to cents when saving
    });
  };

  const getCurrentTipDisplay = () => {
      return (getTipAmount() / 100).toFixed(2); // Divide by 10000 because subtotal is in cents and we need to divide by 100 for percentage and 100 for display
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-6 border-gray-300 border rounded-2xl">
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

      {/* Tipping Section */}
      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700 mb-4">Tip Amount</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {TIP_PERCENTAGES.map((percentage) => (
            <button
              key={percentage}
              type="button"
              onClick={() => handleTipSelection(percentage)}
              className={`flex flex-col items-center justify-center py-3 px-4 rounded-lg hover:cursor-pointer ${
                tip.type === "percentage" && tip.value === percentage
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="text-lg font-medium">{percentage}%</span>
              <span className="text-sm text-center ">${((getSubtotal() / 100) * (percentage / 100)).toFixed(2)}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsCustomTipModalOpen(true)}
            className={`flex flex-col items-center justify-center py-3 px-4 rounded-lg hover:cursor-pointer ${
              tip.type === "flat"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="text-lg font-medium">Other</span>
            <span className="text-sm">${tip.type === "flat" ? getCurrentTipDisplay() : "0.00"}</span>
          </button>
        </div>
      </div>

      <CustomTipModal 
        isOpen={isCustomTipModalOpen}
        onClose={() => setIsCustomTipModalOpen(false)}
        onSubmit={handleCustomTip}
      />

      {/* Errors Display */}
      {errors.submit && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded">
          {errors.submit}
        </div>
      )}

      {/* Stripe Element */}
      {clientSecret && (
        <PaymentElement
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
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="mt-6 w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 hover:cursor-pointer disabled:opacity-50 transition-colors disabled:animate-pulse"
      >
        {!loading ? `Pay $${(getTotalPrice()/100).toFixed(2)}` : "Processing..."}
      </button>
    </form>
  );
}
