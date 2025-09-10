// frontend/src/components/workspace/CodeEditor.jsx
import { useState, useEffect } from 'react'

function CodeEditor({ code, setCode }) {
  const [localCode, setLocalCode] = useState(code)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    setLocalCode(code)
    setIsDirty(false)
  }, [code])

  const handleChange = (e) => {
    const newCode = e.target.value
    setLocalCode(newCode)
    setIsDirty(true)
    
    // Автоматическое обновление с задержкой
    const timeoutId = setTimeout(() => {
      setCode(newCode)
      setIsDirty(false)
    }, 10000)
    
    return () => clearTimeout(timeoutId)
  }

  const handleApply = () => {
    setCode(localCode)
    setIsDirty(false)
  }

  const handleReset = () => {
    setLocalCode(code)
    setIsDirty(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h4 style={{ margin: 0, fontSize: '16px' }}>Mermaid Code</h4>
        {isDirty && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleApply} style={{ fontSize: '12px', padding: '4px 8px' }}>
              Apply
            </button>
            <button onClick={handleReset} style={{ fontSize: '12px', padding: '4px 8px', background: '#6c757d' }}>
              Reset
            </button>
          </div>
        )}
      </div>
      
      <textarea
        value={localCode}
        onChange={handleChange}
        style={{ 
          width: '100%', 
          height: '300px', 
          fontFamily: 'monospace',
          fontSize: '14px',
          border: isDirty ? '2px solid #ffc107' : '1px solid #ddd',
          borderRadius: '4px',
          padding: '10px'
        }}
        placeholder="Enter Mermaid code here..."
      />
      
      {isDirty && (
        <p style={{ fontSize: '12px', color: '#ffc107', marginTop: '5px' }}>
          Changes will be applied automatically in 10 seconds, or click Apply
        </p>
      )}
      
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#6c757d' }}>
        <details>
          <summary>Mermaid Examples</summary>
          <pre style={{ fontSize: '11px', background: '#f8f9fa', padding: '8px', marginTop: '5px' }}>{`flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[End]

sequence diagram:
sequenceDiagram
    Alice->>Bob: Hello
    Bob-->>Alice: Hi`}</pre>
        </details>
      </div>
    </div>
  )
}

export default CodeEditor
