import { describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithSalt } from '../../test/renderWithProviders'
import { UsersPage } from '../UsersPage'

function dataRows() {
  // First row is the header row.
  return screen.getAllByRole('row').slice(1)
}

describe('UsersPage', () => {
  it('renders all users, sorted by name ascending by default', () => {
    renderWithSalt(<UsersPage />)

    const rows = dataRows()
    expect(rows).toHaveLength(7)
    expect(within(rows[0]).getByText('Ava Chen')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'User' })).toHaveAttribute('aria-sort', 'ascending')
  })

  it('filters rows by search term across name, email, and role', async () => {
    const user = userEvent.setup()
    renderWithSalt(<UsersPage />)

    await user.type(screen.getByPlaceholderText('Search by name, email, or role'), 'editor')

    const rows = dataRows()
    expect(rows).toHaveLength(3)
    for (const row of rows) {
      expect(within(row).getByText('Editor')).toBeInTheDocument()
    }
  })

  it('shows a "no results" row when the search matches nothing', async () => {
    const user = userEvent.setup()
    renderWithSalt(<UsersPage />)

    await user.type(screen.getByPlaceholderText('Search by name, email, or role'), 'zzz-no-match')

    expect(screen.getByText('No users match "zzz-no-match".')).toBeInTheDocument()
  })

  it('sorts by the clicked column, ascending first', async () => {
    const user = userEvent.setup()
    renderWithSalt(<UsersPage />)

    await user.click(screen.getByRole('button', { name: 'Status' }))

    const rows = dataRows()
    expect(within(rows[0]).getByText('Active')).toBeInTheDocument()
    expect(within(rows[rows.length - 1]).getByText('Suspended')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Status/ })).toHaveAttribute('aria-sort', 'ascending')
  })

  it('toggles to descending on a second click of the same column', async () => {
    const user = userEvent.setup()
    renderWithSalt(<UsersPage />)

    await user.click(screen.getByRole('button', { name: 'Status' }))
    await user.click(screen.getByRole('button', { name: 'Status' }))

    const rows = dataRows()
    expect(within(rows[0]).getByText('Suspended')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Status/ })).toHaveAttribute('aria-sort', 'descending')
  })

  it('resets to ascending when switching to a different column', async () => {
    const user = userEvent.setup()
    renderWithSalt(<UsersPage />)

    await user.click(screen.getByRole('button', { name: 'Status' })) // asc
    await user.click(screen.getByRole('button', { name: 'Status' })) // desc
    await user.click(screen.getByRole('button', { name: 'Role' })) // switch column -> asc

    expect(screen.getByRole('columnheader', { name: /Role/ })).toHaveAttribute('aria-sort', 'ascending')
    expect(screen.getByRole('columnheader', { name: /Status/ })).not.toHaveAttribute('aria-sort')
  })
})
