// frontend/src/components/workspace/ModificationPanel.jsx
import { useModels } from '../../hooks/useModels'
import LoadingSpinner from '../common/LoadingSpinner'

function ModificationPanel({ prompt, setPrompt, diagramType, setDiagramType, model, setModel, onGenerate, generating }) {
  const models = useModels()
  
  const handleGenerate = () => {
    if (generating) return
    onGenerate()
  }
  
  return (
    <section style={{ 
      padding: '20px', 
      borderBottom: '1px solid #dee2e6',
      background: 'white'
    }}>
      <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>Generate New Diagram</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 200px auto', gap: '15px', alignItems: 'end' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
            Description
          </label>
          <textarea
            value={prompt}
            placeholder="Describe what diagram you want to create..."
            onChange={e => setPrompt(e.target.value)}
            rows={3}
            style={{ width: '100%', resize: 'vertical' }}
            disabled={generating}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
            Diagram Type
          </label>
          <select 
            value={diagramType} 
            onChange={e => setDiagramType(e.target.value)} 
            style={{ width: '100%' }}
            disabled={generating}
          >
            <option value="flowchart">Flowchart</option>
            <option value="sequence">Sequence</option>
            <option value="class">Class Diagram</option>
            <option value="er">ER Diagram</option>
            <option value="gantt">Gantt Chart</option>
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
            AI Model
          </label>
          <select 
            value={model} 
            onChange={e => setModel(e.target.value)} 
            style={{ width: '100%' }}
            disabled={generating}
          >
            {models.map(m => (
              <option key={m} value={m}>
                {m.replace('openai/', '').replace('google/', '')}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={handleGenerate}
          disabled={!prompt.trim() || generating}
          style={{ 
            padding: '10px 20px',
            fontSize: '14px',
            height: 'fit-content',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {generating && <LoadingSpinner size="small" inline />}
          {generating ? 'Generating...' : 'Generate'}
        </button>
      </div>
      
      {generating && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          background: '#e3f2fd', 
          borderRadius: '4px',
          fontSize: '14px',
          color: '#1565c0'
        }}>
          AI is generating your diagram... Please wait.
        </div>
      )}
    </section>
  )
}

export default ModificationPanel
