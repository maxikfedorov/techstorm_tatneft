// src/frontend/src/components/DiagramViewer.jsx
import { memo, useMemo, useRef, useState, useEffect, useCallback } from 'react'
import { Button, Space, Spin, Alert, Dropdown, Typography, Tooltip } from 'antd'
import { DownloadOutlined, LoadingOutlined, ZoomInOutlined, ZoomOutOutlined, AimOutlined, FullscreenOutlined, CompressOutlined, MoreOutlined } from '@ant-design/icons'
import { useMermaid } from '../hooks/useMermaid'
import { useAppContext } from '../context/AppContext'

const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

const DiagramViewer = memo(function DiagramViewer({
  code,
  style,
  minHeight = 640,
  maxHeight,                    // необязательно: родитель может управлять через flex
  onExport,
  toolbarExtra,
  title = 'Предпросмотр',
  defaultZoom = 1,
}) {
  const { state } = useAppContext()
  const { containerRef, isRendering, error, isInitialized } = useMermaid(code, { theme: state.theme })

  const viewportRef = useRef(null)
  const svgRef = useRef(null)
  const roRef = useRef(null)

  const [zoom, setZoom] = useState(defaultZoom)
  const [fitMode, setFitMode] = useState('fit-width') // 'fit-width' | 'fit-height' | 'actual'
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  // Вспомогательная: чтение размеров диаграммы из viewBox/bbox
  const getDiagramBox = useCallback(() => {
    const svg = svgRef.current
    if (!svg) return { width: 800, height: 600 }
    try {
      const vb = svg.viewBox && svg.viewBox.baseVal
      if (vb && vb.width > 0 && vb.height > 0) {
        return { width: vb.width, height: vb.height }
      }
      const box = svg.getBBox()
      return { width: Math.max(1, box.width), height: Math.max(1, box.height) }
    } catch {
      return { width: 800, height: 600 }
    }
  }, [])

  // Нормализация созданного Mermaid SVG (ширина, viewBox, align)
  const normalizeSvg = useCallback(() => {
    const host = containerRef.current
    if (!host) return
    const svg = host.querySelector('svg')
    svgRef.current = svg || null
    if (!svg) return

    // 1) Реальная растяжка: SVG должен тянуться по ширине
    svg.style.width = '100%'
    svg.style.height = 'auto'
    svg.style.maxWidth = '100%'
    svg.style.display = 'block' // убирает inline-gap

    // 2) Поправить preserveAspectRatio по умолчанию под fit-width
    // xMinYMin meet — прижимает к левому краю, убирая «пустоты» слева
    if (!svg.getAttribute('preserveAspectRatio')) {
      svg.setAttribute('preserveAspectRatio', 'xMinYMin meet')
    }

    // 3) Нормализовать viewBox, если у Mermaid отрицательные minX/minY или пустые
    try {
      const vb = svg.viewBox && svg.viewBox.baseVal
      const bbox = svg.getBBox()
      const needSetVB =
        !vb ||
        vb.width <= 0 ||
        vb.height <= 0 ||
        vb.x < 0 ||
        vb.y < 0

      if (needSetVB) {
        svg.setAttribute('viewBox', `0 0 ${Math.max(1, bbox.width)} ${Math.max(1, bbox.height)}`)
      }
    } catch {
      // если getBBox недоступен — пропускаем
    }
  }, [containerRef])

  // Поиск SVG и нормализация после рендера/перерендера Mermaid
  useEffect(() => {
    if (!containerRef.current) return
    normalizeSvg()
  }, [containerRef, code, isRendering, normalizeSvg])

  // Центрирование сцены при известном масштабе
  const centerAtScale = useCallback((scale) => {
    const viewport = viewportRef.current
    if (!viewport) return
    const { width: w, height: h } = getDiagramBox()
    const contentW = w * scale
    const contentH = h * scale

    // Для fit-width — выравниваем по левому краю (x=0) чтобы занять всю ширину
    const dx = fitMode === 'fit-width' ? 0 : (viewport.clientWidth - contentW) / 2
    const dy = (viewport.clientHeight - contentH) / 2
    setOffset({ x: dx, y: dy })
    setZoom(scale)
  }, [getDiagramBox, fitMode])

  // Fit по ширине
  const fitWidth = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const { width: w } = getDiagramBox()
    // Без внутренних паддингов, чтобы исключить «белые стены»
    const availW = Math.max(1, viewport.clientWidth)
    const next = clamp(availW / w, 0.05, 6)
    // При fit-width добиваемся прижатия влево
    const svg = svgRef.current
    if (svg) svg.setAttribute('preserveAspectRatio', 'xMinYMin meet')
    setFitMode('fit-width')
    centerAtScale(next)
  }, [getDiagramBox, centerAtScale])

  // Fit по высоте
  const fitHeight = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const { height: h } = getDiagramBox()
    const availH = Math.max(1, viewport.clientHeight)
    const next = clamp(availH / h, 0.05, 6)
    const svg = svgRef.current
    if (svg) svg.setAttribute('preserveAspectRatio', 'xMinYMin meet')
    setFitMode('fit-height')
    centerAtScale(next)
  }, [getDiagramBox, centerAtScale])

  // ResizeObserver: перестраиваем fit при изменении размеров
  useEffect(() => {
    const doFitIfNeeded = () => {
      if (fitMode === 'fit-width') fitWidth()
      else if (fitMode === 'fit-height') fitHeight()
    }
    doFitIfNeeded()
    const node = viewportRef.current
    if (!node) return
    if (roRef.current) roRef.current.disconnect()
    roRef.current = new ResizeObserver(doFitIfNeeded)
    roRef.current.observe(node)
    return () => {
      if (roRef.current) roRef.current.disconnect()
      roRef.current = null
    }
  }, [fitMode, fitWidth, fitHeight])

  // При смене кода/темы — обновить fit-режим
  useEffect(() => {
    if (!isRendering && isInitialized) {
      const t = setTimeout(() => {
        if (fitMode === 'fit-width') fitWidth()
        else if (fitMode === 'fit-height') fitHeight()
      }, 50)
      return () => clearTimeout(t)
    }
  }, [code, state.theme, isRendering, isInitialized, fitMode, fitWidth, fitHeight])

  const spinIcon = useMemo(() => <LoadingOutlined style={{ fontSize: 20 }} spin />, [])

  // Экспорт SVG
  const handleExport = useCallback(async (format = 'svg') => {
    const svgEl = svgRef.current
    if (!svgEl) {
      onExport?.({ format, ok: false, error: new Error('SVG не найден') })
      return
    }
    try {
      if (format === 'svg') {
        const serializer = new XMLSerializer()
        const svgString = serializer.serializeToString(svgEl)
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'diagram.svg'
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
        onExport?.({ format, ok: true })
      }
    } catch (e) {
      onExport?.({ format, ok: false, error: e })
    }
  }, [onExport])

  // Панорамирование мышью
  const isDragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return
    e.preventDefault()
    isDragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
    const t = e.currentTarget
    t.style.cursor = 'grabbing'
    t.style.userSelect = 'none'
  }, [])
  const onMouseMove = useCallback((e) => {
    if (!isDragging.current) return
    e.preventDefault()
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current = { x: e.clientX, y: e.clientY }
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
    setFitMode('actual')
  }, [])
  const endDrag = useCallback((e) => {
    if (!isDragging.current) return
    isDragging.current = false
    const t = e.currentTarget
    t.style.cursor = 'grab'
    t.style.userSelect = ''
  }, [])

  // Зум колесом к точке под курсором
  const onWheel = useCallback((e) => {
    e.preventDefault()
    const viewport = viewportRef.current
    if (!viewport) return
    const rect = viewport.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const nextZoom = clamp(zoom * delta, 0.05, 6)
    setOffset(prev => {
      const k = nextZoom / zoom
      return {
        x: mx - (mx - prev.x) * k,
        y: my - (my - prev.y) * k,
      }
    })
    const svg = svgRef.current
    if (svg) svg.setAttribute('preserveAspectRatio', 'xMinYMin meet')
    setZoom(nextZoom)
    setFitMode('actual')
  }, [zoom])

  // Зум относительно центра вьюпорта
  const zoomAroundCenter = useCallback((nextZoom) => {
    const viewport = viewportRef.current
    if (!viewport) return
    const cx = viewport.clientWidth / 2
    const cy = viewport.clientHeight / 2
    setOffset(prev => {
      const k = nextZoom / zoom
      return {
        x: cx - (cx - prev.x) * k,
        y: cy - (cy - prev.y) * k,
      }
    })
    const svg = svgRef.current
    if (svg) svg.setAttribute('preserveAspectRatio', 'xMinYMin meet')
    setZoom(nextZoom)
  }, [zoom])

  const ZOOM_IN_FACTOR = 1.5
  const ZOOM_OUT_FACTOR = 1 / ZOOM_IN_FACTOR

  const handleZoomIn = useCallback(() => {
    setFitMode('actual')
    zoomAroundCenter(clamp(zoom * ZOOM_IN_FACTOR, 0.05, 6))
  }, [zoom, zoomAroundCenter])
  const handleZoomOut = useCallback(() => {
    setFitMode('actual')
    zoomAroundCenter(clamp(zoom * ZOOM_OUT_FACTOR, 0.05, 6))
  }, [zoom, zoomAroundCenter])

  const handleZoomReset = useCallback(() => {
    setFitMode('actual')
    // В режиме 1:1 прижимаем к началу координат
    const svg = svgRef.current
    if (svg) svg.setAttribute('preserveAspectRatio', 'xMinYMin meet')
    setOffset({ x: 0, y: 0 })
    setZoom(1)
  }, [])

  const menuItems = [
    { key: 'svg', label: 'Экспорт SVG', onClick: () => handleExport('svg'), icon: <DownloadOutlined /> },
    { type: 'divider' },
    { key: 'fitw', label: 'Вписать по ширине', onClick: fitWidth, icon: <FullscreenOutlined /> },
    { key: 'fith', label: 'Вписать по высоте', onClick: fitHeight, icon: <CompressOutlined /> },
    { key: 'actual', label: '1:1', onClick: handleZoomReset, icon: <AimOutlined /> },
  ]

  if (!isInitialized) {
    return (
      <section
        className="glass-card"
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 12,
          ...style,
        }}
        aria-busy="true"
        aria-live="polite"
      >
        <Spin indicator={spinIcon} tip="Инициализация Mermaid..." />
      </section>
    )
  }

  return (
    <section
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',                 // гарантируем растяжение по ширине
        minHeight,
        ...style,
      }}
    >
      <div
        className="glass-toolbar"
        role="toolbar"
        aria-label="Диаграмма — панель инструментов"
        style={{ justifyContent: 'space-between', flexShrink: 0 }}
      >
        <Space><Typography.Text strong>{title}</Typography.Text></Space>
        <Space>
          <Tooltip title="Уменьшить"><Button type="text" icon={<ZoomOutOutlined />} onClick={handleZoomOut} /></Tooltip>
          <Tooltip title="1:1"><Button type="text" icon={<AimOutlined />} onClick={handleZoomReset} /></Tooltip>
          <Tooltip title="Увеличить"><Button type="text" icon={<ZoomInOutlined />} onClick={handleZoomIn} /></Tooltip>
          <Dropdown menu={{ items: menuItems }} trigger={['click']}><Button type="text" icon={<MoreOutlined />} /></Dropdown>
          {toolbarExtra}
        </Space>
      </div>

      <div
        ref={viewportRef}
        role="region"
        aria-label="Область визуализации диаграммы"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onWheel={onWheel}
        style={{
          position: 'relative',
          overflow: 'hidden',
          flex: '1 1 0%',
          minHeight,
          maxHeight,
          cursor: 'grab',
          // Важное: растягивание по ширине на случай особенностей родителя
          width: '100%',
          boxSizing: 'border-box',
          // Убираем возможные inline-gap влияющие на SVG
          fontSize: 0,
        }}
      >
        {isRendering && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.35)',
              backdropFilter: 'blur(4px)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            <Spin indicator={spinIcon} tip="Рендеринг диаграммы..." />
          </div>
        )}

        {error && (
          <div style={{ position: 'absolute', top: 8, left: 8, right: 8, zIndex: 2 }}>
            <Alert message="Ошибка рендеринга" description={error} type="error" showIcon closable />
          </div>
        )}

        {/* Сцена: применяем панорамирование и масштаб */}
        <div
          style={{
            position: 'absolute',
            left: offset.x,
            top: offset.y,
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            willChange: 'transform',
            transition: fitMode !== 'actual' ? 'transform 0.25s ease-out' : 'none',
            // На случай ширины контента больше вьюпорта — не давим ширину сцены
            minWidth: '100%',
          }}
        >
          <div ref={containerRef} />
        </div>
      </div>
    </section>
  )
})

DiagramViewer.displayName = 'DiagramViewer'
export default DiagramViewer
