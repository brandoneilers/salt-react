import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { createTestQueryClient } from '../../test/renderWithProviders'
import { useReportHistoryQuery, useGenerateReportMutation } from '../useReportsQueries'
import * as api from '../../api/reports'
import type { ReportRecord } from '../../api/reports'

const REPORT: ReportRecord = {
  id: '1',
  name: 'Revenue Summary — Jan 1, 2026',
  type: 'Revenue Summary',
  generatedAt: 'Jan 1, 9:00 AM',
  status: 'Ready',
  sizeKb: 120,
}

describe('useReportsQueries', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('useReportHistoryQuery resolves with whatever fetchReportHistory returns', async () => {
    vi.spyOn(api, 'fetchReportHistory').mockResolvedValue([REPORT])
    const queryClient = createTestQueryClient()

    const { result } = renderHook(() => useReportHistoryQuery(), {
      wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([REPORT])
  })

  it('useGenerateReportMutation invalidates the history query on success, triggering a refetch', async () => {
    const fetchSpy = vi.spyOn(api, 'fetchReportHistory').mockResolvedValue([REPORT])
    vi.spyOn(api, 'generateReport').mockResolvedValue(REPORT)
    const queryClient = createTestQueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result: historyResult } = renderHook(() => useReportHistoryQuery(), { wrapper })
    await waitFor(() => expect(historyResult.current.isSuccess).toBe(true))
    expect(fetchSpy).toHaveBeenCalledTimes(1)

    const { result: mutationResult } = renderHook(() => useGenerateReportMutation(), { wrapper })
    mutationResult.current.mutate('Revenue Summary')

    await waitFor(() => expect(mutationResult.current.isSuccess).toBe(true))
    // The mutation's onSuccess calls invalidateQueries, which should trigger
    // exactly one more fetch of the (still-mounted) history query.
    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(2))
  })

  it('useGenerateReportMutation surfaces the error from a failed generateReport call', async () => {
    vi.spyOn(api, 'generateReport').mockRejectedValue(new Error('export service timed out'))
    const queryClient = createTestQueryClient()

    const { result } = renderHook(() => useGenerateReportMutation(), {
      wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
    })

    result.current.mutate('Revenue Summary')

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toEqual(new Error('export service timed out'))
  })
})
