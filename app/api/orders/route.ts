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

      // Insert order items with their customizations
      for (const item of data.items) {
        // Insert main order item
        const itemResult = await client.query(
          `INSERT INTO order_items (
            order_id, 
            product_id, 
            quantity,
            note,
            item_price_cents
          ) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [
            orderId, 
            item.id, 
            item.quantity,
            item.note || '',
            item.price + (item.additions?.reduce((sum: number, addition: any) => sum + addition.price, 0) || 0)
          ]
        )

        const orderItemId = itemResult.rows[0].id

        // Insert additions if any
        if (item.additions?.length > 0) {
          for (const addition of item.additions) {
            await client.query(
              `INSERT INTO order_item_additions (
                order_item_id,
                addition_id,
                price_cents
              ) VALUES ($1, $2, $3)`,
              [orderItemId, addition.id, addition.price]
            )
          }
        }

        // Insert subtractions if any
        if (item.subtractions?.length > 0) {
          for (const subtraction of item.subtractions) {
            await client.query(
              `INSERT INTO order_item_subtractions (
                order_item_id,
                subtraction_id
              ) VALUES ($1, $2)`,
              [orderItemId, subtraction.id]
            )
          }
        }
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