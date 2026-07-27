import { Card, StackLayout, FlexLayout, Avatar, Text, H3 } from '@salt-ds/core'
import { LastUpdated } from './LastUpdated'

const ACTIVITY = [
  { name: 'Ava Chen', action: 'closed deal with Initech', time: '5m ago', color: 'category-1' as const },
  { name: 'Marcus Lee', action: 'uploaded Q3 report', time: '22m ago', color: 'category-3' as const },
  { name: 'Priya Nair', action: 'added 3 new users', time: '1h ago', color: 'category-5' as const },
  { name: 'Tom Baker', action: 'resolved ticket #4821', time: '2h ago', color: 'category-7' as const },
  { name: 'Elena Ruiz', action: 'updated billing settings', time: '4h ago', color: 'category-9' as const },
]

export function ActivityList() {
  return (
    <Card className="activity-panel">
      <StackLayout gap={2}>
        <FlexLayout justify="space-between" align="center">
          <H3>Recent Activity</H3>
          <LastUpdated />
        </FlexLayout>
        <StackLayout gap={3}>
          {ACTIVITY.map(({ name, action, time, color }) => (
            <FlexLayout key={name} align="center" gap={2}>
              <Avatar name={name} color={color} size={1} />
              <StackLayout gap={0} className="activity-row-text">
                <Text>
                  <strong>{name}</strong> {action}
                </Text>
                <Text styleAs="label" color="secondary">
                  {time}
                </Text>
              </StackLayout>
            </FlexLayout>
          ))}
        </StackLayout>
      </StackLayout>
    </Card>
  )
}
