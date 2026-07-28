import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithSalt } from '../../test/renderWithProviders'
import { Sidebar } from '../Sidebar'

const noop = () => {}

describe('Sidebar', () => {
  it('renders all navigation items', () => {
    renderWithSalt(
      <Sidebar active="Dashboard" onSelect={noop} width={240} isMobile={false} open={false} onClose={noop} />,
    )

    for (const label of ['Dashboard', 'Analytics', 'Users', 'Reports', 'Settings']) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    }
  })

  it('calls onSelect with the clicked item label', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    renderWithSalt(
      <Sidebar active="Dashboard" onSelect={onSelect} width={240} isMobile={false} open={false} onClose={noop} />,
    )

    await user.click(screen.getByRole('link', { name: 'Analytics' }))

    expect(onSelect).toHaveBeenCalledWith('Analytics')
  })

  it('applies the given width as an inline style on the <aside>', () => {
    renderWithSalt(
      <Sidebar active="Dashboard" onSelect={noop} width={300} isMobile={false} open={false} onClose={noop} />,
    )
    const aside = screen.getByRole('link', { name: 'Dashboard' }).closest('aside')
    expect(aside).toHaveStyle({ width: '300px' })
  })

  it('marks only the active item with aria-current="page"', () => {
    renderWithSalt(
      <Sidebar active="Users" onSelect={noop} width={240} isMobile={false} open={false} onClose={noop} />,
    )

    expect(screen.getByRole('link', { name: 'Users' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('link', { name: 'Analytics' })).not.toHaveAttribute('aria-current')
  })

  it('does not render a close button on desktop (isMobile=false)', () => {
    renderWithSalt(
      <Sidebar active="Dashboard" onSelect={noop} width={240} isMobile={false} open={false} onClose={noop} />,
    )
    expect(screen.queryByRole('button', { name: 'Close navigation' })).not.toBeInTheDocument()
  })

  it('renders as a drawer with a close button on mobile, and applies the open class', () => {
    renderWithSalt(
      <Sidebar active="Dashboard" onSelect={noop} width={280} isMobile open onClose={noop} />,
    )
    const aside = screen.getByRole('link', { name: 'Dashboard' }).closest('aside')
    expect(aside).toHaveClass('sidebar-drawer', 'sidebar-drawer-open')
    expect(screen.getByRole('button', { name: 'Close navigation' })).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    renderWithSalt(
      <Sidebar active="Dashboard" onSelect={noop} width={280} isMobile open onClose={onClose} />,
    )

    await user.click(screen.getByRole('button', { name: 'Close navigation' }))

    expect(onClose).toHaveBeenCalledOnce()
  })
})
