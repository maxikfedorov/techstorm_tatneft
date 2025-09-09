// frontend/src/components/dashboard/StatsCard.jsx
import { useStats } from '../../hooks/useStats'
function StatsCard() {
  const stats = useStats()
  if (!stats) return null
  return (
    <section>
      <h3>Stats</h3>
      <p>Total: {stats.total_diagrams}</p>
      <ul>
        {Object.entries(stats.by_type).map(([k, v]) => (
          <li key={k}>{k}: {v}</li>
        ))}
      </ul>
    </section>
  )
}
export default StatsCard
