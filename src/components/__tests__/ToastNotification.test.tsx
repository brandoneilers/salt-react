import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithSalt } from '../../test/renderWithProviders'
import { ToastNotification } from '../ToastNotification'

describe('ToastNotification', () => {
  it('renders the message', () => {
    renderWithSalt(<ToastNotification message="Report is ready." status="success" onDismiss={() => {}} />)
    expect(screen.getByText('Report is ready.')).toBeInTheDocument()
  })

  it('calls onDismiss when the close button is clicked', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    renderWithSalt(<ToastNotification message="Report is ready." status="success" onDismiss={onDismiss} />)

    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }))

    expect(onDismiss).toHaveBeenCalledOnce()
  })
})
