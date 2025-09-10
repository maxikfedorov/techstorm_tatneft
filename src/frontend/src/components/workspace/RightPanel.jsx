// frontend/src/components/workspace/RightPanel.jsx
import { useState } from 'react'
import DiagramSettings from './DiagramSettings'
import CodeEditor from './CodeEditor'
import ExportPanel from './ExportPanel'

function RightPanel({ title, setTitle, code, setCode, onSave, unsaved, saving }) {
  const [activeTab, setActiveTab] = useState('settings')
  
  const tabs = [
    { id: 'settings', label: 'Settings' },
    { id: 'code', label: 'Code' },
    { id: 'export', label: 'Export' }
  ]
  
  return (
    <aside style={{ 
      width: 320, 
      background: '#f8f9fa', 
      borderLeft: '1px solid #dee2e6',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ 
        display: 'flex',
        borderBottom: '1px solid #dee2e6'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '12px 8px',
              border: 'none',
              background: activeTab === tab.id ? 'white' : 'transparent',
              borderBottom: activeTab === tab.id ? '2px solid #007bff' : '2px solid transparent',
              fontSize: '14px'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div style={{ padding: '20px', flex: 1, overflow: 'auto' }}>
        {activeTab === 'settings' && (
          <DiagramSettings 
            title={title} 
            setTitle={setTitle} 
            onSave={onSave} 
            unsaved={unsaved}
            saving={saving}
          />
        )}
        {activeTab === 'code' && (
          <CodeEditor code={code} setCode={setCode} />
        )}
        {activeTab === 'export' && (
          <ExportPanel code={code} title={title} />
        )}
      </div>
    </aside>
  )
}

export default RightPanel
