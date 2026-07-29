import { useCallback, useEffect, useState } from 'react'

interface ToastState {
  message: string
  status: 'success' | 'error'
}

export function useToast(autoDismissMs = 4000) {
  const [toast, setToast] = useState<ToastState | null>(null)

  // Re-arms whenever a new toast comes in (`toast` is a dependency), and
  // cleans up its own timer if a newer toast replaces this one before it
  // fires - otherwise a fast second toast could get dismissed early by the
  // first toast's stale timeout.
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), autoDismissMs)
    return () => clearTimeout(timer)
  }, [toast, autoDismissMs])

  const showToast = useCallback((message: string, status: ToastState['status'] = 'success') => {
    setToast({ message, status })
  }, [])

  const dismiss = useCallback(() => setToast(null), [])

  return { toast, showToast, dismiss }
}
