import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SaltProvider } from '@salt-ds/core'
import '@salt-ds/theme/index.css'
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
      <SaltProvider>
        <App />
      </SaltProvider>
      {/* Floating panel for inspecting the query cache live - strips itself
          out of production builds automatically. */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
