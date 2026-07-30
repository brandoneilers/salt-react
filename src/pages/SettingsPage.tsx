import { Card, StackLayout, FlexLayout, ToggleButtonGroup, ToggleButton, Button, H3, Text } from '@salt-ds/core'
import type { Density } from '@salt-ds/core'
import { ThemeToggle } from '../components/ThemeToggle'

interface SettingsPageProps {
  darkMode: boolean
  onToggleDarkMode: () => void
  density: Density
  onDensityChange: (density: Density) => void
  onResetSidebarWidth: () => void
}

const DENSITY_OPTIONS: { value: Density; label: string }[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
  { value: 'touch', label: 'Touch' },
]

export function SettingsPage({
  darkMode,
  onToggleDarkMode,
  density,
  onDensityChange,
  onResetSidebarWidth,
}: SettingsPageProps) {
  return (
    <Card className="chart-panel">
      <StackLayout gap={3} separators>
        <H3>Workspace</H3>

        <FlexLayout align="center" gap={3} className="settings-control-row">
          <StackLayout gap={0}>
            <Text>Theme</Text>
            <Text styleAs="label" color="secondary">
              Switch the workspace between light and dark mode.
            </Text>
          </StackLayout>
          <ThemeToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
        </FlexLayout>

        <FlexLayout align="center" gap={3} className="settings-control-row">
          <StackLayout gap={0}>
            <Text>Density</Text>
            <Text styleAs="label" color="secondary">
              Adjust spacing and sizing across the whole workspace.
            </Text>
          </StackLayout>
          <ToggleButtonGroup
            className="density-toggle-group"
            appearance="bordered"
            value={density}
            onChange={(event) => onDensityChange(event.currentTarget.value as Density)}
          >
            {DENSITY_OPTIONS.map(({ value, label }) => (
              <ToggleButton key={value} value={value}>
                {label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </FlexLayout>

        <FlexLayout align="center" gap={3} className="settings-control-row">
          <StackLayout gap={0}>
            <Text>Sidebar width</Text>
            <Text styleAs="label" color="secondary">
              Drag the divider next to the navigation to resize it.
            </Text>
          </StackLayout>
          <Button appearance="bordered" onClick={onResetSidebarWidth}>
            Reset to default
          </Button>
        </FlexLayout>
      </StackLayout>
    </Card>
  )
}
