import type { KeyboardEvent, PointerEvent } from 'react'

interface ResizeHandleProps {
  width: number
  minWidth: number
  maxWidth: number
  isDragging: boolean
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void
  onPointerMove: (event: PointerEvent<HTMLDivElement>) => void
  onPointerUp: (event: PointerEvent<HTMLDivElement>) => void
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void
}

export function ResizeHandle({
  width,
  minWidth,
  maxWidth,
  isDragging,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: ResizeHandleProps) {
  return (
    <div
      className={isDragging ? 'resize-handle resize-handle-active' : 'resize-handle'}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onKeyDown={onKeyDown}
      // A resize handle between two panels is exactly what role="separator"
      // is for in the ARIA spec - and since it controls a size, it takes
      // the same aria-value* triad a slider would, so assistive tech can
      // announce the current width.
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize sidebar"
      aria-valuenow={width}
      aria-valuemin={minWidth}
      aria-valuemax={maxWidth}
      tabIndex={0}
    />
  )
}
