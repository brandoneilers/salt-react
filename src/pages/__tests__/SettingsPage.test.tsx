import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithSalt } from '../../test/renderWithProviders'
import { SettingsPage } from '../SettingsPage'

describe('SettingsPage', () => {
  it('calls onToggleDarkMode when the theme switch is clicked', async () => {
    const user = userEvent.setup()
    const onToggleDarkMode = vi.fn()
    renderWithSalt(
      <SettingsPage
        darkMode={false}
        onToggleDarkMode={onToggleDarkMode}
        density="medium"
        onDensityChange={() => {}}
        onResetSidebarWidth={() => {}}
      />,
    )

    await user.click(screen.getByRole('switch', { name: 'Toggle dark mode' }))

    expect(onToggleDarkMode).toHaveBeenCalledTimes(1)
  })

  it('calls onDensityChange with the clicked density value', async () => {
    const user = userEvent.setup()
    const onDensityChange = vi.fn()
    renderWithSalt(
      <SettingsPage
        darkMode={false}
        onToggleDarkMode={() => {}}
        density="medium"
        onDensityChange={onDensityChange}
        onResetSidebarWidth={() => {}}
      />,
    )

    // ToggleButtonGroup/ToggleButton render as an ARIA radiogroup of radios.
    await user.click(screen.getByRole('radio', { name: 'Low' }))

    expect(onDensityChange).toHaveBeenCalledWith('low')
  })

  it('reflects the current density as the checked radio', () => {
    renderWithSalt(
      <SettingsPage
        darkMode={false}
        onToggleDarkMode={() => {}}
        density="high"
        onDensityChange={() => {}}
        onResetSidebarWidth={() => {}}
      />,
    )

    expect(screen.getByRole('radio', { name: 'High' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Medium' })).toHaveAttribute('aria-checked', 'false')
  })

  it('calls onResetSidebarWidth when "Reset to default" is clicked', async () => {
    const user = userEvent.setup()
    const onResetSidebarWidth = vi.fn()
    renderWithSalt(
      <SettingsPage
        darkMode={false}
        onToggleDarkMode={() => {}}
        density="medium"
        onDensityChange={() => {}}
        onResetSidebarWidth={onResetSidebarWidth}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Reset to default' }))

    expect(onResetSidebarWidth).toHaveBeenCalledTimes(1)
  })
})
