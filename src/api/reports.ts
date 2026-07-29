export const REPORT_TYPES = ['Revenue Summary', 'User Activity', 'Conversion Funnel', 'Device Breakdown'] as const
export type ReportType = (typeof REPORT_TYPES)[number]

export interface ReportRecord {
  id: string
  name: string
  type: ReportType
  generatedAt: string
  status: 'Ready' | 'Failed'
  sizeKb: number
}

function delay<T>(value: T, ms: number) {
  return new Promise<T>((resolve) => setTimeout(() => resolve(value), ms))
}

function formatTimestamp(date: Date) {
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

// Unlike analytics.ts's endpoints (which are stateless - they just generate
// fresh random data on every call), this needs to actually remember reports
// across calls: generateReport() below has to persist what it creates so a
// subsequent fetchReportHistory() (triggered by invalidating the query
// after the mutation succeeds) sees it. A module-level array is the
// simplest "fake database" for that.
let reportHistory: ReportRecord[] = Array.from({ length: 22 }, (_, i) => {
  const type = REPORT_TYPES[i % REPORT_TYPES.length]
  const date = new Date()
  date.setDate(date.getDate() - i * 3)
  return {
    id: `seed-${i}`,
    name: `${type} — ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
    type,
    generatedAt: formatTimestamp(date),
    status: 'Ready',
    sizeKb: 80 + Math.round(Math.random() * 420),
  }
})

export async function fetchReportHistory(): Promise<ReportRecord[]> {
  return delay([...reportHistory], 500)
}

// Deliberately fails about 1 in 5 times, so the mutation's error path (a
// toast, not a full page error state - generating a report is a discrete
// action, not page content) has something real to show.
export async function generateReport(type: ReportType): Promise<ReportRecord> {
  await delay(null, 1200)

  if (Math.random() < 0.2) {
    throw new Error(`Failed to generate the ${type} report - the export service timed out.`)
  }

  const now = new Date()
  const record: ReportRecord = {
    id: `${now.getTime()}`,
    name: `${type} — ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
    type,
    generatedAt: formatTimestamp(now),
    status: 'Ready',
    sizeKb: 80 + Math.round(Math.random() * 420),
  }
  reportHistory = [record, ...reportHistory]
  return record
}
