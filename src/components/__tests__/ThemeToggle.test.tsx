import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithSalt } from '../../test/renderWithProviders'
import { ThemeToggle } from '../ThemeToggle'

describe('ThemeToggle', () => {
  it('renders unchecked when darkMode is false', () => {
    renderWithSalt(<ThemeToggle darkMode={false} onToggle={() => {}} />)
    expect(screen.getByRole('switch', { name: 'Toggle dark mode' })).not.toBeChecked()
  })

  it('renders checked when darkMode is true', () => {
    renderWithSalt(<ThemeToggle darkMode={true} onToggle={() => {}} />)
    expect(screen.getByRole('switch', { name: 'Toggle dark mode' })).toBeChecked()
  })

  it('calls onToggle when clicked', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    renderWithSalt(<ThemeToggle darkMode={false} onToggle={onToggle} />)

    await user.click(screen.getByRole('switch', { name: 'Toggle dark mode' }))

    expect(onToggle).toHaveBeenCalledTimes(1)
  })
})
