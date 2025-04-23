import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function GET() {
  try {
    const client = await pool.connect()
    try {
      const result = await client.query(`
        SELECT 
          p.id,
          p.name,
          p.description,
          p.price_cents,
          p.image_url,
          p.available,
          COALESCE(
            (
              SELECT json_agg(
                json_build_object(
                  'id', da.id,
                  'name', da.name,
                  'price_cents', da.price_cents
                )
              )
              FROM product_additions_bridge pab
              JOIN dim_additions da ON pab.addition_id = da.id
              WHERE pab.product_id = p.id
            ),
            '[]'::json
          ) as additions,
          COALESCE(
            (
              SELECT json_agg(
                json_build_object(
                  'id', ds.id,
                  'name', ds.name
                )
              )
              FROM product_subtractions_bridge psb
              JOIN dim_subtractions ds ON psb.subtraction_id = ds.id
              WHERE psb.product_id = p.id
            ),
            '[]'::json
          ) as subtractions
        FROM products p
        WHERE p.available = true
      `)
      
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