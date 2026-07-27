import { useEffect, useState } from 'react'
import { Text } from '@salt-ds/core'

export function LastUpdated() {
  const [secondsAgo, setSecondsAgo] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondsAgo((prev) => prev + 1)
    }, 1000)

    // The function returned from useEffect is a *cleanup* function. React
    // runs it before the effect re-runs and when the component unmounts.
    // Skip this and the interval keeps ticking (and leaking memory) even
    // after the user navigates away from the page that rendered it - one of
    // the most common real-world useEffect bugs.
    return () => clearInterval(intervalId)
  }, [])

  return (
    <Text styleAs="label" color="secondary">
      Updated {secondsAgo === 0 ? 'just now' : `${secondsAgo}s ago`}
    </Text>
  )
}
