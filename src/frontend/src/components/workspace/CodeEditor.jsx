// frontend/src/components/workspace/CodeEditor.jsx
function CodeEditor({ code, setCode }) {
  return (
    <textarea
      value={code}
      onChange={e => setCode(e.target.value)}
      style={{ width: '100%', height: 200 }}
    />
  )
}

export default CodeEditor
