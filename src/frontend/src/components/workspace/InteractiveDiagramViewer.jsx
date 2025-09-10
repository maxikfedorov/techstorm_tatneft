// frontend/src/components/workspace/InteractiveDiagramViewer.jsx
import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import LoadingSpinner from '../common/LoadingSpinner'

function InteractiveDiagramViewer({ code, generating }) {
  const ref = useRef(null)
  const [rendering, setRendering] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!code || code.trim() === '') {
      setError(null)
      setRendering(false)
      if (ref.current) ref.current.innerHTML = ''
      return
    }
    
    setRendering(true)
    setError(null)
    
    const timeoutId = setTimeout(() => {
      setError('Rendering timeout')
      setRendering(false)
    }, 10000)
    
    mermaid.initialize({ 
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose'
    })
    
    mermaid.render('live', code)
      .then(r => {
        clearTimeout(timeoutId)
        if (ref.current) {
          ref.current.innerHTML = r.svg
        }
        setRendering(false)
        setError(null)
      })
      .catch(err => {
        clearTimeout(timeoutId)
        console.error('Mermaid render error:', err)
        setError('Invalid diagram syntax')
        setRendering(false)
      })
    
    return () => clearTimeout(timeoutId)
  }, [code])

  const showSpinner = generating || rendering
  const showError = error && !showSpinner
  const showEmpty = (!code || code.trim() === '') && !showSpinner && !generating

  return (
    <div style={{ 
      flex: 1, 
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      background: '#fafafa',
      overflow: 'auto'
    }}>
      {showSpinner && (
        <div style={{ textAlign: 'center' }}>
          <LoadingSpinner size="large" />
          <p style={{ marginTop: '15px', color: '#666' }}>
            {generating ? 'AI is generating your diagram...' : 'Rendering diagram...'}
          </p>
          {generating && (
            <p style={{ fontSize: '14px', color: '#999', marginTop: '5px' }}>
              This may take up to 60 seconds
            </p>
          )}
        </div>
      )}
      
      {showError && (
        <div style={{ 
          textAlign: 'center',
          color: '#dc3545',
          padding: '20px',
          background: '#f8d7da',
          borderRadius: '4px',
          maxWidth: '400px'
        }}>
          <h4>Render Error</h4>
          <p>{error}</p>
          <small>Check your diagram syntax in the Code tab</small>
        </div>
      )}
      
      {showEmpty && (
        <div style={{ textAlign: 'center', color: '#666' }}>
          <h3>No diagram yet</h3>
          <p>Enter a description and click Generate to create your diagram</p>
          <p style={{ fontSize: '14px', marginTop: '10px' }}>
            Or write Mermaid code directly in the Code tab
          </p>
        </div>
      )}
      
      {!showSpinner && !showError && code && code.trim() !== '' && (
        <div 
          ref={ref} 
          style={{ 
            width: '100%', 
            textAlign: 'center',
            maxWidth: '100%',
            overflow: 'auto'
          }} 
        />
      )}
    </div>
  )
}

export default InteractiveDiagramViewer
