import { useQuery } from '@tanstack/react-query'
import { fetchTicketMetrics, fetchTickets } from '../api/tickets'

export function useTicketMetricsQuery() {
  return useQuery({ queryKey: ['tickets', 'metrics'], queryFn: fetchTicketMetrics })
}

export function useTicketsQuery() {
  return useQuery({ queryKey: ['tickets', 'rows'], queryFn: fetchTickets })
}
