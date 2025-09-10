// frontend/src/components/common/EmptyState.jsx
function EmptyState({ title, description, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && action}
    </div>
  )
}

export default EmptyState
