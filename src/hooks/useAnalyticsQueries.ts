import { useQuery } from '@tanstack/react-query'
import { fetchTraffic, fetchDeviceBreakdown, fetchFunnel } from '../api/analytics'

// Each hook pairs a unique `queryKey` (how TanStack Query indexes its cache -
// two components calling the same key share one cached result and one
// in-flight request) with a `queryFn` returning the promise to resolve.
// useQuery hands back { data, isLoading, isError, error, refetch, ... }
// instead of you wiring up that state by hand with useState + useEffect.

export function useTrafficQuery() {
  return useQuery({
    queryKey: ['analytics', 'traffic'],
    queryFn: fetchTraffic,
  })
}

export function useDeviceBreakdownQuery() {
  return useQuery({
    queryKey: ['analytics', 'devices'],
    queryFn: fetchDeviceBreakdown,
  })
}

export function useFunnelQuery() {
  return useQuery({
    queryKey: ['analytics', 'funnel'],
    queryFn: fetchFunnel,
    // This endpoint is deliberately flaky (see fetchFunnel). TanStack Query
    // retries failed queries 3x with backoff by default, which would mostly
    // hide the error state we want to see - turned off here and surfaced as
    // a manual "Try again" button instead, wired to the `refetch` this
    // hook returns.
    retry: false,
  })
}
