"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AddToCartModal from "../components/Cart/AddToCartModal";
import { Product } from "../types/product";
import { TRANSITION_STYLE_CART_MOBILE } from "../constants/pricing";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAddToCartClick = (product: Product, event: React.MouseEvent) => {
    setSelectedProduct(product);
  };

  const handleModalClose = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2 xl:gap-x-8 pb-20">
        {products.map((product) => (
          <motion.div
            key={product.id}
            onClick={(e) => handleAddToCartClick(product, e)}
            className="group relative bg-white rounded-lg border border-gray-300 overflow-hidden flex cursor-pointer hover:bg-gray-100 transition-colors duration-200 dark:bg-gray-200"
            transition={TRANSITION_STYLE_CART_MOBILE}
          >
            <div className="p-4 flex-[2]">
              <div className="flex flex-col h-full">
                <h3 className="text-md font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-auto line-clamp-2">
                  {product.description}
                </p>
                <p className="mt-3 text-base font-medium text-gray-900 ">
                  ${(product.price_cents / 100).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex-1 relative group aspect-square">
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover object-center rounded-md transition-all duration-200"
              />
              <div className="absolute inset-0 bg-gray-300/0 group-hover:bg-gray-300/20 transition-all duration-200 rounded-md"></div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedProduct && (
        <AddToCartModal
          isOpen={true}
          onClose={handleModalClose}
          product={selectedProduct}
        />
      )}
    </>
  );
}
