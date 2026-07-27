import { useEffect, useState } from 'react'
import type { Density } from '@salt-ds/core'

const STORAGE_KEY = 'salt-dashboard-density'
const DENSITY_VALUES: readonly Density[] = ['high', 'medium', 'low', 'touch']
const DEFAULT_DENSITY: Density = 'medium'

function readStoredDensity(): Density {
  const stored = localStorage.getItem(STORAGE_KEY)
  return (DENSITY_VALUES as readonly string[]).includes(stored ?? '') ? (stored as Density) : DEFAULT_DENSITY
}

export function useDensity() {
  const [density, setDensity] = useState<Density>(readStoredDensity)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, density)
  }, [density])

  return { density, setDensity }
}
