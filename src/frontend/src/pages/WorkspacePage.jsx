// frontend/src/pages/WorkspacePage.jsx
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/common/Header'
import LeftPanel from '../components/workspace/LeftPanel'
import ModificationPanel from '../components/workspace/ModificationPanel'
import InteractiveDiagramViewer from '../components/workspace/InteractiveDiagramViewer'
import RightPanel from '../components/workspace/RightPanel'
import { useWorkspace } from '../hooks/useWorkspace'

function WorkspacePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, setState, generate, save, isNew } = useWorkspace(id)

  if (state.loading) return <div style={{ padding: '20px' }}>Loading workspace...</div>

  const handleSave = async () => {
    const newId = await save()
    if (isNew && newId) navigate(`/workspace/${newId}`, { replace: true })
  }

  return (
    <>
      <Header />
      <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
        <LeftPanel
          history={state.history}
          onSelect={code => setState(s => ({ ...s, code }))}
        />
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ 
            background: '#f8f9fa', 
            padding: '15px', 
            borderBottom: '1px solid #dee2e6',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{ margin: 0 }}>
              {isNew ? 'New Diagram' : state.title || 'Untitled'}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '14px', color: '#6c757d' }}>
                Type: {state.diagramType}
              </span>
              {state.generating && (
                <span style={{ color: '#007bff', fontSize: '14px' }}>● Generating</span>
              )}
              {state.saving && (
                <span style={{ color: '#28a745', fontSize: '14px' }}>● Saving</span>
              )}
              {state.unsaved && !state.saving && (
                <span style={{ color: '#ffc107', fontSize: '14px' }}>● Unsaved</span>
              )}
            </div>
          </div>
          
          <ModificationPanel
            prompt={state.prompt}
            setPrompt={v => setState(s => ({ ...s, prompt: v }))}
            diagramType={state.diagramType}
            setDiagramType={v => setState(s => ({ ...s, diagramType: v }))}
            model={state.model}
            setModel={v => setState(s => ({ ...s, model: v }))}
            onGenerate={generate}
            generating={state.generating}
          />
          
          <InteractiveDiagramViewer 
            code={state.code} 
            generating={state.generating} 
          />
        </div>
        
        <RightPanel
          title={state.title}
          setTitle={v => setState(s => ({ ...s, title: v, unsaved: true }))}
          code={state.code}
          setCode={v => setState(s => ({ ...s, code: v, unsaved: true }))}
          onSave={handleSave}
          unsaved={state.unsaved}
          saving={state.saving}
        />
      </div>
    </>
  )
}

export default WorkspacePage
