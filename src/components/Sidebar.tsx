import { memo } from 'react'
import {
  VerticalNavigation,
  VerticalNavigationItem,
  VerticalNavigationItemContent,
  VerticalNavigationItemLabel,
  VerticalNavigationItemTrigger,
  H3,
} from '@salt-ds/core'
import {
  DashboardIcon,
  ChartLineIcon,
  UserGroupIcon,
  BuildReportIcon,
  SettingsIcon,
} from '@salt-ds/icons'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: DashboardIcon },
  { label: 'Analytics', icon: ChartLineIcon },
  { label: 'Users', icon: UserGroupIcon },
  { label: 'Reports', icon: BuildReportIcon },
  { label: 'Settings', icon: SettingsIcon },
]

interface SidebarProps {
  active: string
  onSelect: (label: string) => void
  width: number
}

function SidebarComponent({ active, onSelect, width }: SidebarProps) {
  return (
    <aside className="sidebar" style={{ width }}>
      <div className="sidebar-brand">
        <H3>Not A Real Company, LLC</H3>
      </div>
      <VerticalNavigation appearance="indicator">
        {NAV_ITEMS.map(({ label, icon: Icon }) => (
          <VerticalNavigationItem key={label} active={active === label}>
            <VerticalNavigationItemTrigger
              href="#"
              onClick={(event) => {
                event.preventDefault()
                onSelect(label)
              }}
            >
              <VerticalNavigationItemContent>
                <Icon aria-hidden />
                <VerticalNavigationItemLabel>{label}</VerticalNavigationItemLabel>
              </VerticalNavigationItemContent>
            </VerticalNavigationItemTrigger>
          </VerticalNavigationItem>
        ))}
      </VerticalNavigation>
    </aside>
  )
}

// Paired with useCallback in App.tsx for the `onSelect` handler it receives:
// memo() alone only prevents re-renders when EVERY prop keeps the same
// identity between renders, so a stable callback reference is required for
// this to actually skip work (e.g. when App re-renders just because the
// theme was toggled - Sidebar doesn't care about that, so it shouldn't
// have to re-render for it).
export const Sidebar = memo(SidebarComponent)
