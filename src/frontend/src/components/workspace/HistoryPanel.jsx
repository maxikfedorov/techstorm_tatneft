// frontend/src/components/workspace/HistoryPanel.jsx
function HistoryPanel({ items, onSelect }) {
  return (
    <aside style={{ width: 240 }}>
      <h4>History</h4>
      <ul>
        {items.map(i => (
          <li key={i.id}>
            <button onClick={() => onSelect(i.code)}>
              {i.prompt.slice(0, 30)}…
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
export default HistoryPanel
