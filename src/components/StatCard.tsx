import type { ComponentType } from 'react'
import { Card, FlexLayout, StackLayout, Text, H2 } from '@salt-ds/core'
import type { IconProps } from '@salt-ds/icons'

interface StatCardProps {
  label: string
  value: string
  delta: string
  trend: 'up' | 'down'
  icon: ComponentType<IconProps>
}

export function StatCard({ label, value, delta, trend, icon: Icon }: StatCardProps) {
  return (
    <Card className="stat-card">
      <FlexLayout justify="space-between" align="center">
        <StackLayout gap={1}>
          <Text styleAs="label" color="secondary">
            {label}
          </Text>
          <H2>{value}</H2>
          <Text
            styleAs="label"
            color={trend === 'up' ? 'success' : 'error'}
          >
            {trend === 'up' ? '▲' : '▼'} {delta}
          </Text>
        </StackLayout>
        <span className="stat-card-icon">
          <Icon aria-hidden size={2} />
        </span>
      </FlexLayout>
    </Card>
  )
}
