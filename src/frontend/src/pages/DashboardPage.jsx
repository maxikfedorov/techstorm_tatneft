// frontend/src/pages/DashboardPage.jsx
import Header from '../components/common/Header'
import { useDiagrams } from '../hooks/useDiagrams'
import LoadingSpinner from '../components/common/LoadingSpinner'
import StatsCard from '../components/dashboard/StatsCard'
import { Link } from 'react-router-dom'

function DashboardPage() {
  const { diagrams, loading } = useDiagrams()

  if (loading) return <LoadingSpinner />

  return (
    <>
      <Header />
      <main>
        <Link to="/workspace/new">New Diagram</Link>
        <StatsCard />
        <ul>
          {diagrams.map(d => (
            <li key={d.id}>
              <Link to={`/workspace/${d.id}`}>{d.title}</Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}

export default DashboardPage
