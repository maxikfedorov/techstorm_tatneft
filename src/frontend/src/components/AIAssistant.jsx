// src/frontend/src/components/AIAssistant.jsx
import { useState, memo } from 'react'
import { 
  Button, 
  Select, 
  Input, 
  Alert, 
  Space
} from 'antd'
import { 
  SendOutlined, 
  LoadingOutlined, 
  ThunderboltOutlined,
  SettingOutlined,
  DatabaseOutlined
} from '@ant-design/icons'
import { useAI } from '../hooks/useAI'
import { useAppContext } from '../context/AppContext'
import { DIAGRAM_TYPES, MODES } from '../constants/diagrams'
import './AIAssistant.css'

const { TextArea } = Input

const AIAssistant = memo(({ code, onCodeUpdate, className = '' }) => {
  const [prompt, setPrompt] = useState('')
  const { state, dispatch } = useAppContext()
  const { isLoading, error, response, generateDiagram } = useAI()

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    try {
      const result = await generateDiagram({
        prompt,
        current_code: code,
        diagram_type: state.diagramType,
        mode: state.mode
      })
      
      if (result?.trim()) {
        onCodeUpdate(result.trim())
        setPrompt('')
      }
    } catch (err) {
      console.error('Generation failed:', err)
    }
  }

  const handleModeChange = (newMode) => {
    dispatch({ type: 'SET_MODE', payload: newMode })
  }

  const handleDiagramTypeChange = (newType) => {
    dispatch({ type: 'SET_DIAGRAM_TYPE', payload: newType })
  }

  return (
    <div className={`industrial-ai-assistant ${className}`}>
      
      {/* Панель состояния нейросети */}
      <div className="neural-status-panel">
        <div className="status-pipeline"></div>
        <div className="glass-status-overlay">
          <div className="neural-indicators">
            <div className="neural-node active"></div>
            <div className="neural-node active"></div>
            <div className="neural-node processing"></div>
          </div>
          <div className="status-info">
            <span className="neural-label">СТАТУС_СИСТЕМЫ</span>
            <span className="neural-state">{isLoading ? 'ОБРАБОТКА' : 'ГОТОВ'}</span>
          </div>
          <div className="processing-load">
            <span className="load-value">{isLoading ? '87%' : '12%'}</span>
          </div>
        </div>
      </div>

      {/* Секция параметров управления */}
      <div className="control-parameters-section">
        <div className="section-header">
          <div className="section-pipeline"></div>
          <div className="glass-section-header">
            <SettingOutlined className="section-icon" />
            <span className="section-title">ПАРАМЕТРЫ_УПРАВЛЕНИЯ</span>
          </div>
        </div>

        <div className="parameters-grid">
          
          {/* Выбор режима */}
          <div className="parameter-block">
            <div className="parameter-header">
              <div className="param-indicator"></div>
              <span className="param-label">РЕЖИМ_РАБОТЫ</span>
            </div>
            <div className="glass-input-container">
              <Select
                value={state.mode}
                onChange={handleModeChange}
                className="industrial-select"
                options={MODES}
                suffixIcon={<ThunderboltOutlined />}
              />
              <div className="input-glass-overlay"></div>
            </div>
          </div>

          {/* Выбор типа диаграммы */}
          <div className="parameter-block">
            <div className="parameter-header">
              <div className="param-indicator"></div>
              <span className="param-label">ТИП_ДИАГРАММЫ</span>
            </div>
            <div className="glass-input-container">
              <Select
                value={state.diagramType}
                onChange={handleDiagramTypeChange}
                className="industrial-select"
                options={DIAGRAM_TYPES}
                suffixIcon={<DatabaseOutlined />}
              />
              <div className="input-glass-overlay"></div>
            </div>
          </div>

        </div>
      </div>

      {/* Интерфейс нейронного ввода */}
      <div className="neural-input-section">
        <div className="section-header">
          <div className="section-pipeline"></div>
          <div className="glass-section-header">
            <SendOutlined className="section-icon" />
            <span className="section-title">ИНТЕРФЕЙС_ВВОДА</span>
          </div>
        </div>

        <div className="input-interface">
          <div className="input-label-container">
            <span className="input-label">
              {state.mode === 'create' ? 'ПРОМПТ_СОЗДАНИЯ' : 'ПРОМПТ_ИЗМЕНЕНИЯ'}
            </span>
            <div className="input-metrics">
              <span className="char-count">{prompt.length}/2048</span>
            </div>
          </div>
          
          <div className="clear-textarea-container">
            <TextArea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                state.mode === 'create' 
                  ? 'Опишите диаграмму, которую хотите создать...' 
                  : 'Опишите, что нужно изменить в диаграмме...'
              }
              rows={5}
              disabled={isLoading}
              className="clear-industrial-textarea"
              maxLength={2048}
            />
          </div>
        </div>
      </div>

      {/* Управление обработкой */}
      <div className="processing-control">
        <div className="control-pipeline"></div>
        <div className="glass-control-container">
          <Button
            className={`industrial-process-btn ${isLoading ? 'processing' : ''}`}
            block
            icon={isLoading ? <LoadingOutlined className="processing-icon" /> : <ThunderboltOutlined />}
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            loading={isLoading}
          >
            <span className="btn-text">
              {isLoading ? 'ОБРАБОТКА_В_ПРОЦЕССЕ...' : 
               state.mode === 'create' ? 'ВЫПОЛНИТЬ_СОЗДАНИЕ' : 'ВЫПОЛНИТЬ_ИЗМЕНЕНИЕ'}
            </span>
          </Button>
        </div>
      </div>

      {/* Система оповещения об ошибках */}
      {error && (
        <div className="error-alert-system">
          <div className="error-pipeline"></div>
          <div className="glass-error-container">
            <div className="error-header">
              <div className="error-indicator"></div>
              <span className="error-title">СИСТЕМНАЯ_ОШИБКА</span>
            </div>
            <div className="error-message">
              <code className="error-code">{error}</code>
            </div>
          </div>
        </div>
      )}

      {/* Терминал вывода */}
      {response && (
        <div className="output-terminal">
          <div className="terminal-header">
            <div className="terminal-pipeline"></div>
            <div className="glass-terminal-header">
              <div className="terminal-indicators">
                <div className="terminal-dot active"></div>
                <div className="terminal-dot active"></div>
                <div className="terminal-dot standby"></div>
              </div>
              <span className="terminal-title">ТЕРМИНАЛ_ВЫВОДА</span>
              <div className="terminal-stats">
                <span className="output-size">{response.length} БАЙТ</span>
              </div>
            </div>
          </div>
          
          <div className="glass-terminal-container">
            <div className="terminal-content">
              <pre className="terminal-output">
                <code>{response}</code>
              </pre>
            </div>
            <div className="terminal-glass-overlay"></div>
          </div>
        </div>
      )}

    </div>
  )
})

AIAssistant.displayName = 'AIAssistant'
export default AIAssistant
