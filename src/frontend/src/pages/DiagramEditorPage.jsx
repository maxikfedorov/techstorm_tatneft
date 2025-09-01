// src/frontend/src/pages/DiagramEditorPage.jsx
import { Layout } from 'antd'
import { CodeOutlined, EyeOutlined, RobotOutlined } from '@ant-design/icons'
import CodeEditor from '../components/CodeEditor'
import DiagramViewer from '../components/DiagramViewer'
import AIAssistant from '../components/AIAssistant'
import ProjectInfo from '../components/ProjectInfo' // Новый импорт
import { useState } from 'react'
import './DiagramEditorPage.css'

const { Content, Sider } = Layout

export default function DiagramEditorPage() {
  const [code, setCode] = useState('graph TD\n  A[Start] --> B[Process]\n  B --> C[End]')

  const handleCodeUpdate = (newCode) => {
    console.log('Updating code from:', code?.length, 'to:', newCode?.length)
    console.log('New code preview:', newCode?.substring(0, 50) + '...')
    setCode(newCode)
  }

  return (
    <Layout className="industrial-editor-layout">
      {/* Убираем старый industrial-header */}
      
      {/* Добавляем новую выдвижную ручку */}
      <ProjectInfo />

      <Content className="industrial-main-content">
        <div className="control-room-panels">
          
          {/* Code Editor Panel - Left Side */}
          <div className="industrial-panel code-editor-panel">
            <div className="panel-header">
              <div className="header-pipeline"></div>
              <div className="glass-overlay-header">
                <CodeOutlined className="panel-icon" />
                <span className="panel-title">ИНТЕРФЕЙС_КОДА</span>
                <div className="system-metrics">
                  <span className="metric-value">{code.length}</span>
                  <span className="metric-unit">СИМВОЛОВ</span>
                </div>
              </div>
            </div>
            
            <div className="glass-container">
              <div className="industrial-content">
                <CodeEditor value={code} onChange={setCode} />
              </div>
              <div className="glass-overlay"></div>
            </div>
          </div>

          {/* Diagram Viewer Panel - Center */}
          <div className="industrial-panel diagram-viewer-panel">
            <div className="panel-header">
              <div className="header-pipeline"></div>
              <div className="glass-overlay-header">
                <EyeOutlined className="panel-icon" />
                <span className="panel-title">ВИЗУАЛЬНЫЙ_ВЫВОД</span>
                <div className="system-metrics">
                  <div className="status-indicator online"></div>
                  <span className="metric-label">В_СЕТИ</span>
                </div>
              </div>
            </div>
            
            <div className="glass-container">
              <div className="industrial-content">
                <DiagramViewer code={code} />
              </div>
              <div className="glass-overlay"></div>
            </div>
          </div>

        </div>
      </Content>
      
      {/* AI Assistant Control Panel - Right Sidebar */}
      <Sider width={420} className="ai-control-sider">
        <div className="ai-control-panel">
          <div className="control-header">
            <div className="pipeline-vertical"></div>
            <div className="glass-control-header">
              <RobotOutlined className="ai-icon" />
              <div className="control-title-section">
                <span className="control-title">ИИ_ПРОЦЕССОР</span>
                <span className="control-subtitle">НЕЙРОННЫЙ_ИНТЕРФЕЙС</span>
              </div>
              <div className="processor-status">
                <div className="cpu-indicator"></div>
              </div>
            </div>
          </div>
          
          <div className="ai-glass-container">
            <div className="ai-industrial-content">
              <AIAssistant code={code} onCodeUpdate={handleCodeUpdate} />
            </div>
            <div className="ai-glass-overlay"></div>
          </div>
        </div>
      </Sider>
    </Layout>
  )
}
