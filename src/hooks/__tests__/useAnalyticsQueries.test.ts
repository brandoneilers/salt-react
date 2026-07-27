import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClientTestWrapper } from '../../test/renderWithProviders'
import { useTrafficQuery, useDeviceBreakdownQuery, useFunnelQuery } from '../useAnalyticsQueries'
import * as api from '../../api/analytics'

describe('useAnalyticsQueries', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('useTrafficQuery resolves with whatever fetchTraffic returns', async () => {
    const points = [{ date: 'Jan 1', visitors: 100 }]
    vi.spyOn(api, 'fetchTraffic').mockResolvedValue(points)

    const { result } = renderHook(() => useTrafficQuery(), { wrapper: QueryClientTestWrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(points)
  })

  it('useDeviceBreakdownQuery resolves with whatever fetchDeviceBreakdown returns', async () => {
    const shares = [{ device: 'Desktop', value: 54 }]
    vi.spyOn(api, 'fetchDeviceBreakdown').mockResolvedValue(shares)

    const { result } = renderHook(() => useDeviceBreakdownQuery(), { wrapper: QueryClientTestWrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(shares)
  })

  it('useFunnelQuery resolves with whatever fetchFunnel returns', async () => {
    const stages = [{ stage: 'Visits', value: 12400 }]
    vi.spyOn(api, 'fetchFunnel').mockResolvedValue(stages)

    const { result } = renderHook(() => useFunnelQuery(), { wrapper: QueryClientTestWrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(stages)
  })

  it('useFunnelQuery does not retry on failure (retry: false)', async () => {
    const fetchFunnelSpy = vi.spyOn(api, 'fetchFunnel').mockRejectedValue(new Error('boom'))

    const { result } = renderHook(() => useFunnelQuery(), { wrapper: QueryClientTestWrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))
    // TanStack Query's default is 3 retries; if retry:false weren't wired
    // up this would be called 4 times (1 initial + 3 retries) instead of 1.
    expect(fetchFunnelSpy).toHaveBeenCalledTimes(1)
  })
})
