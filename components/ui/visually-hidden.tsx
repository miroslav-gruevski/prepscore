'use client'

import { ReactNode } from 'react'

/**
 * Visually hidden content for screen readers
 * Use for providing context that's visually implied but not stated
 */
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return (
    <span
      className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
      style={{ clip: 'rect(0, 0, 0, 0)' }}
    >
      {children}
    </span>
  )
}

/**
 * Announce dynamic content changes to screen readers
 * Use aria-live regions for status updates
 */
export function LiveRegion({
  children,
  mode = 'polite',
  atomic = true,
}: {
  children: ReactNode
  mode?: 'polite' | 'assertive'
  atomic?: boolean
}) {
  return (
    <div
      role="status"
      aria-live={mode}
      aria-atomic={atomic}
      className="sr-only"
    >
      {children}
    </div>
  )
}

