import { createContext } from 'react'

/**
 * Lets a deeply nested component (like RevenueChart, two levels down inside
 * DashboardPage) read the current theme mode without every component in
 * between having to accept and forward a `darkMode` prop it doesn't
 * otherwise care about. That's the classic "prop drilling" problem Context
 * solves - reach for it only when passing a prop down manually gets painful,
 * not as a default replacement for props.
 */
export const ThemeModeContext = createContext(true)
