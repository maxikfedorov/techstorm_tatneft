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

  if (state.loading) return null

  const handleSave = async () => {
    const newId = await save()
    if (isNew) navigate(`/workspace/${newId}`, { replace: true })
  }

  return (
    <>
      <Header />
      <div style={{ display: 'flex', height: 'calc(100vh - 40px)' }}>
        <LeftPanel
          history={state.history}
          onSelect={code => setState(s => ({ ...s, code }))}
        />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <ModificationPanel
            prompt={state.prompt}
            setPrompt={v => setState(s => ({ ...s, prompt: v }))}
            diagramType={state.diagramType}
            setDiagramType={v => setState(s => ({ ...s, diagramType: v }))}
            onGenerate={generate}
          />
          <InteractiveDiagramViewer code={state.code} />
        </div>
        <RightPanel
          title={state.title}
          setTitle={v => setState(s => ({ ...s, title: v, unsaved: true }))}
          code={state.code}
          setCode={v => setState(s => ({ ...s, code: v, unsaved: true }))}
          onSave={handleSave}
          unsaved={state.unsaved}
        />
      </div>
    </>
  )
}

export default WorkspacePage
