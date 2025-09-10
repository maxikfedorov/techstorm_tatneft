// frontend/src/pages/DashboardPage.jsx
import { useState } from 'react'
import Header from '../components/common/Header'
import { useDiagrams } from '../hooks/useDiagrams'
import LoadingSpinner from '../components/common/LoadingSpinner'
import StatsCard from '../components/dashboard/StatsCard'
import DiagramSearch from '../components/dashboard/DiagramSearch'
import DiagramCard from '../components/dashboard/DiagramCard'
import EmptyState from '../components/common/EmptyState'
import { Link } from 'react-router-dom'

function DashboardPage() {
  const { diagrams, loading } = useDiagrams()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  if (loading) return <LoadingSpinner />

  const filtered = diagrams.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase())
    const matchesType = !typeFilter || d.diagram_type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <>
      <Header />
      <main style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Link to="/workspace/new">
            <button style={{ padding: '10px 20px', marginRight: '20px' }}>
              New Diagram
            </button>
          </Link>
        </div>
        
        <StatsCard />
        
        <DiagramSearch 
          search={search} 
          setSearch={setSearch}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
        />

        {filtered.length === 0 && diagrams.length === 0 ? (
          <EmptyState 
            title="No diagrams yet" 
            description="Create your first diagram to get started"
            action={<Link to="/workspace/new"><button>Create Diagram</button></Link>}
          />
        ) : filtered.length === 0 ? (
          <EmptyState 
            title="No results found" 
            description="Try adjusting your search or filter"
          />
        ) : (
          <div>
            {filtered.map(d => (
              <DiagramCard key={d.id} diagram={d} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}

export default DashboardPage
