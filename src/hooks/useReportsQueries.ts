import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchReportHistory, generateReport } from '../api/reports'

export function useReportHistoryQuery() {
  return useQuery({
    queryKey: ['reports', 'history'],
    queryFn: fetchReportHistory,
  })
}

// The first *mutation* in this app - everywhere else (useAnalyticsQueries)
// only ever reads data with useQuery. Mutations get their own hook because
// they represent an action with a result (isPending/isError/isSuccess for
// that one action), rather than a piece of server state to keep in sync.
export function useGenerateReportMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: generateReport,
    onSuccess: () => {
      // Refetching the whole list is simpler than manually splicing the
      // new record into the cache, and stays correct even if the history
      // query were ever sorted/paginated server-side in ways this
      // component doesn't know about.
      queryClient.invalidateQueries({ queryKey: ['reports', 'history'] })
    },
  })
}
