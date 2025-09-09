// frontend/src/components/workspace/ModificationPanel.jsx
import { useModels } from '../../hooks/useModels'
function ModificationPanel({ prompt, setPrompt, diagramType, setDiagramType, model, setModel, onGenerate }) {
  const models = useModels()
  return (
    <section>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4} />
      <select value={diagramType} onChange={e => setDiagramType(e.target.value)}>
        <option value="flowchart">flowchart</option>
        <option value="sequence">sequence</option>
        <option value="class">class</option>
        <option value="er">er</option>
        <option value="gantt">gantt</option>
      </select>
      <select value={model} onChange={e => setModel(e.target.value)}>
        {models.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      <button onClick={onGenerate}>Generate</button>
    </section>
  )
}
export default ModificationPanel
