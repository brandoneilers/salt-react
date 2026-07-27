import { useMemo } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from '../../lib/HighchartsReact'
import { ChartCard } from '../ChartCard'
import { useDeviceBreakdownQuery } from '../../hooks/useAnalyticsQueries'

export function DeviceBreakdownChart() {
  const { data, isLoading, isError, error, refetch } = useDeviceBreakdownQuery()

  const chartOptions = useMemo<Highcharts.Options>(
    () => ({
      chart: { type: 'pie', backgroundColor: 'transparent', height: 220, style: { fontFamily: 'inherit' } },
      title: { text: undefined },
      credits: { enabled: false },
      tooltip: { valueSuffix: '%' },
      plotOptions: {
        pie: {
          innerSize: '60%',
          borderWidth: 2,
          borderColor: 'var(--salt-container-primary-background)',
          dataLabels: {
            style: { color: 'var(--salt-content-primary-foreground)', textOutline: 'none' },
          },
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Share',
          data: data?.map((d) => ({ name: d.device, y: d.value })) ?? [],
        },
      ],
    }),
    [data],
  )

  return (
    <ChartCard title="Traffic by Device" isLoading={isLoading} isError={isError} error={error} onRetry={refetch}>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </ChartCard>
  )
}
