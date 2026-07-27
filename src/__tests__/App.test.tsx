import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClientProvider } from '@tanstack/react-query'
import { createTestQueryClient } from '../test/renderWithProviders'
import App from '../App'

// App owns its own SaltProvider internally (it needs the live darkMode/
// density state to configure it), so tests only need to supply the
// QueryClientProvider that main.tsx normally wraps it in - AnalyticsPage's
// useQuery calls would otherwise have no cache to read from.
function renderApp() {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  )
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('shows the Dashboard by default', () => {
    renderApp()
    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByText("Welcome back, here's what's happening today.")).toBeInTheDocument()
  })

  it('sets the document title to match the active page', () => {
    renderApp()
    expect(document.title).toBe('Dashboard · Salt React')
  })

  it('navigates to a different page when a sidebar link is clicked', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('link', { name: 'Settings' }))

    expect(screen.getByRole('heading', { level: 1, name: 'Settings' })).toBeInTheDocument()
    expect(screen.getByText('Workspace')).toBeInTheDocument()
    expect(document.title).toBe('Settings · Salt React')
  })

  it('does not show "Previously viewing" on first render', () => {
    renderApp()
    expect(screen.queryByText(/Previously viewing/)).not.toBeInTheDocument()
  })

  it('shows "Previously viewing" the prior page after navigating', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('link', { name: 'Users' }))

    expect(screen.getByText('Previously viewing Dashboard')).toBeInTheDocument()
  })

  it('moves focus to the new page heading after navigating', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('link', { name: 'Users' }))

    expect(screen.getByRole('heading', { level: 1, name: 'Users' })).toHaveFocus()
  })

  it('does not steal focus on initial mount', () => {
    renderApp()
    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).not.toHaveFocus()
  })
})
