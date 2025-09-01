// src/frontend/src/App.jsx
import { ConfigProvider, theme } from 'antd'
import { AppProvider } from './context/AppContext'
import DiagramEditorPage from './pages/DiagramEditorPage'
import ruRU from 'antd/locale/ru_RU'
import './App.css'

export default function App() {
  return (
    <ConfigProvider 
      locale={ruRU}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#667eea',
          borderRadius: 8,
        }
      }}
    >
      <AppProvider>
        <DiagramEditorPage />
      </AppProvider>
    </ConfigProvider>
  )
}
