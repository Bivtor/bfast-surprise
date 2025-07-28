import { NextResponse } from 'next/server';

interface OrderItem {
  id: string;
  quantity: number;
  options?: Record<string, any>;
}

interface SaveOrderRequest {
  purchaserEmail: string;
  purchaserPhone: string;
  recipientPhone?: string;
  deliveryDate: string;
  deliveryTime: string;
  deliveryAddress: string;
  customNote?: string;
  items: OrderItem[];
  tipAmount: number;
  subtotal: number;
  total: number;
  paymentIntentId: string;
  createdAt: string;
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body: SaveOrderRequest = await request.json();

    // Validate the request data
    if (!body.purchaserEmail || !body.purchaserPhone || !body.deliveryDate || 
        !body.deliveryTime || !body.deliveryAddress || !body.items || !body.paymentIntentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Save the order to your database
    // This is where you would implement the database connection and saving logic
    
    // For now, just log the order
    console.log('Received order:', body);

    // Return success response
    return NextResponse.json(
      { 
        message: 'Order saved successfully',
        orderId: 'TODO: Return the actual order ID' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error saving order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}