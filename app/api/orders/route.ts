import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const client = await pool.connect()

    try {
      // Start transaction
      await client.query('BEGIN')

      // Insert order
      const orderResult = await client.query(
        `INSERT INTO orders (
          purchaser_email, 
          purchaser_phone, 
          recipient_phone, 
          delivery_date, 
          delivery_time, 
          delivery_address, 
          custom_note,
          status,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [
          data.purchaserEmail,
          data.purchaserPhone,
          data.recipientPhone,
          data.deliveryDate,
          data.deliveryTime,
          data.deliveryAddress,
          data.customNote,
          'pending',
          new Date()
        ]
      )

      const orderId = orderResult.rows[0].id

      // Insert order items
      for (const item of data.items) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity) 
           VALUES ($1, $2, $3)`,
          [orderId, item.productId, item.quantity]
        )
      }

      // Commit transaction
      await client.query('COMMIT')

      return NextResponse.json({ 
        success: true, 
        message: 'Order placed successfully',
        orderId 
      })
    } catch (error) {
      // Rollback transaction on error
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error processing order:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to process order' 
      },
      { status: 500 }
    )
  }
}