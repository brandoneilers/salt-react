import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { LastUpdated } from '../LastUpdated'

describe('LastUpdated', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows "just now" immediately after mounting', () => {
    render(<LastUpdated />)
    expect(screen.getByText('Updated just now')).toBeInTheDocument()
  })

  it('counts up in seconds as time passes', () => {
    render(<LastUpdated />)

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(screen.getByText('Updated 3s ago')).toBeInTheDocument()
  })

  it('stops updating (and does not throw) after unmounting', () => {
    const { unmount } = render(<LastUpdated />)
    unmount()

    // If the interval weren't cleared on unmount, this would try to call
    // setState on an unmounted component and React would warn/throw.
    expect(() => {
      act(() => {
        vi.advanceTimersByTime(5000)
      })
    }).not.toThrow()
  })
})
