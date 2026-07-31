import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// This jsdom/Node combination doesn't provide a working `localStorage`
// (window.localStorage is undefined here, independent of anything Salt- or
// app-specific) - polyfill a minimal in-memory Storage so the app's actual
// localStorage-backed hooks (useDarkMode, useDensity, useResizableWidth)
// can be tested as written, without changing how they talk to the browser.
function createMemoryStorage(): Storage {
  const store = new Map<string, string>()
  return {
    getItem: (key) => (store.has(key) ? store.get(key)! : null),
    setItem: (key, value) => {
      store.set(key, String(value))
    },
    removeItem: (key) => {
      store.delete(key)
    },
    clear: () => {
      store.clear()
    },
    key: (index) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size
    },
  }
}

const memoryStorage = createMemoryStorage()
for (const target of [window, globalThis] as const) {
  Object.defineProperty(target, 'localStorage', {
    value: memoryStorage,
    writable: true,
    configurable: true,
  })
}

// Unmounts anything rendered by the previous test so components don't pile
// up in jsdom's document across tests (React Testing Library doesn't do
// this automatically outside of Jest's auto-config).
afterEach(() => {
  cleanup()
})

// jsdom doesn't implement matchMedia, but Salt's theme/breakpoint code
// queries it (e.g. for prefers-color-scheme). Without this, any test that
// renders a SaltProvider throws "matchMedia is not a function".
if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}

// jsdom doesn't implement ResizeObserver either, which Salt's responsive/
// breakpoint-aware layout components use internally.
if (!window.ResizeObserver) {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

// jsdom's CSS.supports is missing too, and Highcharts checks it at module
// load time (for CSS animation support) before any component even renders -
// without this, merely importing a chart component throws.
if (!window.CSS?.supports) {
  window.CSS = { ...window.CSS, supports: () => false } as typeof window.CSS
}
