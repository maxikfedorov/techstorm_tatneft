// src/frontend/src/App.jsx
import { ConfigProvider, theme, App as AntdApp } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import { AppProvider } from './context/AppContext'
import DiagramEditorPage from './pages/DiagramEditorPage'
import './styles/app-theme.css'

export default function App() {
  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: 'var(--antd-primary)',
          colorTextBase: 'var(--antd-text)',
          colorBgLayout: 'var(--antd-bg-layout)',
          colorBgContainer: 'var(--antd-bg-container)',
          borderRadius: 12,
          controlHeight: 36,
        },
        components: {
          Card: { padding: 0, borderRadius: 12 },
          Button: { controlHeight: 36, borderRadius: 10 },
          Input: { borderRadius: 10 },
          Select: { borderRadius: 10 },
        },
      }}
    >
      <AntdApp>
        <AppProvider>
          <DiagramEditorPage />
        </AppProvider>
      </AntdApp>
    </ConfigProvider>
  )
}
