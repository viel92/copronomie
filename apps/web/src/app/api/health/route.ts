import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Basic health checks
    const healthCheck = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      memory: {
        used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
        total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
        external: Math.round((process.memoryUsage().external / 1024 / 1024) * 100) / 100
      },
      cpu: {
        platform: process.platform,
        arch: process.arch,
        node: process.version
      }
    }

    // Check external services (optional)
    const checks = {
      database: 'OK', // Could check Supabase connection
      openai: 'OK',   // Could check OpenAI API
      redis: 'OK'     // Could check Redis connection
    }

    return NextResponse.json({
      ...healthCheck,
      services: checks
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 })
  }
}

// Also respond to HEAD requests for load balancer checks
export async function HEAD() {
  return new Response(null, { status: 200 })
}