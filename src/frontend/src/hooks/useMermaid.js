import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

export const useMermaid = (code, options = {}) => {
  const containerRef = useRef(null)
  const [isRendering, setIsRendering] = useState(false)
  const [error, setError] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const defaultConfig = {
    startOnLoad: false,
    theme: 'dark',
    ...options
  }

  useEffect(() => {
    mermaid.initialize(defaultConfig)
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (!code || !containerRef.current || !isInitialized) return

    const renderDiagram = async () => {
      setIsRendering(true)
      setError(null)
      
      try {
        containerRef.current.innerHTML = ''
        const { svg } = await mermaid.render(`mermaid-${Date.now()}`, code)
        containerRef.current.innerHTML = svg
      } catch (err) {
        const errorMessage = err.message || 'Ошибка рендеринга диаграммы'
        setError(errorMessage)
        containerRef.current.innerHTML = `<div class="render-error" data-error="${errorMessage}">Ошибка: ${errorMessage}</div>`
      } finally {
        setIsRendering(false)
      }
    }

    renderDiagram()
  }, [code, isInitialized])

  return {
    containerRef,
    isRendering,
    error,
    isInitialized
  }
}
