import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'salt-dashboard-dark-mode'

// useState accepts a function as its initial value ("lazy initial state").
// React only calls this function once, on the very first render - unlike
// `useState(readStoredPreference())`, which would call it (and hit
// localStorage) on every single render.
function readStoredPreference() {
  return localStorage.getItem(STORAGE_KEY) === 'true'
}

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(readStoredPreference)

  // Anything that reaches outside React - localStorage, document, timers,
  // subscriptions - belongs in useEffect, not directly in the component
  // body. This effect re-runs whenever `darkMode` changes, keeping
  // localStorage synced with state so the preference survives a refresh.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(darkMode))
  }, [darkMode])

  // useCallback memoizes the function reference itself (not its result).
  // Using the functional updater form `(prev) => !prev` means this callback
  // never needs to read `darkMode` directly, so it has no dependencies and
  // its identity never changes across renders - useful when it's handed to
  // a memoized child component (see ThemeToggle + React.memo).
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev)
  }, [])

  return { darkMode, toggleDarkMode }
}
