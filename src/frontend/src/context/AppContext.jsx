import { createContext, useContext, useReducer } from 'react'

const AppContext = createContext()

const initialState = {
  code: 'graph TD\n  A[Start] --> B[Process]\n  B --> C[End]',
  diagramType: 'flowchart',
  mode: 'create',
  theme: 'dark',
  settings: {
    autoSave: true,
    fontSize: 14,
    wordWrap: true,
    minimap: false
  }
}

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CODE':
      return { ...state, code: action.payload }
    case 'SET_DIAGRAM_TYPE':
      return { ...state, diagramType: action.payload }
    case 'SET_MODE':
      return { ...state, mode: action.payload }
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'UPDATE_SETTINGS':
      return { 
        ...state, 
        settings: { ...state.settings, ...action.payload }
      }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}
