// frontend/src/components/dashboard/DiagramCard.jsx
import { Link } from 'react-router-dom'

function DiagramCard({ diagram }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px' }}>
      <h4>{diagram.title}</h4>
      <p>Type: {diagram.diagram_type}</p>
      <p>Updated: {new Date(diagram.updated_at).toLocaleDateString()}</p>
      <Link to={`/workspace/${diagram.id}`}>Open</Link>
    </div>
  )
}

export default DiagramCard
