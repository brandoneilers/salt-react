import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useToast } from '../useToast'

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with no toast', () => {
    const { result } = renderHook(() => useToast())
    expect(result.current.toast).toBeNull()
  })

  it('showToast sets the message and status', () => {
    const { result } = renderHook(() => useToast())

    act(() => result.current.showToast('Saved', 'success'))

    expect(result.current.toast).toEqual({ message: 'Saved', status: 'success' })
  })

  it('defaults to a "success" status when none is given', () => {
    const { result } = renderHook(() => useToast())

    act(() => result.current.showToast('Done'))

    expect(result.current.toast?.status).toBe('success')
  })

  it('auto-dismisses after the configured delay', () => {
    const { result } = renderHook(() => useToast(1000))

    act(() => result.current.showToast('Saved'))
    expect(result.current.toast).not.toBeNull()

    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.toast).toBeNull()
  })

  it('dismiss clears the toast immediately', () => {
    const { result } = renderHook(() => useToast())

    act(() => result.current.showToast('Saved'))
    act(() => result.current.dismiss())

    expect(result.current.toast).toBeNull()
  })

  it('a new toast resets the auto-dismiss timer instead of being cut short by the previous one', () => {
    const { result } = renderHook(() => useToast(1000))

    act(() => result.current.showToast('First'))
    act(() => vi.advanceTimersByTime(700))
    act(() => result.current.showToast('Second'))
    // First toast's original timer would have fired at 1000ms; only 300ms
    // has passed since the second toast replaced it, so it should still be up.
    act(() => vi.advanceTimersByTime(300))

    expect(result.current.toast?.message).toBe('Second')
  })
})
