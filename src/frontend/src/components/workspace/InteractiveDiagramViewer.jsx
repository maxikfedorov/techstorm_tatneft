// frontend/src/components/workspace/InteractiveDiagramViewer.jsx
import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

function InteractiveDiagramViewer({ code }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!code) return
    mermaid.initialize({ startOnLoad: false })
    mermaid.render('live', code).then(r => {
      if (ref.current) ref.current.innerHTML = r.svg
    })
  }, [code])

  return <div ref={ref} style={{ flex: 1 }} />
}

export default InteractiveDiagramViewer
