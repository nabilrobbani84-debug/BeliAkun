import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Simple health check query
    const { error } = await supabase.from('categories').select('id').limit(1)

    if (error) {
      return NextResponse.json(
        {
          status: 'degraded',
          database: 'unavailable',
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      {
        status: 'error',
        database: 'unknown',
      },
      { status: 500 }
    )
  }
}
