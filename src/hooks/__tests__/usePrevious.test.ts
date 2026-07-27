import { describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePrevious } from '../usePrevious'

describe('usePrevious', () => {
  it('returns undefined on the first render', () => {
    const { result } = renderHook(() => usePrevious('a'))
    expect(result.current).toBeUndefined()
  })

  it('returns the value from the previous render after a re-render', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'b' })
    expect(result.current).toBe('a')

    rerender({ value: 'c' })
    expect(result.current).toBe('b')
  })

  it('does not update until a re-render happens, even if called again with the same value', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'a' })
    expect(result.current).toBe('a')
  })
})
