import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { env } from '@/lib/env'

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  try {
    const adminDb = createAdminClient();

    // Health check query - using a fast count query
    const { count, error } = await adminDb
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Health check DB error:', error);
      return NextResponse.json(
        {
          status: 'degraded',
          database: 'unavailable',
        },
        { status: 503 }
      )
    }

    const durationMs = Date.now() - startTime;
    const memory = process.memoryUsage();

    return NextResponse.json(
      {
        status: 'ok',
        database: 'connected',
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version || '1.0.0',
        metrics: {
          responseTimeMs: durationMs,
          memoryUsageMb: Math.round(memory.heapUsed / 1024 / 1024),
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Health check fatal error:', err);
    return NextResponse.json(
      {
        status: 'error',
        database: 'unknown',
      },
      { status: 500 }
    )
  }
}
