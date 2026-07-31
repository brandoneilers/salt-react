export interface TicketRow {
  id: string
  title: string
  service: string
  assignee: string
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  severity: 'Sev 1' | 'Sev 2' | 'Sev 3' | 'Sev 4'
  status: 'Open' | 'In Progress' | 'Resolved' | 'Escalated'
  createdAt: string
  updatedAt: string
  updatedAtValue: number
  resolutionHours: number
  priorityRank: number
}

export interface TicketMetricPoint {
  day: string
  count: number
}

export interface TicketSeverityBreakdown {
  severity: string
  count: number
}

export interface TicketResolutionMetric {
  service: string
  avgHours: number
}

export interface TicketMetrics {
  volume: TicketMetricPoint[]
  severity: TicketSeverityBreakdown[]
  resolution: TicketResolutionMetric[]
}

function delay<T>(value: T, ms: number) {
  return new Promise<T>((resolve) => setTimeout(() => resolve(value), ms))
}

export async function fetchTicketMetrics(): Promise<TicketMetrics> {
  return delay(
    {
      volume: [
        { day: 'Mon', count: 18 },
        { day: 'Tue', count: 24 },
        { day: 'Wed', count: 21 },
        { day: 'Thu', count: 31 },
        { day: 'Fri', count: 27 },
        { day: 'Sat', count: 16 },
        { day: 'Sun', count: 13 },
      ],
      severity: [
        { severity: 'Sev 1', count: 4 },
        { severity: 'Sev 2', count: 11 },
        { severity: 'Sev 3', count: 23 },
        { severity: 'Sev 4', count: 9 },
      ],
      resolution: [
        { service: 'Payments', avgHours: 4.2 },
        { service: 'Identity', avgHours: 6.8 },
        { service: 'Search', avgHours: 2.7 },
        { service: 'Gateway', avgHours: 5.5 },
      ],
    },
    650,
  )
}

export async function fetchTickets(): Promise<TicketRow[]> {
  return delay(
    [
      {
        id: 'INC-1042',
        title: 'API gateway latency spike',
        service: 'Gateway',
        assignee: 'Mina Patel',
        priority: 'Critical',
        severity: 'Sev 1',
        status: 'Open',
        createdAt: '2026-07-30',
        updatedAt: '12m ago',
        updatedAtValue: 12,
        resolutionHours: 2.8,
        priorityRank: 1,
      },
      {
        id: 'INC-1038',
        title: 'Database failover review',
        service: 'Data',
        assignee: 'Nolan Brooks',
        priority: 'High',
        severity: 'Sev 2',
        status: 'In Progress',
        createdAt: '2026-07-29',
        updatedAt: '45m ago',
        updatedAtValue: 45,
        resolutionHours: 4.4,
        priorityRank: 2,
      },
      {
        id: 'INC-1029',
        title: 'SAML login timeout',
        service: 'Identity',
        assignee: 'Sara Kim',
        priority: 'High',
        severity: 'Sev 2',
        status: 'Escalated',
        createdAt: '2026-07-28',
        updatedAt: '2h ago',
        updatedAtValue: 120,
        resolutionHours: 7.2,
        priorityRank: 2,
      },
      {
        id: 'INC-1017',
        title: 'Search indexing backlog',
        service: 'Search',
        assignee: 'Jon Alvarez',
        priority: 'Medium',
        severity: 'Sev 3',
        status: 'Resolved',
        createdAt: '2026-07-27',
        updatedAt: '4h ago',
        updatedAtValue: 240,
        resolutionHours: 1.6,
        priorityRank: 3,
      },
      {
        id: 'INC-1009',
        title: 'Webhook retries not draining',
        service: 'Payments',
        assignee: 'Alicia Singh',
        priority: 'Medium',
        severity: 'Sev 3',
        status: 'Open',
        createdAt: '2026-07-26',
        updatedAt: '1d ago',
        updatedAtValue: 1440,
        resolutionHours: 3.1,
        priorityRank: 3,
      },
      {
        id: 'INC-0992',
        title: 'Billing export checksum issue',
        service: 'Payments',
        assignee: 'Allison Reed',
        priority: 'Low',
        severity: 'Sev 4',
        status: 'Resolved',
        createdAt: '2026-07-24',
        updatedAt: '2d ago',
        updatedAtValue: 2880,
        resolutionHours: 0.9,
        priorityRank: 4,
      },
      {
        id: 'INC-0983',
        title: 'Mobile app cache sync delay',
        service: 'Mobile',
        assignee: 'Patrick Osei',
        priority: 'Low',
        severity: 'Sev 4',
        status: 'Open',
        createdAt: '2026-07-21',
        updatedAt: '3d ago',
        updatedAtValue: 4320,
        resolutionHours: 1.2,
        priorityRank: 4,
      },
    ],
    700,
  )
}
