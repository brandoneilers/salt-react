import { useCallback, useEffect, useRef, useState } from 'react'
import { SaltProvider, StackLayout, FlexLayout, H1, Text, Button, useBreakpoint } from '@salt-ds/core'
import {
  DashboardIcon,
  ChartLineIcon,
  UserGroupIcon,
  BuildReportIcon,
  SettingsIcon,
  MenuIcon,
} from '@salt-ds/icons'
import { Sidebar } from './components/Sidebar'
import { ResizeHandle } from './components/ResizeHandle'
import { DashboardPage } from './pages/DashboardPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { UsersPage } from './pages/UsersPage'
import { SettingsPage } from './pages/SettingsPage'
import { StubPage } from './pages/StubPage'
import { ThemeModeContext } from './context/ThemeModeContext'
import { useDarkMode } from './hooks/useDarkMode'
import { useDensity } from './hooks/useDensity'
import { usePrevious } from './hooks/usePrevious'
import { useResizableWidth } from './hooks/useResizableWidth'
import './App.css'

const PAGES = {
  Dashboard: {
    subtitle: "Welcome back, here's what's happening today.",
    icon: DashboardIcon,
    description: '',
  },
  Analytics: {
    subtitle: 'Deep-dive metrics and trends.',
    icon: ChartLineIcon,
    description: 'Analytics is under construction. Detailed charts and trend breakdowns will live here.',
  },
  Users: {
    subtitle: 'Manage accounts and permissions.',
    icon: UserGroupIcon,
    description: 'User management is under construction. A searchable, sortable user table will live here.',
  },
  Reports: {
    subtitle: 'Generate and export reports.',
    icon: BuildReportIcon,
    description: 'Reports is under construction. Scheduled and on-demand report generation will live here.',
  },
  Settings: {
    subtitle: 'Configure your workspace.',
    icon: SettingsIcon,
    description: 'Settings is under construction. Account, billing, and workspace preferences will live here.',
  },
} as const

type PageName = keyof typeof PAGES

const SIDEBAR_MIN_WIDTH = 180
const SIDEBAR_MAX_WIDTH = 420
const MOBILE_SIDEBAR_WIDTH = 280

function App() {
  const [active, setActive] = useState<PageName>('Dashboard')
  const { darkMode, toggleDarkMode } = useDarkMode()
  const { density, setDensity } = useDensity()
  const sidebarWidth = useResizableWidth({
    storageKey: 'salt-dashboard-sidebar-width',
    defaultWidth: 240,
    minWidth: SIDEBAR_MIN_WIDTH,
    maxWidth: SIDEBAR_MAX_WIDTH,
  })

  // Reads the same breakpoint system SaltProvider already drives the
  // GridLayout `columns={{ xs: ... }}` props with elsewhere in this app -
  // `xs` is Salt's smallest breakpoint (below 600px). Below it, the
  // resizable sidebar switches to an off-canvas drawer instead.
  const { breakpoint } = useBreakpoint()
  const isMobile = breakpoint === 'xs'
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // usePrevious (a custom hook built from useRef + useEffect) remembers
  // which page was active before this render - `undefined` on first mount.
  const previousActive = usePrevious(active)

  // useRef for a DOM node: a mutable box React fills in once the <h1> below
  // mounts. Unlike state, setting `.current` doesn't cause a re-render -
  // exactly what you want for an imperative "grab the real DOM element and
  // do something to it" escape hatch.
  const headingRef = useRef<HTMLHeadingElement>(null)

  const page = PAGES[active]

  // Side effects that touch things outside React's own tree - here,
  // `document.title` - belong in useEffect, not directly in the component
  // body. Re-runs only when `active` changes, keeping the browser tab in
  // sync with whatever page is showing.
  useEffect(() => {
    document.title = `${active} · Salt React`
  }, [active])

  // Move keyboard/screen-reader focus to the new page's heading on
  // navigation - a common SPA accessibility pattern, and a genuine use for
  // an imperative DOM ref (`.focus()` isn't something you can express as a
  // prop). Skipped on the very first render (previousActive is still
  // undefined then) so mounting the app doesn't steal focus unprompted.
  useEffect(() => {
    if (previousActive !== undefined) {
      headingRef.current?.focus()
    }
  }, [active, previousActive])

  // useCallback keeps this function's identity stable across re-renders so
  // it doesn't force the memoized <Sidebar> to re-render for unrelated
  // reasons (e.g. App re-rendering because the theme toggled).
  const handleSelectPage = useCallback((label: string) => {
    setActive(label as PageName)
    // Closing the drawer here is a no-op on desktop (mobileNavOpen is
    // already false), so this doesn't need an isMobile check.
    setMobileNavOpen(false)
  }, [])

  return (
    <ThemeModeContext.Provider value={darkMode}>
      <SaltProvider mode={darkMode ? 'dark' : 'light'} density={density}>
        <div className="app-shell">
          <Sidebar
            active={active}
            onSelect={handleSelectPage}
            width={isMobile ? MOBILE_SIDEBAR_WIDTH : sidebarWidth.width}
            isMobile={isMobile}
            open={mobileNavOpen}
            onClose={() => setMobileNavOpen(false)}
          />
          {isMobile && mobileNavOpen && (
            <div className="mobile-nav-scrim" onClick={() => setMobileNavOpen(false)} />
          )}
          {!isMobile && (
            <ResizeHandle
              width={sidebarWidth.width}
              minWidth={SIDEBAR_MIN_WIDTH}
              maxWidth={SIDEBAR_MAX_WIDTH}
              isDragging={sidebarWidth.isDragging}
              onPointerDown={sidebarWidth.handlePointerDown}
              onPointerMove={sidebarWidth.handlePointerMove}
              onPointerUp={sidebarWidth.handlePointerUp}
              onKeyDown={sidebarWidth.handleKeyDown}
            />
          )}
          <main className="app-main">
            <StackLayout gap={4}>
              <FlexLayout align="center" gap={2}>
                {isMobile && (
                  <Button
                    appearance="transparent"
                    aria-label="Open navigation"
                    onClick={() => setMobileNavOpen(true)}
                  >
                    <MenuIcon aria-hidden />
                  </Button>
                )}
                <StackLayout gap={0}>
                  <H1 ref={headingRef} tabIndex={-1}>
                    {active}
                  </H1>
                  <Text color="secondary">{page.subtitle}</Text>
                  {previousActive && previousActive !== active && (
                    <Text styleAs="label" color="secondary">
                      Previously viewing {previousActive}
                    </Text>
                  )}
                </StackLayout>
              </FlexLayout>

              {active === 'Dashboard' && <DashboardPage />}
              {active === 'Analytics' && <AnalyticsPage />}
              {active === 'Users' && <UsersPage />}
              {active === 'Settings' && (
                <SettingsPage
                  darkMode={darkMode}
                  onToggleDarkMode={toggleDarkMode}
                  density={density}
                  onDensityChange={setDensity}
                  onResetSidebarWidth={sidebarWidth.resetWidth}
                />
              )}
              {active !== 'Dashboard' &&
                active !== 'Analytics' &&
                active !== 'Users' &&
                active !== 'Settings' && (
                  <StubPage title={active} description={page.description} icon={page.icon} />
                )}
            </StackLayout>
          </main>
        </div>
      </SaltProvider>
    </ThemeModeContext.Provider>
  )
}

export default App
