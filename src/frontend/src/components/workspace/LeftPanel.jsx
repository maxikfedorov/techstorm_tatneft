// frontend/src/components/workspace/LeftPanel.jsx
function LeftPanel({ history, onSelect }) {
  return (
    <aside style={{ width: 200 }}>
      <ul>
        {history.map((h, i) => (
          <li key={i}>
            <button onClick={() => onSelect(h.code)}>{h.prompt.slice(0, 20)}</button>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default LeftPanel
