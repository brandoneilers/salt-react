import HighchartsReactImport from 'highcharts-react-official'

// highcharts-react-official ships a UMD build whose nested `default` export
// isn't statically detectable by esbuild's CJS->ESM interop, so the default
// import above resolves to the whole exports object instead of the
// component. Shared here so every chart only has to work around it once.
const HighchartsReact = ((HighchartsReactImport as unknown as { default?: unknown }).default ??
  HighchartsReactImport) as typeof HighchartsReactImport

export default HighchartsReact
