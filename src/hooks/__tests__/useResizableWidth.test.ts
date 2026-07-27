import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import type { KeyboardEvent, PointerEvent } from 'react'
import { useResizableWidth } from '../useResizableWidth'

function makePointerEvent(clientX: number, pointerId = 1) {
  const currentTarget = {
    setPointerCapture: vi.fn(),
    releasePointerCapture: vi.fn(),
  }
  return { clientX, pointerId, currentTarget } as unknown as PointerEvent<HTMLDivElement>
}

function makeKeyboardEvent(key: string) {
  return { key, preventDefault: vi.fn() } as unknown as KeyboardEvent<HTMLDivElement>
}

const OPTIONS = { storageKey: 'test-sidebar-width', defaultWidth: 240, minWidth: 180, maxWidth: 420 }

describe('useResizableWidth', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts at defaultWidth when nothing is stored', () => {
    const { result } = renderHook(() => useResizableWidth(OPTIONS))
    expect(result.current.width).toBe(240)
  })

  it('reads and clamps an out-of-range stored width', () => {
    localStorage.setItem('test-sidebar-width', '999')
    const { result } = renderHook(() => useResizableWidth(OPTIONS))
    expect(result.current.width).toBe(420)
  })

  it('drags to a new width within bounds', () => {
    const { result } = renderHook(() => useResizableWidth(OPTIONS))

    act(() => result.current.handlePointerDown(makePointerEvent(100)))
    act(() => result.current.handlePointerMove(makePointerEvent(160)))

    expect(result.current.width).toBe(300)
  })

  it('clamps drags past the max width', () => {
    const { result } = renderHook(() => useResizableWidth(OPTIONS))

    act(() => result.current.handlePointerDown(makePointerEvent(0)))
    act(() => result.current.handlePointerMove(makePointerEvent(1000)))

    expect(result.current.width).toBe(420)
  })

  it('clamps drags past the min width', () => {
    const { result } = renderHook(() => useResizableWidth(OPTIONS))

    act(() => result.current.handlePointerDown(makePointerEvent(0)))
    act(() => result.current.handlePointerMove(makePointerEvent(-1000)))

    expect(result.current.width).toBe(180)
  })

  it('ignores pointermove before a pointerdown has started a drag', () => {
    const { result } = renderHook(() => useResizableWidth(OPTIONS))

    act(() => result.current.handlePointerMove(makePointerEvent(500)))

    expect(result.current.width).toBe(240)
  })

  it('stops responding to pointermove after pointerup', () => {
    const { result } = renderHook(() => useResizableWidth(OPTIONS))

    act(() => result.current.handlePointerDown(makePointerEvent(0)))
    act(() => result.current.handlePointerUp(makePointerEvent(0)))
    act(() => result.current.handlePointerMove(makePointerEvent(200)))

    expect(result.current.width).toBe(240)
  })

  it('ArrowRight nudges the width up by a fixed step, clamped to max', () => {
    const { result } = renderHook(() => useResizableWidth(OPTIONS))

    act(() => result.current.handleKeyDown(makeKeyboardEvent('ArrowRight')))

    expect(result.current.width).toBe(256)
  })

  it('ArrowLeft nudges the width down by a fixed step, clamped to min', () => {
    const { result } = renderHook(() => useResizableWidth(OPTIONS))

    act(() => result.current.handleKeyDown(makeKeyboardEvent('ArrowLeft')))

    expect(result.current.width).toBe(224)
  })

  it('resetWidth returns to defaultWidth', () => {
    const { result } = renderHook(() => useResizableWidth(OPTIONS))

    act(() => result.current.handlePointerDown(makePointerEvent(0)))
    act(() => result.current.handlePointerMove(makePointerEvent(100)))
    expect(result.current.width).toBe(340)

    act(() => result.current.resetWidth())

    expect(result.current.width).toBe(240)
  })

  it('persists width changes to localStorage', () => {
    const { result } = renderHook(() => useResizableWidth(OPTIONS))

    act(() => result.current.handleKeyDown(makeKeyboardEvent('ArrowRight')))

    expect(localStorage.getItem('test-sidebar-width')).toBe('256')
  })
})
