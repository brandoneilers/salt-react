import { beforeEach, describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useDensity } from '../useDensity'

const STORAGE_KEY = 'salt-dashboard-density'

describe('useDensity', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('defaults to medium when nothing is stored', () => {
    const { result } = renderHook(() => useDensity())
    expect(result.current.density).toBe('medium')
  })

  it('reads a previously stored valid density', () => {
    localStorage.setItem(STORAGE_KEY, 'high')
    const { result } = renderHook(() => useDensity())
    expect(result.current.density).toBe('high')
  })

  it('falls back to medium if the stored value is not a recognised density', () => {
    localStorage.setItem(STORAGE_KEY, 'ludicrous')
    const { result } = renderHook(() => useDensity())
    expect(result.current.density).toBe('medium')
  })

  it('updates state and persists when setDensity is called', () => {
    const { result } = renderHook(() => useDensity())

    act(() => {
      result.current.setDensity('touch')
    })

    expect(result.current.density).toBe('touch')
    expect(localStorage.getItem(STORAGE_KEY)).toBe('touch')
  })
})
