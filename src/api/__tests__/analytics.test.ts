import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchTraffic, fetchDeviceBreakdown, fetchFunnel } from '../analytics'

describe('analytics API (simulated backend)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('fetchTraffic', () => {
    it('resolves with 14 days of positive visitor counts', async () => {
      const promise = fetchTraffic()
      await vi.advanceTimersByTimeAsync(700)
      const points = await promise

      expect(points).toHaveLength(14)
      for (const point of points) {
        expect(typeof point.date).toBe('string')
        expect(point.visitors).toBeGreaterThan(0)
      }
    })

    it('trends upward across the 14 days', async () => {
      // Zero out the random noise term so only the deterministic upward
      // trend remains - otherwise a "later day is bigger" assertion would
      // be flaky by design.
      vi.spyOn(Math, 'random').mockReturnValue(0)

      const promise = fetchTraffic()
      await vi.advanceTimersByTimeAsync(700)
      const points = await promise

      expect(points[13].visitors).toBeGreaterThan(points[0].visitors)
    })
  })

  describe('fetchDeviceBreakdown', () => {
    it('resolves with the fixed device share breakdown', async () => {
      const promise = fetchDeviceBreakdown()
      await vi.advanceTimersByTimeAsync(500)
      const shares = await promise

      expect(shares).toEqual([
        { device: 'Desktop', value: 54 },
        { device: 'Mobile', value: 38 },
        { device: 'Tablet', value: 8 },
      ])
    })
  })

  describe('fetchFunnel', () => {
    it('rejects with the timeout error when the simulated failure branch is hit', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0) // < 0.35 -> throws

      const promise = fetchFunnel()
      // Attach the rejection assertion before advancing timers - the promise
      // settles as soon as the timer fires, and a rejection with no handler
      // attached yet is reported as an unhandled rejection even if one shows
      // up a statement later.
      const assertion = expect(promise).rejects.toThrow(
        'Failed to load funnel data - the analytics service timed out.',
      )
      await vi.advanceTimersByTimeAsync(600)
      await assertion
    })

    it('resolves with funnel stages when the failure branch is not hit', async () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.9) // >= 0.35 -> resolves

      const promise = fetchFunnel()
      await vi.advanceTimersByTimeAsync(600)

      await expect(promise).resolves.toEqual([
        { stage: 'Visits', value: 12400 },
        { stage: 'Signups', value: 3100 },
        { stage: 'Purchases', value: 640 },
      ])
    })
  })
})
