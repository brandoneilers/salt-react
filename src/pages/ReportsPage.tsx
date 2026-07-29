import { useMemo, useState } from 'react'
import {
  Card,
  StackLayout,
  FlexLayout,
  Button,
  Dropdown,
  Option,
  Table,
  TableContainer,
  THead,
  TBody,
  TR,
  TH,
  TD,
  StatusIndicator,
  Pagination,
  Paginator,
  Text,
  H3,
} from '@salt-ds/core'
import { DownloadIcon } from '@salt-ds/icons'
import { REPORT_TYPES, type ReportType } from '../api/reports'
import { useReportHistoryQuery, useGenerateReportMutation } from '../hooks/useReportsQueries'
import { useToast } from '../hooks/useToast'
import { ToastNotification } from '../components/ToastNotification'

const PAGE_SIZE = 8

const STATUS_INDICATOR = {
  Ready: 'success',
  Failed: 'error',
} as const

export function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>(REPORT_TYPES[0])
  const [page, setPage] = useState(1)
  const { toast, showToast, dismiss } = useToast()

  const { data: history, isLoading } = useReportHistoryQuery()
  const generateReport = useGenerateReportMutation()

  // Client-side pagination over the fetched history - a real backend would
  // more likely paginate the query itself, but the mocked API returns the
  // whole list, so slicing it here is the equivalent for this app's purposes.
  const pageCount = useMemo(() => Math.max(1, Math.ceil((history?.length ?? 0) / PAGE_SIZE)), [history])

  const visibleRows = useMemo(() => {
    if (!history) return []
    const start = (page - 1) * PAGE_SIZE
    return history.slice(start, start + PAGE_SIZE)
  }, [history, page])

  function handleGenerate() {
    generateReport.mutate(reportType, {
      onSuccess: (record) => {
        setPage(1)
        showToast(`${record.name} is ready.`, 'success')
      },
      onError: (error) => {
        showToast(error instanceof Error ? error.message : 'Failed to generate report.', 'error')
      },
    })
  }

  return (
    <StackLayout gap={4}>
      <Card className="chart-panel">
        <StackLayout gap={3}>
          <H3>Generate a Report</H3>
          <FlexLayout align="center" gap={3}>
            <Dropdown
              selected={[reportType]}
              onSelectionChange={(_event, newSelected) => {
                if (newSelected[0]) setReportType(newSelected[0])
              }}
            >
              {REPORT_TYPES.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Dropdown>
            <Button className="generate-report-button" onClick={handleGenerate} loading={generateReport.isPending}>
              Generate Report
            </Button>
          </FlexLayout>
        </StackLayout>
      </Card>

      <Card className="chart-panel">
        <StackLayout gap={3}>
          <H3>Report History</H3>
          <TableContainer>
            <Table zebra aria-label="Report history">
              <THead>
                <TR>
                  <TH>Report</TH>
                  <TH>Type</TH>
                  <TH>Generated</TH>
                  <TH>Status</TH>
                  <TH>Size</TH>
                  <TH aria-label="Actions" />
                </TR>
              </THead>
              <TBody>
                {visibleRows.map((report) => (
                  <TR key={report.id}>
                    <TD>{report.name}</TD>
                    <TD>{report.type}</TD>
                    <TD>
                      <Text color="secondary">{report.generatedAt}</Text>
                    </TD>
                    <TD>
                      <FlexLayout align="center" gap={1}>
                        <StatusIndicator status={STATUS_INDICATOR[report.status]} size={1} />
                        <Text>{report.status}</Text>
                      </FlexLayout>
                    </TD>
                    <TD>
                      <Text color="secondary">{report.sizeKb} KB</Text>
                    </TD>
                    <TD>
                      <Button
                        appearance="transparent"
                        aria-label={`Download ${report.name}`}
                        onClick={() => showToast('This is a demo - there is no real file to download.', 'success')}
                      >
                        <DownloadIcon aria-hidden />
                      </Button>
                    </TD>
                  </TR>
                ))}
                {!isLoading && visibleRows.length === 0 && (
                  <TR>
                    <TD colSpan={6}>
                      <Text color="secondary">No reports yet - generate one above.</Text>
                    </TD>
                  </TR>
                )}
              </TBody>
            </Table>
          </TableContainer>
          <FlexLayout justify="end">
            <Pagination count={pageCount} page={page} onPageChange={(_event, newPage) => setPage(newPage)}>
              <Paginator />
            </Pagination>
          </FlexLayout>
        </StackLayout>
      </Card>

      {toast && <ToastNotification message={toast.message} status={toast.status} onDismiss={dismiss} />}
    </StackLayout>
  )
}
