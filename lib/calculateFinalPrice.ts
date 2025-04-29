import { CartItem } from '../app/types/product';
import { DELIVERY_FEE_CENTS, TAX_RATE, DEFAULT_TIP_PERCENTAGE } from '../app/constants/pricing';

export interface PriceBreakdown {
  subtotal: number;  // in cents
  tax: number;       // in cents
  deliveryFee: number; // in cents
  tipAmount: number;   // in cents
  total: number;     // in cents
}

export function calculateFinalPrice(items: CartItem[], includeTip: boolean = true, tipPercentage: number = DEFAULT_TIP_PERCENTAGE): PriceBreakdown {
  // Calculate subtotal from items and their additions
  const subtotal = items.reduce((total, item) => {
    const additionsPrice = item.additions?.reduce((sum, addition) => sum + addition.price, 0) || 0;
    return total + ((item.price + additionsPrice) * item.quantity);
  }, 0);

  // Calculate tax
  const tax = Math.round(subtotal * TAX_RATE);

  // Add delivery fee
  const deliveryFee = DELIVERY_FEE_CENTS;

  // Calculate tip
  const tipAmount = includeTip ? Math.round(subtotal * tipPercentage/100) : 0;

  // Calculate total
  const total = subtotal + tax + deliveryFee + tipAmount;

  return {
    subtotal,
    tax,
    deliveryFee,
    tipAmount,
    total
  };
}


