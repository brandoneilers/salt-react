import { useMemo } from 'react'
import Highcharts from 'highcharts'
import { GridLayout, GridItem, Text } from '@salt-ds/core'
import { ResponsiveHighcharts } from '../../components/ResponsiveHighcharts'
import { ChartCard } from '../../components/ChartCard'
import { useTicketMetricsQuery } from '../../hooks/useTicketsQueries'

export function TicketMetricsCharts() {
  const { data, isLoading, isError, error, refetch } = useTicketMetricsQuery()

  const volumeOptions = useMemo<Highcharts.Options>(
    () => ({
      chart: { type: 'column', backgroundColor: 'transparent', height: 220, style: { fontFamily: 'inherit' } },
      title: { text: undefined },
      credits: { enabled: false },
      legend: { enabled: false },
      xAxis: {
        categories: data?.volume.map((point) => point.day) ?? [],
        lineColor: 'var(--salt-separable-primary-borderColor)',
        labels: { style: { color: 'var(--salt-content-secondary-foreground)' } },
      },
      yAxis: {
        title: { text: undefined },
        gridLineColor: 'var(--salt-separable-primary-borderColor)',
        labels: { style: { color: 'var(--salt-content-secondary-foreground)' } },
      },
      tooltip: { valueSuffix: ' tickets' },
      plotOptions: {
        column: { color: 'var(--salt-accent-background, #1e88e5)', borderRadius: 3 },
      },
      series: [{ type: 'column', name: 'Tickets', data: data?.volume.map((point) => point.count) ?? [] }],
    }),
    [data],
  )

  const severityOptions = useMemo<Highcharts.Options>(
    () => ({
      chart: { type: 'pie', backgroundColor: 'transparent', height: 220, style: { fontFamily: 'inherit' } },
      title: { text: undefined },
      credits: { enabled: false },
      tooltip: { valueSuffix: ' tickets' },
      plotOptions: {
        pie: {
          dataLabels: { style: { color: 'var(--salt-content-primary-foreground)', textOutline: 'none' } },
          borderWidth: 2,
          borderColor: 'var(--salt-container-primary-background)',
        },
      },
      series: [{ type: 'pie', name: 'Severity', data: data?.severity.map((item) => ({ name: item.severity, y: item.count })) ?? [] }],
    }),
    [data],
  )

  const resolutionOptions = useMemo<Highcharts.Options>(
    () => ({
      chart: { type: 'bar', backgroundColor: 'transparent', height: 220, style: { fontFamily: 'inherit' } },
      title: { text: undefined },
      credits: { enabled: false },
      legend: { enabled: false },
      xAxis: {
        categories: data?.resolution.map((item) => item.service) ?? [],
        lineColor: 'var(--salt-separable-primary-borderColor)',
        labels: { style: { color: 'var(--salt-content-secondary-foreground)' } },
      },
      yAxis: {
        title: { text: undefined },
        gridLineColor: 'var(--salt-separable-primary-borderColor)',
        labels: { style: { color: 'var(--salt-content-secondary-foreground)' } },
      },
      tooltip: { valueSuffix: ' hrs' },
      plotOptions: {
        bar: { color: 'var(--salt-success-background, #43a047)' },
      },
      series: [{ type: 'bar', name: 'Avg hours', data: data?.resolution.map((item) => item.avgHours) ?? [] }],
    }),
    [data],
  )

  return (
    <GridLayout columns={{ xs: 1, lg: 2 }} gap={3}>
      <GridItem colSpan={{ xs: 1, lg: 2 }}>
        <ChartCard
          title="Ticket Volume"
          subtitle={<Text styleAs="label" color="secondary">Weekly trend</Text>}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={refetch}
        >
          <ResponsiveHighcharts highcharts={Highcharts} options={volumeOptions} />
        </ChartCard>
      </GridItem>
      <ChartCard title="Severity Breakdown" isLoading={isLoading} isError={isError} error={error} onRetry={refetch}>
        <ResponsiveHighcharts highcharts={Highcharts} options={severityOptions} />
      </ChartCard>
      <ChartCard title="Resolution Time by Service" isLoading={isLoading} isError={isError} error={error} onRetry={refetch}>
        <ResponsiveHighcharts highcharts={Highcharts} options={resolutionOptions} />
      </ChartCard>
    </GridLayout>
  )
}
