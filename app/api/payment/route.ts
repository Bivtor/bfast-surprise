import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Calculate total amount including delivery fee and additions
    const amount = data.items.reduce((total: number, item: any) => {
      const itemPrice = item.price;
      const additionsPrice = item.additions?.reduce((sum: number, addition: any) => sum + addition.price, 0) || 0;
      return total + ((itemPrice + additionsPrice) * item.quantity);
    }, 0) + 500; // Adding $5.00 delivery fee

    console.log('going to query stripe')

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
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
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}