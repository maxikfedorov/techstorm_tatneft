// frontend/src/hooks/useWorkspace.js
import { useEffect, useState, useCallback } from 'react'
import { generateDiagram } from '../services/llm'
import { fetchDiagram, createDiagram, updateDiagram } from '../services/diagrams'
import { fetchWorkspace } from '../services/workspace'
import { useNotification } from '../components/common/NotificationProvider'

export const useWorkspace = id => {
  const isNew = id === 'new'
  const notify = useNotification()
  const [state, setState] = useState({
    title: '',
    diagramType: 'flowchart',
    model: 'openai/gpt-oss-20b',
    prompt: '',
    code: '',
    history: [],
    loading: true,
    generating: false,
    saving: false,
    unsaved: false,
    initialized: false
  })

  useEffect(() => {
    if (state.initialized) return
    
    if (isNew) {
      setState(s => ({ 
        ...s, 
        loading: false, 
        initialized: true,
        code: 'flowchart TD\n    A[Start] --> B[End]' // Базовый пример для новых диаграмм
      }))
    } else {
      setState(s => ({ ...s, loading: true }))
      fetchWorkspace(id).then(res => {
        const d = res.data
        setState(s => ({
          ...s,
          title: d.title,
          diagramType: d.diagram_type,
          model: s.model,
          prompt: d.current_prompt,
          code: d.mermaid_code || '',
          history: d.generation_history || [],
          loading: false,
          generating: false,
          saving: false,
          unsaved: d.has_unsaved_changes,
          initialized: true
        }))
      }).catch((err) => {
        console.error('Workspace load error:', err)
        notify('Failed to load workspace', 'error')
        setState(s => ({ ...s, loading: false, generating: false, saving: false, initialized: true }))
      })
    }
  }, [id, isNew, notify, state.initialized])

  const generate = useCallback(async () => {
    if (state.generating || state.loading) return
    
    console.log('Starting generation with:', {
      prompt: state.prompt,
      type: state.diagramType,
      model: state.model
    })
    
    setState(s => ({ ...s, generating: true }))
    
    try {
      const { data } = await generateDiagram({
        prompt: state.prompt,
        diagram_type: state.diagramType,
        model: state.model
      })
      
      console.log('Generation successful:', data)
      
      setState(s => ({
        ...s,
        code: data.mermaid_code,
        history: [{ 
          prompt: s.prompt, 
          code: data.mermaid_code, 
          timestamp: new Date().toISOString() 
        }, ...s.history],
        unsaved: true,
        generating: false
      }))
      
      notify('Diagram generated successfully', 'success')
    } catch (err) {
      console.error('Generation error:', err)
      
      setState(s => ({ ...s, generating: false }))
      
      if (err.response?.status === 403) {
        notify('Session expired. Please login again.', 'error')
      } else if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        notify('Generation timeout. AI model may be slow - try again.', 'error')
      } else if (err.response?.status >= 500) {
        notify('Server error during generation', 'error')
      } else {
        const errorMsg = err.response?.data?.detail || 'Generation failed'
        notify(errorMsg, 'error')
      }
    }
  }, [state.prompt, state.diagramType, state.model, state.generating, state.loading, notify])

  const save = useCallback(async () => {
    if (state.saving) return null
    
    setState(s => ({ ...s, saving: true }))
    
    try {
      let result
      if (isNew) {
        const { data } = await createDiagram({
          title: state.title || 'Untitled',
          diagram_type: state.diagramType,
          mermaid_code: state.code,
          original_prompt: state.prompt
        })
        result = data.id
        notify('Diagram created', 'success')
      } else {
        await updateDiagram(id, {
          title: state.title,
          diagram_type: state.diagramType,
          mermaid_code: state.code
        })
        result = id
        notify('Diagram saved', 'success')
      }
      
      setState(s => ({ ...s, unsaved: false, saving: false }))
      return result
    } catch (err) {
      console.error('Save error:', err)
      notify('Save failed', 'error')
      setState(s => ({ ...s, saving: false }))
      return null
    }
  }, [state.saving, state.title, state.diagramType, state.code, state.prompt, isNew, id, notify])

  const updateState = useCallback((updater) => {
    setState(updater)
  }, [])

  return { state, setState: updateState, generate, save, isNew }
}
