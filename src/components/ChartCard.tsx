import type { ReactNode } from 'react'
import { Card, StackLayout, FlexLayout, Spinner, Button, Text, H3 } from '@salt-ds/core'

interface ChartCardProps {
  title: string
  subtitle?: ReactNode
  isLoading: boolean
  isError: boolean
  error?: unknown
  onRetry?: () => void
  children: ReactNode
}

export function ChartCard({ title, subtitle, isLoading, isError, error, onRetry, children }: ChartCardProps) {
  return (
    <Card className="chart-panel">
      <StackLayout gap={2}>
        <FlexLayout justify="space-between" align="center">
          <H3>{title}</H3>
          {subtitle}
        </FlexLayout>

        {isLoading && (
          <FlexLayout justify="center" align="center" className="chart-status">
            <Spinner size="medium" aria-label={`Loading ${title}`} />
          </FlexLayout>
        )}

        {isError && (
          <StackLayout gap={2} align="center" className="chart-status">
            <Text color="error">
              {error instanceof Error ? error.message : 'Something went wrong loading this chart.'}
            </Text>
            {onRetry && (
              <Button appearance="bordered" onClick={onRetry}>
                Try again
              </Button>
            )}
          </StackLayout>
        )}

        {!isLoading && !isError && children}
      </StackLayout>
    </Card>
  )
}
