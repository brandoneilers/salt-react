import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'

interface UseResizableWidthOptions {
  storageKey: string
  defaultWidth: number
  minWidth: number
  maxWidth: number
}

function readStoredWidth(storageKey: string, fallback: number, min: number, max: number) {
  const stored = Number(localStorage.getItem(storageKey))
  if (!Number.isFinite(stored) || stored <= 0) return fallback
  return Math.min(max, Math.max(min, stored))
}

export function useResizableWidth({ storageKey, defaultWidth, minWidth, maxWidth }: UseResizableWidthOptions) {
  const [width, setWidth] = useState(() => readStoredWidth(storageKey, defaultWidth, minWidth, maxWidth))
  const [isDragging, setIsDragging] = useState(false)

  // `dragStartRef` holds per-gesture data read inside the move handler.
  // `isDraggingRef` mirrors the `isDragging` state but is read from that
  // same handler instead of the state - state updates are asynchronous, so
  // a pointermove that fires before React re-renders after pointerdown
  // would otherwise see a stale `isDragging === false` and silently ignore
  // the drag. Reading a ref sidesteps that render-timing race entirely.
  // `isDragging` (the state) still exists purely to drive the CSS class.
  const dragStartRef = useRef({ pointerX: 0, startWidth: 0 })
  const isDraggingRef = useRef(false)

  useEffect(() => {
    localStorage.setItem(storageKey, String(width))
  }, [storageKey, width])

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      // Pointer capture routes every subsequent move/up event to this
      // element for the rest of the gesture, even once the cursor moves
      // outside the (intentionally thin) handle - without it, dragging
      // faster than the handle is wide would drop the drag. It can throw
      // (e.g. the pointer was never "activated" through a trusted input
      // event) - that's a nice-to-have, not something the drag itself
      // should depend on, so a failure here shouldn't abort the resize.
      try {
        event.currentTarget.setPointerCapture(event.pointerId)
      } catch {
        // Capture unavailable for this pointer - dragging still works via
        // normal event bubbling as long as the cursor stays over the handle.
      }
      dragStartRef.current = { pointerX: event.clientX, startWidth: width }
      isDraggingRef.current = true
      setIsDragging(true)
    },
    [width],
  )

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return
      const delta = event.clientX - dragStartRef.current.pointerX
      const next = Math.min(maxWidth, Math.max(minWidth, dragStartRef.current.startWidth + delta))
      setWidth(next)
    },
    [minWidth, maxWidth],
  )

  const handlePointerUp = useCallback((event: PointerEvent<HTMLDivElement>) => {
    try {
      event.currentTarget.releasePointerCapture(event.pointerId)
    } catch {
      // No-op if this pointer was never captured (see handlePointerDown).
    }
    isDraggingRef.current = false
    setIsDragging(false)
  }, [])

  // Keyboard equivalent for the drag gesture - a mouse-only resize handle
  // is unusable for anyone navigating by keyboard.
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const step = 16
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setWidth((prev) => Math.max(minWidth, prev - step))
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        setWidth((prev) => Math.min(maxWidth, prev + step))
      }
    },
    [minWidth, maxWidth],
  )

  const resetWidth = useCallback(() => {
    setWidth(defaultWidth)
  }, [defaultWidth])

  return { width, isDragging, handlePointerDown, handlePointerMove, handlePointerUp, handleKeyDown, resetWidth }
}
