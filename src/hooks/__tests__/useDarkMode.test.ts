import { beforeEach, describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useDarkMode } from '../useDarkMode'

const STORAGE_KEY = 'salt-dashboard-dark-mode'

describe('useDarkMode', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('defaults to dark mode when nothing is stored', () => {
    const { result } = renderHook(() => useDarkMode())
    expect(result.current.darkMode).toBe(true)
  })

  it('reads a previously stored preference on mount', () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    const { result } = renderHook(() => useDarkMode())
    expect(result.current.darkMode).toBe(true)
  })

  it('toggleDarkMode flips the state', () => {
    const { result } = renderHook(() => useDarkMode())

    act(() => {
      result.current.toggleDarkMode()
    })

    expect(result.current.darkMode).toBe(false)
  })

  it('persists the new value to localStorage after toggling', () => {
    const { result } = renderHook(() => useDarkMode())

    act(() => {
      result.current.toggleDarkMode()
    })

    expect(localStorage.getItem(STORAGE_KEY)).toBe('false')
  })

  it('keeps a stable toggleDarkMode reference across re-renders', () => {
    const { result, rerender } = renderHook(() => useDarkMode())
    const first = result.current.toggleDarkMode
    rerender()
    expect(result.current.toggleDarkMode).toBe(first)
  })
})
