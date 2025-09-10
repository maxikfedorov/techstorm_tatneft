// frontend/src/components/workspace/ExportPanel.jsx
function ExportPanel({ code, title }) {
  const exportSVG = () => {
    const svgElement = document.querySelector('#live svg')
    if (!svgElement) return
    const svgData = new XMLSerializer().serializeToString(svgElement)
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title || 'diagram'}.svg`
    a.click()
  }

  const exportCode = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title || 'diagram'}.mmd`
    a.click()
  }

  return (
    <div>
      <button onClick={exportSVG}>Export SVG</button>
      <button onClick={exportCode}>Export Code</button>
    </div>
  )
}

export default ExportPanel
