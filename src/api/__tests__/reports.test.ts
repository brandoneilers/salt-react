import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchReportHistory, generateReport } from '../reports'

describe('reports API (simulated backend)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('fetchReportHistory', () => {
    it('resolves with the seeded report history', async () => {
      const promise = fetchReportHistory()
      await vi.advanceTimersByTimeAsync(500)
      const reports = await promise

      expect(reports.length).toBeGreaterThan(0)
      for (const report of reports) {
        expect(report.status).toBe('Ready')
        expect(report.sizeKb).toBeGreaterThan(0)
      }
    })
  })

  describe('generateReport', () => {
    it('resolves with a new report of the requested type when the failure branch is not hit', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.9) // >= 0.2 -> resolves

      const promise = generateReport('User Activity')
      await vi.advanceTimersByTimeAsync(1200)
      const report = await promise

      expect(report.type).toBe('User Activity')
      expect(report.status).toBe('Ready')
      expect(report.name).toContain('User Activity')
    })

    it('rejects with a descriptive error when the simulated failure branch is hit', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0) // < 0.2 -> throws

      const promise = generateReport('Revenue Summary')
      const assertion = expect(promise).rejects.toThrow(
        'Failed to generate the Revenue Summary report - the export service timed out.',
      )
      await vi.advanceTimersByTimeAsync(1200)
      await assertion
    })

    it('persists the new report so a subsequent fetchReportHistory sees it', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.9)

      const generatePromise = generateReport('Device Breakdown')
      await vi.advanceTimersByTimeAsync(1200)
      const newReport = await generatePromise

      const historyPromise = fetchReportHistory()
      await vi.advanceTimersByTimeAsync(500)
      const history = await historyPromise

      expect(history[0]).toEqual(newReport)
    })
  })
})
