import { useMemo, useState } from 'react'
import {
  Button,
  Card,
  FlexLayout,
  Pagination,
  Paginator,
  StackLayout,
  Table,
  TableContainer,
  TBody,
  TD,
  THead,
  TH,
  TR,
  Text,
} from '@salt-ds/core'
import { SearchInput } from '@salt-ds/lab'
import { ArrowDownIcon, ArrowUpIcon, FilterIcon } from '@salt-ds/icons'
import { TicketMetricsCharts } from '../components/tickets/TicketMetricsCharts'
import { useTicketsQuery } from '../hooks/useTicketsQueries'

type SortKey = 'priorityRank' | 'updatedAtValue' | 'resolutionHours'

type PriorityFilter = 'All' | 'Critical' | 'High' | 'Medium' | 'Low'

type StatusFilter = 'All' | 'Open' | 'In Progress' | 'Resolved' | 'Escalated'

const PAGE_SIZE = 5

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'priorityRank', label: 'Priority' },
  { key: 'updatedAtValue', label: 'Updated' },
  { key: 'resolutionHours', label: 'Resolution (hrs)' },
]

const INITIAL_TICKETS = [
  {
    id: 'INC-1042',
    title: 'API gateway latency spike',
    service: 'Gateway',
    assignee: 'Mina Patel',
    priority: 'Critical' as const,
    severity: 'Sev 1' as const,
    status: 'Open' as const,
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
    priority: 'High' as const,
    severity: 'Sev 2' as const,
    status: 'In Progress' as const,
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
    priority: 'High' as const,
    severity: 'Sev 2' as const,
    status: 'Escalated' as const,
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
    priority: 'Medium' as const,
    severity: 'Sev 3' as const,
    status: 'Resolved' as const,
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
    priority: 'Medium' as const,
    severity: 'Sev 3' as const,
    status: 'Open' as const,
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
    priority: 'Low' as const,
    severity: 'Sev 4' as const,
    status: 'Resolved' as const,
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
    priority: 'Low' as const,
    severity: 'Sev 4' as const,
    status: 'Open' as const,
    createdAt: '2026-07-21',
    updatedAt: '3d ago',
    updatedAtValue: 4320,
    resolutionHours: 1.2,
    priorityRank: 4,
  },
]

