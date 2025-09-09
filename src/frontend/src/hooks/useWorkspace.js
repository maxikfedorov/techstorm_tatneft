// frontend/src/hooks/useWorkspace.js
import { useEffect, useState } from 'react'
import { generateDiagram } from '../services/llm'
import { fetchDiagram, createDiagram, updateDiagram } from '../services/diagrams'

export const useWorkspace = id => {
  const isNew = id === 'new'
  const [state, setState] = useState({
    title: '',
    diagramType: 'flowchart',
    prompt: '',
    code: '',
    history: [],
    loading: true,
    unsaved: false
  })

  useEffect(() => {
    if (isNew) {
      setState(s => ({ ...s, loading: false }))
    } else {
      fetchDiagram(id).then(res => {
        const d = res.data
        setState({
          title: d.title,
          diagramType: d.diagram_type,
          prompt: d.original_prompt,
          code: d.mermaid_code,
          history: [],
          loading: false,
          unsaved: false
        })
      })
    }
  }, [id, isNew])

const generate = async () => {
  const { data } = await generateDiagram({
    prompt: state.prompt,
    diagram_type: state.diagramType,
    model: state.model
  })
    setState(s => ({
      ...s,
      code: data.mermaid_code,
      history: [{ prompt: state.prompt, code: data.mermaid_code }, ...s.history],
      unsaved: true
    }))
  }

  const save = async () => {
    if (isNew) {
      const { data } = await createDiagram({
        title: state.title || 'Untitled',
        diagram_type: state.diagramType,
        mermaid_code: state.code,
        original_prompt: state.prompt
      })
      return data.id
    }
    await updateDiagram(id, {
      title: state.title,
      diagram_type: state.diagramType,
      mermaid_code: state.code
    })
    setState(s => ({ ...s, unsaved: false }))
    return id
  }

  return { state, setState, generate, save, isNew }
}
