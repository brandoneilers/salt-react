import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResizeHandle } from '../ResizeHandle'

const noop = () => {}

describe('ResizeHandle', () => {
  it('exposes separator semantics with the current width as the value', () => {
    render(
      <ResizeHandle
        width={280}
        minWidth={180}
        maxWidth={420}
        isDragging={false}
        onPointerDown={noop}
        onPointerMove={noop}
        onPointerUp={noop}
        onKeyDown={noop}
      />,
    )

    const handle = screen.getByRole('separator', { name: 'Resize sidebar' })
    expect(handle).toHaveAttribute('aria-orientation', 'vertical')
    expect(handle).toHaveAttribute('aria-valuenow', '280')
    expect(handle).toHaveAttribute('aria-valuemin', '180')
    expect(handle).toHaveAttribute('aria-valuemax', '420')
    expect(handle).toHaveAttribute('tabindex', '0')
  })

  it('adds the active class while dragging, and not otherwise', () => {
    const { rerender } = render(
      <ResizeHandle
        width={280}
        minWidth={180}
        maxWidth={420}
        isDragging={false}
        onPointerDown={noop}
        onPointerMove={noop}
        onPointerUp={noop}
        onKeyDown={noop}
      />,
    )
    expect(screen.getByRole('separator')).not.toHaveClass('resize-handle-active')

    rerender(
      <ResizeHandle
        width={280}
        minWidth={180}
        maxWidth={420}
        isDragging={true}
        onPointerDown={noop}
        onPointerMove={noop}
        onPointerUp={noop}
        onKeyDown={noop}
      />,
    )
    expect(screen.getByRole('separator')).toHaveClass('resize-handle-active')
  })

  it('forwards pointer and keyboard events to the given handlers', async () => {
    const onPointerDown = vi.fn()
    const onKeyDown = vi.fn()
    render(
      <ResizeHandle
        width={280}
        minWidth={180}
        maxWidth={420}
        isDragging={false}
        onPointerDown={onPointerDown}
        onPointerMove={noop}
        onPointerUp={noop}
        onKeyDown={onKeyDown}
      />,
    )

    const handle = screen.getByRole('separator')
    handle.focus()
    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }))

    expect(onKeyDown).toHaveBeenCalledTimes(1)
  })
})
