import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { calculateFinalPriceCents } from '../../../lib/calculateFinalPrice';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Calculate final amount using our shared function
    const priceBreakdown = calculateFinalPriceCents(
      data.items, 
      true,
      data.tipAmount // Pass the tip amount from the request
    );
    console.log('Price Breakdown:', priceBreakdown);

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
        tip: priceBreakdown.tipAmount,
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