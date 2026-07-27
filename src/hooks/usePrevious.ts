import { useEffect, useRef } from 'react'

/**
 * Remembers the value a piece of state had on the *previous* render.
 *
 * useRef gives you a mutable box - `{ current: ... }` - that persists across
 * renders WITHOUT causing a re-render when you write to it (unlike
 * useState). That's exactly what's needed here: we want to stash the
 * incoming value somewhere that survives to the next render, but writing it
 * shouldn't itself trigger another render.
 *
 * The effect below has no dependency array, so it runs after every render.
 * On render N it still returns whatever was stored during render N-1's
 * effect (effects run after the render/return, so the write "lags" the
 * read by one render) - which is exactly what "previous value" means.
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)

  useEffect(() => {
    ref.current = value
  })

  return ref.current
}
