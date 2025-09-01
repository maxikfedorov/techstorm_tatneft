// src/frontend/src/components/ProjectInfo.jsx
import { useState } from 'react'
import { InfoCircleOutlined, GithubOutlined, UserOutlined, CloseOutlined } from '@ant-design/icons'
import './ProjectInfo.css'

const ProjectInfo = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  const togglePanel = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="project-info-handle">
      {/* Выдвижная ручка */}
      <div 
        className={`info-handle ${isExpanded ? 'expanded' : ''}`}
        onClick={togglePanel}
      >
        <div className="handle-pipeline"></div>
        <div className="glass-handle-content">
          {isExpanded ? (
            <CloseOutlined className="handle-icon" />
          ) : (
            <InfoCircleOutlined className="handle-icon" />
          )}
          <span className="handle-text">
            {isExpanded ? 'ЗАКРЫТЬ' : 'ПРОЕКТ'}
          </span>
        </div>
      </div>

      {/* Выдвижная панель */}
      <div className={`info-panel ${isExpanded ? 'panel-expanded' : ''}`}>
        <div className="panel-glass-overlay">
          <div className="panel-content">
            
            <div className="project-header">
              <div className="project-pipeline"></div>
              <div className="project-title-section">
                <h3 className="project-title">MERMAID INDUSTRIAL EDITOR</h3>
                <span className="project-version">v1.0.0 ALPHA</span>
              </div>
            </div>

            <div className="project-description">
              <p className="description-text">
                Промышленный редактор диаграмм с интеграцией ИИ-ассистента. 
                Создание и редактирование Mermaid-диаграмм в режиме реального времени.
              </p>
            </div>

            <div className="project-features">
              <div className="feature-item">
                <div className="feature-indicator"></div>
                <span className="feature-text">Визуальный редактор кода</span>
              </div>
              <div className="feature-item">
                <div className="feature-indicator"></div>
                <span className="feature-text">ИИ-генерация диаграмм</span>
              </div>
              <div className="feature-item">
                <div className="feature-indicator"></div>
                <span className="feature-text">Экспорт в SVG</span>
              </div>
            </div>

            <div className="project-links">
              <div className="link-item">
                <GithubOutlined className="link-icon" />
                <span className="link-text">GitHub Repository</span>
              </div>
              <div className="link-item">
                <UserOutlined className="link-icon" />
                <span className="link-text">Developer: RTU MIREA</span>
              </div>
            </div>

            <div className="tech-stack">
              <span className="tech-label">СТЕК_ТЕХНОЛОГИЙ:</span>
              <div className="tech-tags">
                <span className="tech-tag">React</span>
                <span className="tech-tag">Ant Design</span>
                <span className="tech-tag">Monaco Editor</span>
                <span className="tech-tag">Mermaid.js</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectInfo
