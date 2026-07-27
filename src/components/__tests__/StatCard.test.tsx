import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { CurrencyIcon } from '@salt-ds/icons'
import { renderWithSalt } from '../../test/renderWithProviders'
import { StatCard } from '../StatCard'

describe('StatCard', () => {
  it('renders the label, value, and delta text', () => {
    renderWithSalt(
      <StatCard label="Total Revenue" value="$482,930" delta="12.4% vs last month" trend="up" icon={CurrencyIcon} />,
    )

    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
    expect(screen.getByText('$482,930')).toBeInTheDocument()
    expect(screen.getByText(/12\.4% vs last month/)).toBeInTheDocument()
  })

  it('shows an upward arrow for an "up" trend', () => {
    renderWithSalt(<StatCard label="Active Users" value="8,204" delta="4.1%" trend="up" icon={CurrencyIcon} />)
    expect(screen.getByText(/^▲/)).toBeInTheDocument()
  })

  it('shows a downward arrow for a "down" trend', () => {
    renderWithSalt(<StatCard label="Conversion Rate" value="3.62%" delta="0.8%" trend="down" icon={CurrencyIcon} />)
    expect(screen.getByText(/^▼/)).toBeInTheDocument()
  })
})
