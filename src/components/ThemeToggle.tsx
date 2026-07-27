import { memo, useId } from 'react'
import { FlexLayout, Switch } from '@salt-ds/core'
import { LightIcon, DarkIcon } from '@salt-ds/icons'

interface ThemeToggleProps {
  darkMode: boolean
  onToggle: () => void
}

function ThemeToggleComponent({ darkMode, onToggle }: ThemeToggleProps) {
  // useId generates a unique, stable id per component instance - safe even
  // for server-rendered output (unlike Math.random() or a module-level
  // counter, which can mismatch between server and client). Useful whenever
  // you need to wire two elements together with aria-* attributes.
  const labelId = useId()

  return (
    <FlexLayout align="center" gap={1} className="theme-toggle">
      <LightIcon aria-hidden color={darkMode ? 'secondary' : 'primary'} />
      <span id={labelId} className="visually-hidden">
        Toggle dark mode
      </span>
      <Switch checked={darkMode} onChange={() => onToggle()} aria-labelledby={labelId} />
      <DarkIcon aria-hidden color={darkMode ? 'primary' : 'secondary'} />
    </FlexLayout>
  )
}

// React.memo skips re-rendering this component when its props haven't
// changed (shallow comparison). It only pays off when the props passed in
// are themselves stable across renders - which is why App.tsx uses
// useCallback for the `onToggle` handler it passes down. Without that,
// a new function prop every render would defeat the memoization entirely.
export const ThemeToggle = memo(ThemeToggleComponent)
