import type { ReactElement, ReactNode } from 'react'
import { render } from '@testing-library/react'
import { SaltProviderNext } from '@salt-ds/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Shared render helpers so individual test files don't each re-implement
// "wrap this in the providers the real app wraps it in."

export function renderWithSalt(ui: ReactElement) {
  return render(<SaltProviderNext corner="rounded">{ui}</SaltProviderNext>)
}

export function createTestQueryClient() {
  return new QueryClient({
    // The real app relies on retries/backoff for a couple of things (see
    // useFunnelQuery's deliberately-flaky demo endpoint) - tests want
    // failures to surface immediately instead of waiting through retries.
    defaultOptions: { queries: { retry: false } },
  })
}

export function renderWithQueryClient(ui: ReactElement) {
  const queryClient = createTestQueryClient()
  return render(
    <SaltProviderNext corner="rounded">
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </SaltProviderNext>,
  )
}

export function QueryClientTestWrapper({ children }: { children: ReactNode }) {
  const queryClient = createTestQueryClient()
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
