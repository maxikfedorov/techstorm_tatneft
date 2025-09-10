// frontend/src/components/dashboard/DiagramSearch.jsx
function DiagramSearch({ search, setSearch, typeFilter, setTypeFilter }) {
  return (
    <div>
      <input 
        placeholder="Search diagrams..." 
        value={search} 
        onChange={e => setSearch(e.target.value)} 
      />
      <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
        <option value="">All types</option>
        <option value="flowchart">Flowchart</option>
        <option value="sequence">Sequence</option>
        <option value="class">Class</option>
        <option value="er">ER</option>
        <option value="gantt">Gantt</option>
      </select>
    </div>
  )
}

export default DiagramSearch
