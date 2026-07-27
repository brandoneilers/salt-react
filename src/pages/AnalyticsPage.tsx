import { GridLayout, GridItem } from '@salt-ds/core'
import { TrafficChart } from '../components/analytics/TrafficChart'
import { DeviceBreakdownChart } from '../components/analytics/DeviceBreakdownChart'
import { FunnelChart } from '../components/analytics/FunnelChart'

export function AnalyticsPage() {
  return (
    <GridLayout columns={{ xs: 1, lg: 2 }} gap={3}>
      <GridItem colSpan={{ xs: 1, lg: 2 }}>
        <TrafficChart />
      </GridItem>
      <DeviceBreakdownChart />
      <FunnelChart />
    </GridLayout>
  )
}
