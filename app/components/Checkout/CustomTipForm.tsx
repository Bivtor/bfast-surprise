import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState} from "react";


interface CustomTipModalProps {
  isOpen: boolean;
  onClose: () => void;
  customTipValueCents: number;
  setCustomTipValueCents: (value: number) => void;
}

function CustomTipModal({
    isOpen,
    onClose,
    customTipValueCents,
    setCustomTipValueCents,
}: CustomTipModalProps) {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Remove any non-numeric characters
      const value = e.target.value.replace(/[^0-9]/g, '');
  
      // Format as currency - for example if user types "2", we want "0.02"
      let formattedValue = value;
      while (formattedValue.length < 3) {
        formattedValue = '0' + formattedValue;
      }
      
      // Insert decimal point two places from right
      const dollars = formattedValue.slice(0, -2) || '0';
      const cents = formattedValue.slice(-2);
    };
  
    const handleSubmit = () => {

      setCustomTipValueCents(customTipValueCents);
      const amount = parseFloat(tipAmount);
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
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] overflow-hidden"
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
                      type="text"
                      inputMode="numeric"
                      value={customTipValue}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg p-4 pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>
  
                <button
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