export function TicketsPage() {
  const [search, setSearch] = useState('')
  const [priority, setPriority] = useState<PriorityFilter>('All')
  const [status, setStatus] = useState<StatusFilter>('All')
  const [sort, setSort] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
    key: 'priorityRank',
    direction: 'asc',
  })
  const [page, setPage] = useState(1)

  const { data: tickets = [], isLoading } = useTicketsQuery()
  const visibleSource = tickets.length > 0 ? tickets : INITIAL_TICKETS

  const filteredTickets = useMemo(() => {
    const term = search.trim().toLowerCase()
    return [...visibleSource]
      .filter((ticket) => {
        const matchesSearch =
          !term ||
          ticket.title.toLowerCase().includes(term) ||
          ticket.service.toLowerCase().includes(term) ||
          ticket.assignee.toLowerCase().includes(term)
        const matchesPriority = priority === 'All' || ticket.priority === priority
        const matchesStatus = status === 'All' || ticket.status === status
        return matchesSearch && matchesPriority && matchesStatus
      })
      .sort((a, b) => {
        const direction = sort.direction === 'asc' ? 1 : -1
        const aValue = a[sort.key]
        const bValue = b[sort.key]
        return direction * (aValue - bValue)
      })
  }, [priority, search, sort, visibleSource])

  const pageCount = Math.max(1, Math.ceil(filteredTickets.length / PAGE_SIZE))
  const visibleRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredTickets.slice(start, start + PAGE_SIZE)
  }, [filteredTickets, page])

  function toggleSort(key: SortKey) {
    setSort((prev) => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }))
  }

  function handlePageChange(nextPage: number) {
    setPage(Math.min(Math.max(nextPage, 1), pageCount))
  }

  return (
    <StackLayout gap={4}>
      <TicketMetricsCharts />

      <Card className="chart-panel">
        <StackLayout gap={3}>
          <FlexLayout justify="space-between" align="center" gap={2}>
            <StackLayout gap={0}>
              <Text styleAs="label" color="secondary">
                Active incident queue
              </Text>
              <Text>Filter and sort the operational work items below.</Text>
            </StackLayout>
            <Button appearance="bordered" aria-label="Ticket filters">
              <FilterIcon aria-hidden />
              Filters
            </Button>
          </FlexLayout>

          <FlexLayout gap={2} wrap>
            <SearchInput
              inputProps={{ placeholder: 'Search tickets or service' }}
              value={search}
              onChange={(_event, value) => {
                setSearch(value)
                setPage(1)
              }}
              onClear={() => {
                setSearch('')
                setPage(1)
              }}
              style={{ minWidth: 260 }}
            />
            <select
              aria-label="Filter by priority"
              value={priority}
              onChange={(event) => {
                setPriority(event.target.value as PriorityFilter)
                setPage(1)
              }}
              className="ticket-filter"
            >
              <option value="All">All priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              aria-label="Filter by status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as StatusFilter)
                setPage(1)
              }}
              className="ticket-filter"
            >
              <option value="All">All statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Escalated">Escalated</option>
            </select>
          </FlexLayout>

          <TableContainer>
            <Table zebra aria-label="Tickets">
              <THead>
                <TR>
                  <TH>Ticket</TH>
                  <TH>Service</TH>
                  <TH>Assignee</TH>
                  <TH>Status</TH>
                  {COLUMNS.map(({ key, label }) => {
                    const isActive = sort.key === key
                    return (
                      <TH key={key} aria-sort={isActive ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}>
                        <button type="button" className="sortable-header" onClick={() => toggleSort(key)}>
                          {label}
                          {isActive && (sort.direction === 'asc' ? <ArrowUpIcon size={1} aria-hidden /> : <ArrowDownIcon size={1} aria-hidden />)}
                        </button>
                      </TH>
                    )
                  })}
                </TR>
              </THead>
              <TBody>
                {visibleRows.map((ticket) => (
                  <TR key={ticket.id}>
                    <TD>
                      <StackLayout gap={0}>
                        <Text>{ticket.title}</Text>
                        <Text styleAs="label" color="secondary">
                          {ticket.id}
                        </Text>
                      </StackLayout>
                    </TD>
                    <TD>{ticket.service}</TD>
                    <TD>{ticket.assignee}</TD>
                    <TD>
                      <Text color="secondary">{ticket.status}</Text>
                    </TD>
                    <TD>
                      <Text>{ticket.priority}</Text>
                    </TD>
                    <TD>
                      <Text color="secondary">{ticket.updatedAt}</Text>
                    </TD>
                    <TD>
                      <Text>{ticket.resolutionHours}h</Text>
                    </TD>
                  </TR>
                ))}
                {!isLoading && visibleRows.length === 0 && (
                  <TR>
                    <TD colSpan={7}>
                      <Text color="secondary">No tickets match the current filters.</Text>
                    </TD>
                  </TR>
                )}
              </TBody>
            </Table>
          </TableContainer>

          <FlexLayout justify="end" gap={2}>
            <Button appearance="bordered" aria-label="Previous page" onClick={() => handlePageChange(page - 1)}>
              Previous
            </Button>
            <Pagination count={pageCount} page={page} onPageChange={(_event, newPage) => handlePageChange(newPage)}>
              <Paginator />
            </Pagination>
            <Button appearance="bordered" aria-label="Next page" onClick={() => handlePageChange(page + 1)}>
              Next
            </Button>
          </FlexLayout>
        </StackLayout>
      </Card>
    </StackLayout>
  )
}
