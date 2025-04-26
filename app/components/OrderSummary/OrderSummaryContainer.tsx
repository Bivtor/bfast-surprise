import { useCartStore } from "../../store/cartStore";
import OrderSummary from "@/app/components/OrderSummary/OrderSummary";
import { Product } from "../../types/product";
import Link from "next/link";

interface OrderSummaryContainerProps {
  products: Product[];
  isOpen?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
  onClose?: () => void;
  showCheckoutButton?: boolean;
}

export default function OrderSummaryContainer({
  products,
  isOpen = false,
  onToggle,
  isMobile = false,
  showCheckoutButton = true,
}: OrderSummaryContainerProps) {
  const { getTotalItems, getTotalPrice } = useCartStore();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
        
        {onToggle && (
          <button
            onClick={onToggle}
            className="text-black hover:cursor-pointer p-2 hover:bg-gray-100 rounded-full"
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
      </div>

      {/* Order Summary Content */}
      <div className="flex-1 overflow-auto">
        <OrderSummary
          isOpen={isOpen}
          products={products}
          isMobile={isMobile}
        />
      </div>

      {/* Footer */}
      <div className="border-t p-6 space-y-4">
        <div className="flex justify-between font-bold">
          <span>Subtotal</span>
          <span className="text-lg">${(totalPrice / 100).toFixed(2)}</span>
        </div>

        {showCheckoutButton && (
          <Link
            href="/checkout"
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Checkout
          </Link>
        )}
      </div>
    </div>
  );
}