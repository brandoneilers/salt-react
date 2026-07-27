export interface TrafficPoint {
  date: string
  visitors: number
}

export interface DeviceShare {
  device: string
  value: number
}

export interface FunnelStage {
  stage: string
  value: number
}

// Fakes real network latency so the same loading states you'd see against a
// real backend show up here too. useQuery doesn't know or care whether the
// promise it's awaiting came from fetch() or, as here, a plain timer.
function delay<T>(value: T, ms: number) {
  return new Promise<T>((resolve) => setTimeout(() => resolve(value), ms))
}

export async function fetchTraffic(): Promise<TrafficPoint[]> {
  const today = new Date()
  const points = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() - (13 - i))
    const trend = i * 12
    const noise = Math.round(Math.random() * 300)
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      visitors: 800 + trend + noise,
    }
  })
  return delay(points, 700)
}

export async function fetchDeviceBreakdown(): Promise<DeviceShare[]> {
  return delay(
    [
      { device: 'Desktop', value: 54 },
      { device: 'Mobile', value: 38 },
      { device: 'Tablet', value: 8 },
    ],
    500,
  )
}

// Deliberately fails about a third of the time, so there's a real error
// state to see (and retry) instead of only ever the happy path.
export async function fetchFunnel(): Promise<FunnelStage[]> {
  await delay(null, 600)
  if (Math.random() < 0.35) {
    throw new Error('Failed to load funnel data - the analytics service timed out.')
  }
  return [
    { stage: 'Visits', value: 12400 },
    { stage: 'Signups', value: 3100 },
    { stage: 'Purchases', value: 640 },
  ]
}
