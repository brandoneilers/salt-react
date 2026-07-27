import type { ComponentType } from 'react'
import { Panel, StackLayout, H2, Text } from '@salt-ds/core'
import type { IconProps } from '@salt-ds/icons'

interface StubPageProps {
  title: string
  description: string
  icon: ComponentType<IconProps>
}

export function StubPage({ title, description, icon: Icon }: StubPageProps) {
  return (
    <Panel className="stub-panel">
      <StackLayout align="center" gap={2} className="stub-panel-content">
        <Icon size={4} aria-hidden />
        <H2>{title}</H2>
        <Text color="secondary">{description}</Text>
      </StackLayout>
    </Panel>
  )
}
