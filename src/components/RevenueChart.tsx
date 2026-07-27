import { useContext, useMemo } from 'react'
import Highcharts from 'highcharts'
import { Card, FlexLayout, StackLayout, Text, H3 } from '@salt-ds/core'
import { ThemeModeContext } from '../context/ThemeModeContext'
import HighchartsReact from '../lib/HighchartsReact'

const MONTHLY_REVENUE = [
  { month: 'Jan', value: 42 },
  { month: 'Feb', value: 55 },
  { month: 'Mar', value: 48 },
  { month: 'Apr', value: 63 },
  { month: 'May', value: 59 },
  { month: 'Jun', value: 71 },
  { month: 'Jul', value: 68 },
  { month: 'Aug', value: 80 },
  { month: 'Sep', value: 76 },
  { month: 'Oct', value: 88 },
  { month: 'Nov', value: 93 },
  { month: 'Dec', value: 100 },
]

export function RevenueChart() {
  // useContext reads the nearest <ThemeModeContext.Provider value> above this
  // component - set once in App.tsx - without DashboardPage (which sits
  // between App and this component) having to accept and forward a
  // `darkMode` prop it doesn't otherwise need.
  const darkMode = useContext(ThemeModeContext)

  // Most of this chart's styling uses CSS custom properties (var(--salt-...))
  // which the browser re-resolves automatically when the theme class on
  // <html> changes - no JS involved. Highcharts' tooltip is the exception:
  // it's a separately-positioned element Highcharts styles with inline
  // styles it controls directly, so it needs an explicit light/dark value.
  //
  // Wrapping the whole options object in useMemo also matters on its own:
  // HighchartsReact calls chart.update() whenever the `options` prop's
  // *identity* changes, even if the values are the same. Without useMemo,
  // a plain object literal here would be a brand new object on every
  // render, causing the chart to redraw for reasons unrelated to the data.
  const chartOptions = useMemo<Highcharts.Options>(
    () => ({
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        height: 220,
        style: { fontFamily: 'inherit' },
      },
      title: { text: undefined },
      credits: { enabled: false },
      legend: { enabled: false },
      xAxis: {
        categories: MONTHLY_REVENUE.map((d) => d.month),
        lineColor: 'var(--salt-separable-primary-borderColor)',
        labels: { style: { color: 'var(--salt-content-secondary-foreground)' } },
      },
      yAxis: {
        title: { text: undefined },
        gridLineColor: 'var(--salt-separable-primary-borderColor)',
        labels: { style: { color: 'var(--salt-content-secondary-foreground)' } },
      },
      tooltip: {
        backgroundColor: darkMode ? '#242526' : '#ffffff',
        style: { color: darkMode ? '#ffffff' : '#161616' },
        valuePrefix: '$',
        valueSuffix: 'k',
      },
      plotOptions: {
        column: {
          borderRadius: 4,
          color: 'var(--salt-accent-background, #1e88e5)',
        },
      },
      series: [
        {
          type: 'column',
          name: 'Revenue',
          data: MONTHLY_REVENUE.map((d) => d.value),
        },
      ],
    }),
    [darkMode],
  )

  // A second, independent useMemo: deriving "which month had the highest
  // revenue" is a reduce over the dataset - cheap here, but the pattern is
  // the same for genuinely expensive derived values. The empty dependency
  // array means it only runs once, since MONTHLY_REVENUE never changes.
  const bestMonth = useMemo(
    () => MONTHLY_REVENUE.reduce((best, month) => (month.value > best.value ? month : best)),
    [],
  )

  return (
    <Card className="chart-panel">
      <StackLayout gap={2}>
        <FlexLayout justify="space-between" align="center">
          <H3>Monthly Revenue</H3>
          <Text styleAs="label" color="secondary">
            Best: {bestMonth.month} (${bestMonth.value}k)
          </Text>
        </FlexLayout>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </StackLayout>
    </Card>
  )
}
