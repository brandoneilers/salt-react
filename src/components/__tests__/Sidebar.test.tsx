import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithSalt } from '../../test/renderWithProviders'
import { Sidebar } from '../Sidebar'

describe('Sidebar', () => {
  it('renders all navigation items', () => {
    renderWithSalt(<Sidebar active="Dashboard" onSelect={() => {}} width={240} />)

    for (const label of ['Dashboard', 'Analytics', 'Users', 'Reports', 'Settings']) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    }
  })

  it('calls onSelect with the clicked item label', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    renderWithSalt(<Sidebar active="Dashboard" onSelect={onSelect} width={240} />)

    await user.click(screen.getByRole('link', { name: 'Analytics' }))

    expect(onSelect).toHaveBeenCalledWith('Analytics')
  })

  it('applies the given width as an inline style on the <aside>', () => {
    renderWithSalt(<Sidebar active="Dashboard" onSelect={() => {}} width={300} />)
    const aside = screen.getByRole('link', { name: 'Dashboard' }).closest('aside')
    expect(aside).toHaveStyle({ width: '300px' })
  })

  it('marks only the active item with aria-current="page"', () => {
    renderWithSalt(<Sidebar active="Users" onSelect={() => {}} width={240} />)

    expect(screen.getByRole('link', { name: 'Users' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('link', { name: 'Analytics' })).not.toHaveAttribute('aria-current')
  })
})
