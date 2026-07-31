import { describe, expect, it } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithQueryClient } from '../../test/renderWithProviders'
import { TicketsPage } from '../TicketsPage'

describe('TicketsPage', () => {
  it('filters the ticket table by the current search text', async () => {
    const user = userEvent.setup()
    renderWithQueryClient(<TicketsPage />)

    await screen.findByText('API gateway latency spike')
    await user.type(screen.getByPlaceholderText('Search tickets or service'), 'gateway')

    await waitFor(() => {
      expect(screen.getByText('API gateway latency spike')).toBeInTheDocument()
    })
    expect(screen.queryByText('Database failover review')).not.toBeInTheDocument()
  })

  it('renders pagination controls for the ticket table', async () => {
    renderWithQueryClient(<TicketsPage />)

    expect(await screen.findByRole('button', { name: 'Next page' })).toBeInTheDocument()
  })
})
