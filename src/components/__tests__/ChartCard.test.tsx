import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithSalt } from '../../test/renderWithProviders'
import { ChartCard } from '../ChartCard'

describe('ChartCard', () => {
  it('shows a loading spinner and hides children while isLoading is true', () => {
    renderWithSalt(
      <ChartCard title="Website Traffic" isLoading={true} isError={false}>
        <div>chart content</div>
      </ChartCard>,
    )

    expect(screen.getByRole('img', { name: 'Loading Website Traffic' })).toBeInTheDocument()
    expect(screen.queryByText('chart content')).not.toBeInTheDocument()
  })

  it('shows the error message and a retry button, and hides children, while isError is true', () => {
    renderWithSalt(
      <ChartCard title="Conversion Funnel" isLoading={false} isError={true} error={new Error('boom')} onRetry={() => {}}>
        <div>chart content</div>
      </ChartCard>,
    )

    expect(screen.getByText('boom')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
    expect(screen.queryByText('chart content')).not.toBeInTheDocument()
  })

  it('falls back to a generic message when the error is not an Error instance', () => {
    renderWithSalt(
      <ChartCard title="Conversion Funnel" isLoading={false} isError={true} error="not an Error object">
        <div>chart content</div>
      </ChartCard>,
    )

    expect(screen.getByText('Something went wrong loading this chart.')).toBeInTheDocument()
  })

  it('omits the retry button when onRetry is not provided', () => {
    renderWithSalt(
      <ChartCard title="Conversion Funnel" isLoading={false} isError={true} error={new Error('boom')}>
        <div>chart content</div>
      </ChartCard>,
    )

    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument()
  })

  it('calls onRetry when the retry button is clicked', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    renderWithSalt(
      <ChartCard title="Conversion Funnel" isLoading={false} isError={true} error={new Error('boom')} onRetry={onRetry}>
        <div>chart content</div>
      </ChartCard>,
    )

    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('renders children and hides loading/error UI on success', () => {
    renderWithSalt(
      <ChartCard title="Website Traffic" isLoading={false} isError={false}>
        <div>chart content</div>
      </ChartCard>,
    )

    expect(screen.getByText('chart content')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument()
  })
})
