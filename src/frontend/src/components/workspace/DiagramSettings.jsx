// frontend/src/components/workspace/DiagramSettings.jsx
function DiagramSettings({ title, setTitle, onSave, unsaved }) {
  return (
    <div>
      <input value={title} placeholder="Название" onChange={e => setTitle(e.target.value)} />
      <button disabled={!unsaved} onClick={onSave}>Сохранить</button>
    </div>
  )
}

export default DiagramSettings
