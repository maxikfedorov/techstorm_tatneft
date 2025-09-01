// src/frontend/src/components/DiagramViewer.jsx
import { memo } from 'react'
import { Button, Space, Spin, Alert, message } from 'antd'
import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons'
import { useMermaid } from '../hooks/useMermaid'
import { useAppContext } from '../context/AppContext'

const DiagramViewer = memo(({ code, className = '', ...props }) => {
  const { state } = useAppContext()
  const { containerRef, isRendering, error, isInitialized } = useMermaid(code, {
    theme: state.theme
  })

  const handleExport = async (format = 'svg') => {
    if (!containerRef.current) return
    
    const svgElement = containerRef.current.querySelector('svg')
    if (!svgElement) return

    try {
      if (format === 'svg') {
        const serializer = new XMLSerializer()
        const svgString = serializer.serializeToString(svgElement)
        const blob = new Blob([svgString], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = 'diagram.svg'
        link.click()
        URL.revokeObjectURL(url)
        
        message.success('Диаграмма экспортирована')
      }
    } catch (err) {
      message.error('Не удалось экспортировать диаграмму')
    }
  }

  if (!isInitialized) {
    return (
      <div className={`diagram-viewer ${className}`} {...props}>
        <div className="diagram-viewer__loading">
          <Spin 
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            tip="Инициализация Mermaid..."
          />
        </div>
      </div>
    )
  }

  return (
    <div className={`diagram-viewer ${className}`} {...props}>
      <div className="diagram-viewer__toolbar">
        <Space>
          <Button 
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => handleExport('svg')}
            disabled={isRendering || error}
            size="small"
          >
            Экспорт SVG
          </Button>
        </Space>
      </div>
      
      <div className="diagram-viewer__content">
        {isRendering && (
          <div className="diagram-viewer__overlay">
            <Spin 
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              tip="Рендеринг диаграммы..."
            />
          </div>
        )}
        
        {error && (
          <Alert 
            message="Ошибка рендеринга"
            description={error}
            type="error"
            showIcon
            className="diagram-viewer__error"
          />
        )}
        
        <div 
          className="diagram-viewer__container" 
          ref={containerRef}
          style={{ 
            opacity: isRendering ? 0.5 : 1,
            minHeight: error ? 0 : '400px'
          }}
        />
      </div>
    </div>
  )
})

DiagramViewer.displayName = 'DiagramViewer'
export default DiagramViewer
