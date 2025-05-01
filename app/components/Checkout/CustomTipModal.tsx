import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

interface CustomTipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
}

function CustomTipModal({ isOpen, onClose, onSubmit }: CustomTipModalProps) {
  const [rawInput, setRawInput] = useState("");

  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  const formatAsCurrency = (input: string) => {
    const padded = input.padStart(3, '0');
    const dollars = padded.slice(0, -2);
    const cents = padded.slice(-2);
    return `${parseInt(dollars)}.${cents}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      setRawInput((prev) => prev.slice(0, -1));
    } else if (/^\d$/.test(e.key)) {
      e.preventDefault();
      setRawInput((prev) => (prev + e.key).slice(-9)); // optional cap at 9 digits
    }
  };

  const handleSubmit = () => {
    const amount = parseFloat(formatAsCurrency(rawInput));
    if (!isNaN(amount) && amount >= 0) {
      onSubmit(amount);
      onClose();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-x-0 bottom-0 sm:bottom-auto sm:top-24 z-[70] bg-white rounded-t-2xl sm:rounded-2xl p-6 sm:max-w-lg sm:mx-auto"
          >
            <div className="absolute right-0 top-0 pr-4 pt-4">
              <button
                type="button"
                className="rounded-lg bg-white text-gray-400 hover:text-gray-500 cursor-pointer"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                Add a Tip
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How much would you like to tip?
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    autoFocus
                    type="text"
                    inputMode="numeric"
                    value={formatAsCurrency(rawInput)}
                    onKeyDown={handleKeyDown}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg p-4 pl-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <button
                type='button'
                onClick={handleSubmit}
                className="hover:cursor-pointer w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CustomTipModal;
