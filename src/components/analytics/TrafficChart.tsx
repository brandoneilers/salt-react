import { useMemo } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from '../../lib/HighchartsReact'
import { Text } from '@salt-ds/core'
import { ChartCard } from '../ChartCard'
import { useTrafficQuery } from '../../hooks/useAnalyticsQueries'

export function TrafficChart() {
  const { data, isLoading, isError, error, refetch } = useTrafficQuery()

  // useMemo here guards against rebuilding (and re-animating) the chart's
  // options on every render that isn't caused by `data` actually changing -
  // same reasoning as RevenueChart. Bails out to an empty array before data
  // has arrived, since hooks must run unconditionally on every render.
  const chartOptions = useMemo<Highcharts.Options>(
    () => ({
      chart: { type: 'line', backgroundColor: 'transparent', height: 220, style: { fontFamily: 'inherit' } },
      title: { text: undefined },
      credits: { enabled: false },
      legend: { enabled: false },
      xAxis: {
        categories: data?.map((d) => d.date) ?? [],
        lineColor: 'var(--salt-separable-primary-borderColor)',
        labels: { style: { color: 'var(--salt-content-secondary-foreground)' } },
      },
      yAxis: {
        title: { text: undefined },
        gridLineColor: 'var(--salt-separable-primary-borderColor)',
        labels: { style: { color: 'var(--salt-content-secondary-foreground)' } },
      },
      tooltip: { valueSuffix: ' visitors' },
      plotOptions: {
        line: { color: 'var(--salt-accent-background, #1e88e5)', marker: { enabled: false } },
      },
      series: [{ type: 'line', name: 'Visitors', data: data?.map((d) => d.visitors) ?? [] }],
    }),
    [data],
  )

  return (
    <ChartCard
      title="Website Traffic"
      subtitle={
        <Text styleAs="label" color="secondary">
          Last 14 days
        </Text>
      }
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={refetch}
    >
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </ChartCard>
  )
}
