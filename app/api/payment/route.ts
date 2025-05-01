import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { calculateFinalPriceCents } from '../../../lib/calculateFinalPrice';
import { DEFAULT_TIP_PERCENTAGE } from '../../constants/pricing';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Calculate final amount using our shared function
    const priceBreakdown = calculateFinalPriceCents(data.items, true, DEFAULT_TIP_PERCENTAGE);

    // Create payment intent with the calculated total
    const paymentIntent = await stripe.paymentIntents.create({
      amount: priceBreakdown.total,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        subtotal: priceBreakdown.subtotal,
        tax: priceBreakdown.tax,
        deliveryFee: priceBreakdown.deliveryFee,
        tip: priceBreakdown.total - (priceBreakdown.subtotal + priceBreakdown.tax + priceBreakdown.deliveryFee),
        deliveryDate: data.deliveryDate,
        deliveryTime: data.deliveryTime,
        deliveryAddress: data.deliveryAddress,
        purchaserEmail: data.purchaserEmail,
        purchaserPhone: data.purchaserPhone,
        recipientPhone: data.recipientPhone || '',
        customNote: data.customNote || '',
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      priceBreakdown,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}