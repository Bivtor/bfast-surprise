import { CartItem } from '../app/types/product';
import { DELIVERY_FEE_CENTS, TAX_RATE } from '../app/constants/pricing';
import { PriceBreakdown } from '@/app/types/product';

export function calculateFinalPriceCents(
  items: CartItem[], 
  includeFeesAndTax: boolean = false,
  tipAmount: number = 0
): PriceBreakdown {

  // Calculate subtotal from items and their additions
  const subtotal = items.reduce((total, item) => {
    const additionsPrice = item.additions?.reduce((sum, addition) => sum + addition.price, 0) || 0;
    return total + ((item.price + additionsPrice) * item.quantity);
  }, 0);

  if (!includeFeesAndTax) {
    return {
      subtotal,
      deliveryFee: 0,
      tax: 0,
      tipAmount: 0,
      total: subtotal // same as subtotal 
    };
  }

  // Calculate tax
  const tax = Math.round(subtotal * TAX_RATE);

  // Add delivery fee
  const deliveryFee = DELIVERY_FEE_CENTS;

  // Calculate total with the provided tip amount
  const total = subtotal + tax + deliveryFee + tipAmount;

  return {
    subtotal,
    deliveryFee,
    tax,
    tipAmount,
    total
  };
}


