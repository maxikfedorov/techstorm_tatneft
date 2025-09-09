// frontend/src/components/workspace/RightPanel.jsx
import DiagramSettings from './DiagramSettings'
import CodeEditor from './CodeEditor'

function RightPanel({ title, setTitle, code, setCode, onSave, unsaved }) {
  return (
    <aside style={{ width: 300 }}>
      <DiagramSettings title={title} setTitle={setTitle} onSave={onSave} unsaved={unsaved} />
      <CodeEditor code={code} setCode={setCode} />
    </aside>
  )
}

export default RightPanel
