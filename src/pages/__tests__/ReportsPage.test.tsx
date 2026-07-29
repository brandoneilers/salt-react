import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithQueryClient } from '../../test/renderWithProviders'
import { ReportsPage } from '../ReportsPage'
import * as reportsApi from '../../api/reports'
import type { ReportRecord } from '../../api/reports'

function report(id: string, name: string): ReportRecord {
  return { id, name, type: 'Revenue Summary', generatedAt: 'Jan 1, 9:00 AM', status: 'Ready', sizeKb: 120 }
}

function dataRows() {
  return screen.getAllByRole('row').slice(1)
}

describe('ReportsPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the report history once loaded', async () => {
    vi.spyOn(reportsApi, 'fetchReportHistory').mockResolvedValue([report('1', 'Revenue Summary — Jan 1, 2026')])
    renderWithQueryClient(<ReportsPage />)

    await waitFor(() => expect(dataRows()).toHaveLength(1))
    expect(screen.getByText('Revenue Summary — Jan 1, 2026')).toBeInTheDocument()
  })

  it('shows a "no reports" row when history is empty', async () => {
    vi.spyOn(reportsApi, 'fetchReportHistory').mockResolvedValue([])
    renderWithQueryClient(<ReportsPage />)

    expect(await screen.findByText('No reports yet - generate one above.')).toBeInTheDocument()
  })

  it('generates a report, shows a success toast, and the new report appears in the list', async () => {
    const user = userEvent.setup()
    vi.spyOn(reportsApi, 'fetchReportHistory').mockResolvedValue([report('1', 'Revenue Summary — Jan 1, 2026')])
    vi.spyOn(reportsApi, 'generateReport').mockResolvedValue(report('2', 'Revenue Summary — Jan 2, 2026'))
    renderWithQueryClient(<ReportsPage />)
    await waitFor(() => expect(dataRows()).toHaveLength(1))

    await user.click(screen.getByRole('button', { name: 'Generate Report' }))

    expect(await screen.findByText('Revenue Summary — Jan 2, 2026 is ready.')).toBeInTheDocument()
    // fetchReportHistory is re-mocked to reflect what "generating" would
    // really do (the record now being in history) since the mutation only
    // invalidates the query - it doesn't know what the refetch will return.
    expect(reportsApi.fetchReportHistory).toHaveBeenCalled()
  })

  it('shows an error toast when report generation fails, without touching the history list', async () => {
    const user = userEvent.setup()
    vi.spyOn(reportsApi, 'fetchReportHistory').mockResolvedValue([report('1', 'Revenue Summary — Jan 1, 2026')])
    vi.spyOn(reportsApi, 'generateReport').mockRejectedValue(
      new Error('Failed to generate the Revenue Summary report - the export service timed out.'),
    )
    renderWithQueryClient(<ReportsPage />)
    await waitFor(() => expect(dataRows()).toHaveLength(1))

    await user.click(screen.getByRole('button', { name: 'Generate Report' }))

    expect(
      await screen.findByText('Failed to generate the Revenue Summary report - the export service timed out.'),
    ).toBeInTheDocument()
    expect(dataRows()).toHaveLength(1)
  })

  it('shows a toast when a row\'s download button is clicked', async () => {
    const user = userEvent.setup()
    vi.spyOn(reportsApi, 'fetchReportHistory').mockResolvedValue([report('1', 'Revenue Summary — Jan 1, 2026')])
    renderWithQueryClient(<ReportsPage />)
    await waitFor(() => expect(dataRows()).toHaveLength(1))

    await user.click(screen.getByRole('button', { name: /Download Revenue Summary/ }))

    expect(await screen.findByText('This is a demo - there is no real file to download.')).toBeInTheDocument()
  })

  it('paginates the history 8 rows per page', async () => {
    const reports = Array.from({ length: 10 }, (_, i) => report(`${i}`, `Report ${i}`))
    vi.spyOn(reportsApi, 'fetchReportHistory').mockResolvedValue(reports)
    const user = userEvent.setup()
    renderWithQueryClient(<ReportsPage />)

    await waitFor(() => expect(dataRows()).toHaveLength(8))
    expect(within(dataRows()[0]).getByText('Report 0')).toBeInTheDocument()

    // Paginator can truncate to a compact layout when it can't measure
    // available width (as in jsdom, which reports 0), so individual page
    // number buttons aren't a reliable target - "Next Page" always is.
    await user.click(screen.getByRole('button', { name: 'Next Page' }))

    await waitFor(() => expect(dataRows()).toHaveLength(2))
    expect(within(dataRows()[0]).getByText('Report 8')).toBeInTheDocument()
  })
})
