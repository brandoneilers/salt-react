import { useEffect, useRef } from 'react'
import type Highcharts from 'highcharts'
import type { HighchartsReactRefObject } from 'highcharts-react-official'
import HighchartsReact from '../lib/HighchartsReact'

interface ResponsiveHighchartsProps {
  highcharts: typeof Highcharts
  options: Highcharts.Options
}

// Highcharts only reflows its SVG in response to the browser window's own
// resize event - it has no idea when its *container* changes size for any
// other reason. In this app that happens when the sidebar is dragged: the
// window itself doesn't resize, so the chart's stale, now-too-wide SVG
// keeps its old dimensions, which in turn forces the CSS Grid track it
// sits in to stay inflated - dragging neighboring grid items into overflow
// right along with it, even though they have no oversized content of
// their own. A ResizeObserver watches the actual container element and
// tells the chart to remeasure whenever it changes, regardless of cause.
export function ResponsiveHighcharts({ highcharts, options }: ResponsiveHighchartsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<HighchartsReactRefObject>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(() => {
      chartRef.current?.chart?.reflow()
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef}>
      <HighchartsReact highcharts={highcharts} options={options} ref={chartRef} />
    </div>
  )
}
