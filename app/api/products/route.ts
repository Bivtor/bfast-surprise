import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Initialize the products table if it doesn't exist
async function initializeProductsTable() {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price INTEGER NOT NULL,
        image_url VARCHAR(255),
        available BOOLEAN DEFAULT true
      )
    `)

    // Check if products exist
    const { rows } = await client.query('SELECT COUNT(*) FROM products')
    if (rows[0].count === '0') {
      // Insert sample products
      await client.query(`
        INSERT INTO products (name, description, price, image_url, available)
        VALUES 
        ('Continental Breakfast', 'A classic spread of croissants, jam, fresh fruit, and coffee', 2499, '/breakfast1.jpg', true),
        ('American Breakfast', 'Pancakes, eggs, bacon, and fresh orange juice', 2699, '/breakfast2.jpg', true),
        ('Healthy Start', 'Acai bowl, granola, fresh berries, and green tea', 2299, '/breakfast3.jpg', true)
      `)
    }
  } finally {
    client.release()
  }
}

// Initialize table when the server starts
initializeProductsTable().catch(console.error)

export async function GET() {
  try {
    const client = await pool.connect()
    try {
      const result = await client.query('SELECT * FROM products WHERE available = true')
      return NextResponse.json(result.rows)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}