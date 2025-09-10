// frontend/src/components/workspace/LeftPanel.jsx
function LeftPanel({ history, onSelect }) {
  return (
    <aside style={{ 
      width: 250, 
      background: '#f8f9fa', 
      borderRight: '1px solid #dee2e6',
      padding: '20px',
      overflowY: 'auto'
    }}>
      <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>Generation History</h3>
      
      {history.length === 0 ? (
        <p style={{ color: '#6c757d', fontSize: '14px' }}>No previous generations</p>
      ) : (
        <ul style={{ listStyle: 'none' }}>
          {history.map((h, i) => (
            <li key={i} style={{ marginBottom: '10px' }}>
              <button 
                onClick={() => onSelect(h.code)}
                style={{ 
                  width: '100%',
                  textAlign: 'left',
                  background: 'white',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  padding: '8px',
                  fontSize: '12px'
                }}
                title={h.prompt}
              >
                {h.prompt.slice(0, 30)}...
                <br />
                <small style={{ color: '#6c757d' }}>
                  {new Date(h.timestamp).toLocaleTimeString()}
                </small>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}

export default LeftPanel
