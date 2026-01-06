// Error Monitoring and Analytics Utilities
// Placeholder for Sentry, LogRocket, or similar services

// Types for error reporting
interface ErrorContext {
  userId?: string
  page?: string
  action?: string
  metadata?: Record<string, unknown>
}

interface PerformanceMetric {
  name: string
  value: number
  unit: 'ms' | 's' | 'bytes' | 'count'
}

// Check if we're in production
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

/**
 * Initialize error monitoring
 * Call this in your app entry point
 * 
 * To enable Sentry:
 * 1. npm install @sentry/nextjs
 * 2. Set NEXT_PUBLIC_SENTRY_DSN in .env
 * 3. Uncomment the Sentry initialization below
 */
export function initMonitoring(): void {
  if (!IS_PRODUCTION) {
    console.log('[Monitoring] Skipping initialization in development')
    return
  }

  // Sentry initialization (uncomment when ready)
  /*
  import * as Sentry from '@sentry/nextjs'
  
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: process.env.NODE_ENV,
    beforeSend(event) {
      // Filter out sensitive data
      if (event.request?.headers) {
        delete event.request.headers['authorization']
        delete event.request.headers['cookie']
      }
      return event
    },
  })
  */

  console.log('[Monitoring] Initialized for production')
}

/**
 * Capture an error with context
 */
export function captureError(error: Error, context?: ErrorContext): void {
  // Always log to console
  console.error('[Error]', error.message, context)

  if (!IS_PRODUCTION) return

  // Sentry capture (uncomment when ready)
  /*
  import * as Sentry from '@sentry/nextjs'
  
  Sentry.withScope((scope) => {
    if (context?.userId) scope.setUser({ id: context.userId })
    if (context?.page) scope.setTag('page', context.page)
    if (context?.action) scope.setTag('action', context.action)
    if (context?.metadata) scope.setExtras(context.metadata)
    
    Sentry.captureException(error)
  })
  */
}

/**
 * Capture a message/event
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
  console.log(`[${level.toUpperCase()}]`, message)

  if (!IS_PRODUCTION) return

  // Sentry capture (uncomment when ready)
  /*
  import * as Sentry from '@sentry/nextjs'
  Sentry.captureMessage(message, level)
  */
}

/**
 * Track a performance metric
 */
export function trackMetric(metric: PerformanceMetric): void {
  console.log('[Metric]', `${metric.name}: ${metric.value}${metric.unit}`)

  if (!IS_PRODUCTION) return

  // Custom metrics can be sent to your analytics service
  // Example: Vercel Analytics, Google Analytics, etc.
}

/**
 * Set user context for error tracking
 */
export function setUserContext(user: { id: string; email?: string }): void {
  if (!IS_PRODUCTION) return

  // Sentry set user (uncomment when ready)
  /*
  import * as Sentry from '@sentry/nextjs'
  Sentry.setUser({ id: user.id, email: user.email })
  */
}

/**
 * Clear user context (on logout)
 */
export function clearUserContext(): void {
  if (!IS_PRODUCTION) return

  // Sentry clear user (uncomment when ready)
  /*
  import * as Sentry from '@sentry/nextjs'
  Sentry.setUser(null)
  */
}

/**
 * Wrap an async function with error capture
 */
export function withErrorCapture<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: ErrorContext
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      captureError(error as Error, context)
      throw error
    }
  }) as T
}

/**
 * React Error Boundary helper
 * Use in your error.tsx or custom error boundaries
 */
export function handleErrorBoundary(error: Error, errorInfo: { componentStack?: string }): void {
  captureError(error, {
    action: 'error_boundary',
    metadata: {
      componentStack: errorInfo.componentStack,
    },
  })
}

