// frontend/src/components/workspace/DiagramSettings.jsx
import LoadingSpinner from '../common/LoadingSpinner'

function DiagramSettings({ title, setTitle, onSave, unsaved, saving }) {
  return (
    <div>
      <h4 style={{ marginBottom: '15px', fontSize: '16px' }}>Diagram Settings</h4>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
          Title
        </label>
        <input 
          value={title} 
          placeholder="Enter diagram title" 
          onChange={e => setTitle(e.target.value)}
          style={{ width: '100%' }}
          disabled={saving}
        />
      </div>
      
      <button 
        disabled={!unsaved || saving} 
        onClick={onSave}
        style={{ 
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        {saving && <LoadingSpinner size="small" inline />}
        {saving ? 'Saving...' : unsaved ? 'Save Changes' : 'Saved'}
      </button>
      
      {unsaved && !saving && (
        <p style={{ fontSize: '12px', color: '#ffc107', marginTop: '8px' }}>
          You have unsaved changes
        </p>
      )}
    </div>
  )
}

export default DiagramSettings
