import { useMemo } from 'react'
import Highcharts from 'highcharts'
import { ResponsiveHighcharts } from '../ResponsiveHighcharts'
import { ChartCard } from '../ChartCard'
import { useFunnelQuery } from '../../hooks/useAnalyticsQueries'

export function FunnelChart() {
  const { data, isLoading, isError, error, refetch } = useFunnelQuery()

  const chartOptions = useMemo<Highcharts.Options>(
    () => ({
      chart: { type: 'bar', backgroundColor: 'transparent', height: 220, style: { fontFamily: 'inherit' } },
      title: { text: undefined },
      credits: { enabled: false },
      legend: { enabled: false },
      xAxis: {
        categories: data?.map((d) => d.stage) ?? [],
        lineColor: 'var(--salt-separable-primary-borderColor)',
        labels: { style: { color: 'var(--salt-content-secondary-foreground)' } },
      },
      yAxis: {
        title: { text: undefined },
        gridLineColor: 'var(--salt-separable-primary-borderColor)',
        labels: { style: { color: 'var(--salt-content-secondary-foreground)' } },
      },
      tooltip: { valuePrefix: '', valueSuffix: '' },
      plotOptions: {
        bar: { borderRadius: 4, color: 'var(--salt-accent-background, #1e88e5)' },
      },
      series: [{ type: 'bar', name: 'Users', data: data?.map((d) => d.value) ?? [] }],
    }),
    [data],
  )

  // This query has retry disabled (see useFunnelQuery) so isError reflects
  // the very first failed attempt immediately, rather than after 3 silent
  // retries - `onRetry={refetch}` below is what the "Try again" button calls.
  return (
    <ChartCard title="Conversion Funnel" isLoading={isLoading} isError={isError} error={error} onRetry={refetch}>
      <ResponsiveHighcharts highcharts={Highcharts} options={chartOptions} />
    </ChartCard>
  )
}
