import { useCartStore } from "../../store/cartStore";
import OrderSummary from "@/app/components/OrderSummary/OrderSummary";
import { Product } from "../../types/product";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { calculateFinalPriceCents } from "../../../lib/calculateFinalPrice";
import { TRANSITION_STYLE_CART_MOBILE } from "@/app/constants/pricing";

interface OrderSummaryContainerProps {
  products: Product[];
  isOpen?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
  onClose?: () => void;
  showCheckoutButton?: boolean;
  isCheckout?: boolean;
}

export default function OrderSummaryContainer({
  products,
  isOpen = false,
  onToggle,
  isMobile = false,
  onClose,
  showCheckoutButton = true,
  isCheckout = false
}: OrderSummaryContainerProps) {
  const { items, getTipAmount } = useCartStore();
  
  const priceBreakdown = calculateFinalPriceCents(items, isCheckout, getTipAmount() ? getTipAmount() : undefined);
  
  const prices = {
    subtotal: (priceBreakdown.subtotal / 100).toFixed(2),
    deliveryFee: (priceBreakdown.deliveryFee / 100).toFixed(2),
    taxAmount: (priceBreakdown.tax / 100).toFixed(2),
    tipAmount: (priceBreakdown.tipAmount / 100).toFixed(2),
    total: (priceBreakdown.total / 100).toFixed(2)
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={`flex flex-col border border-gray-300  rounded-2xl ${
          isMobile ? "h-[100dvh] bg-white" : "h-full"
        }`}
        initial={isMobile ? { y: "100%" } : undefined}
        animate={isMobile ? { y: 0 } : undefined}
        exit={isMobile ? { y: "100%" } : undefined}
        transition={TRANSITION_STYLE_CART_MOBILE}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-300 dark:bg-gray-200 rounded-t-2xl ">
          <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>

          {onToggle && !isMobile && items.length > 0 && (
            <button
              onClick={onToggle}
              className="text-black p-2 hover:bg-gray-100 rounded-full hover:cursor-pointer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className={`transform transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.13003 6.16367C2.31579 5.95934 2.63201 5.94428 2.83634 6.13003L8 10.8243L13.1637 6.13003C13.368 5.94428 13.6842 5.95934 13.87 6.16367C14.0557 6.368 14.0407 6.68422 13.8363 6.86997L8.33634 11.87C8.14563 12.0433 7.85438 12.0433 7.66367 11.87L2.16367 6.86997C1.95934 6.68422 1.94428 6.368 2.13003 6.16367Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          )}

          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="text-black-400 hover:text-black-500 p-2 hover:bg-gray-100 hover:cursor-pointer rounded-full"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Order Summary Content */}
        <div className="flex-1 overflow-auto dark:bg-gray-200 ">
          <OrderSummary
            isOpen={isOpen}
            products={products}
            isMobile={isMobile}
          />
        </div>

        {/* Footer */}
        {items.length > 0 && (<div className="border-t border-gray-300 p-6 px-8 dark:bg-gray-200 rounded-b-2xl">
          <div className={`flex justify-between ${!isCheckout ? "font-bold text-black text-lg pb-4" : "text-gray-600 text-sm"}`}>
            <span>Subtotal</span>
            <span>${prices.subtotal}</span>
          </div>

          {isCheckout && (
            <div className="text-sm py-1">
              <div className="flex justify-between text-gray-600">
                <span className="font-underline">Delivery Fee</span>
                <span>${prices.deliveryFee}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${prices.taxAmount}</span>
              </div>

              {getTipAmount() > 0 && (<div className="flex justify-between text-gray-600">
                <span>Total Tip</span>
                <span>${prices.tipAmount}</span>
              </div>)}

              <div className="flex justify-between font-bold text-lg pt-2">
                <span>Total</span>
                <span>${prices.total}</span>
              </div>
            </div>
          )}

          {isMobile && (
            <button
              onClick={onClose}
              className="w-full inline-flex justify-center items-center px-6 py-3 my-3 border border-gray-300 rounded-full shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 hover:cursor-pointer"
            >
              Add More Items
            </button>
          )}

          {showCheckoutButton && (
            <Link
              href="/checkout"
              className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Checkout
            </Link>
          )}
        </div>)}
      </motion.div>
    </AnimatePresence>
  );
}
