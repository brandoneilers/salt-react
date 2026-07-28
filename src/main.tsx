import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SaltProviderNext } from '@salt-ds/core'
// @salt-ds/theme/index.css is the legacy bundle and doesn't include the
// [data-corner=rounded] (and other theme-next-only) rules that
// SaltProviderNext actually needs - global.css + theme-next.css is the
// pairing that matches it.
import '@salt-ds/theme/css/global.css'
import '@salt-ds/theme/css/theme-next.css'
import '@fontsource/open-sans'
import '@fontsource/pt-mono'
import './index.css'
import App from './App.tsx'

// One QueryClient for the whole app - it owns the cache every useQuery call
// reads from and writes to. Created once, outside the component tree, so it
// isn't recreated (and the cache lost) on every render.
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SaltProviderNext corner="rounded">
        <App />
      </SaltProviderNext>
      {/* Floating panel for inspecting the query cache live - strips itself
          out of production builds automatically. */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
