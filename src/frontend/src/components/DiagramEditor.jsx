// src/frontend/src/components/DiagramEditor.jsx
import { useState } from 'react'
import CodeEditor from './CodeEditor'
import DiagramViewer from './DiagramViewer'
import AIAssistant from './AIAssistant'

export default function DiagramEditor() {
  const [code, setCode] = useState('graph TD\n  A[Start] --> B[Process]\n  B --> C[End]')

  const handleCodeUpdate = (newCode) => {
    console.log('Updating code from:', code?.length, 'to:', newCode?.length)
    console.log('New code preview:', newCode?.substring(0, 50) + '...')
    setCode(newCode)
  }

  return (
    <div className="diagram-editor">
      <div className="editor-container">
        <CodeEditor value={code} onChange={setCode} />
        <DiagramViewer code={code} />
      </div>
      <AIAssistant code={code} onCodeUpdate={handleCodeUpdate} />
    </div>
  )
}
