import { GridLayout, GridItem } from '@salt-ds/core'
import { CurrencyIcon, UserGroupIcon, ChartLineIcon, NotificationIcon } from '@salt-ds/icons'
import { StatCard } from '../components/StatCard'
import { RevenueChart } from '../components/RevenueChart'
import { ActivityList } from '../components/ActivityList'

const STATS = [
  { label: 'Total Revenue', value: '$482,930', delta: '12.4% vs last month', trend: 'up' as const, icon: CurrencyIcon },
  { label: 'Active Users', value: '8,204', delta: '4.1% vs last month', trend: 'up' as const, icon: UserGroupIcon },
  { label: 'Conversion Rate', value: '3.62%', delta: '0.8% vs last month', trend: 'down' as const, icon: ChartLineIcon },
  { label: 'Open Tickets', value: '27', delta: '6 fewer than last week', trend: 'up' as const, icon: NotificationIcon },
]

export function DashboardPage() {
  return (
    <>
      <GridLayout columns={{ xs: 1, sm: 2, lg: 4 }} gap={3}>
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </GridLayout>

      <GridLayout columns={{ xs: 1, lg: 3 }} gap={3}>
        <GridItem colSpan={{ xs: 1, lg: 2 }}>
          <RevenueChart />
        </GridItem>
        <GridItem>
          <ActivityList />
        </GridItem>
      </GridLayout>
    </>
  )
}
