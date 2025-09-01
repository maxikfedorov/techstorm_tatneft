// src/frontend/src/components/AIAssistant.jsx
import { useState, memo, useCallback, useMemo } from 'react'
import { Button, Select, Input, Alert, Space, Typography, Divider, Badge } from 'antd'
import { SendOutlined, LoadingOutlined, ThunderboltOutlined, SettingOutlined, DatabaseOutlined } from '@ant-design/icons'
import { useAI } from '../hooks/useAI'
import { useAppContext } from '../context/AppContext'
import { DIAGRAM_TYPES, MODES } from '../constants/diagrams'

const { TextArea } = Input

const box = {
  border: '1px solid #f0f0f0',
  borderRadius: 8,
  background: '#fff',
  display: 'grid',
  gap: 12,
  padding: 16,
}

const section = { display: 'grid', gap: 8 }
const row = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }

const AIAssistant = memo(function AIAssistant({
  code,
  onCodeUpdate,
  title = 'ИИ ассистент',
  paramTitle = 'Параметры',
  inputTitle = 'Ввод',
  submitLabelCreate = 'Создать',
  submitLabelUpdate = 'Изменить',
  maxPrompt = 2048,
  toolbarExtra,
  onSubmit,
  onModeChange,
  onTypeChange,
  className, // не используется в «сыром» виде
  style,
}) {
  const [prompt, setPrompt] = useState('')
  const { state, dispatch } = useAppContext()
  const { isLoading, error, response, generateDiagram } = useAI()

  const spinIcon = useMemo(() => <LoadingOutlined style={{ fontSize: 18 }} spin />, [])

  const handleGenerate = useCallback(async () => {
    const clean = prompt.trim()
    if (!clean) return
    const payload = {
      prompt: clean,
      current_code: code,
      diagram_type: state.diagramType,
      mode: state.mode,
    }
    try {
      const result = await generateDiagram(payload)
      onSubmit?.(payload, result)
      if (result?.trim()) {
        onCodeUpdate?.(result.trim())
        setPrompt('')
      }
    } catch (e) {
      // Ошибки уже отображаются через error из хука
    }
  }, [prompt, code, state.diagramType, state.mode, generateDiagram, onCodeUpdate, onSubmit])

  const handleModeChange = useCallback(
    (newMode) => {
      dispatch({ type: 'SET_MODE', payload: newMode })
      onModeChange?.(newMode)
    },
    [dispatch, onModeChange]
  )

  const handleDiagramTypeChange = useCallback(
    (newType) => {
      dispatch({ type: 'SET_DIAGRAM_TYPE', payload: newType })
      onTypeChange?.(newType)
    },
    [dispatch, onTypeChange]
  )

  const submitText = state.mode === 'create' ? submitLabelCreate : submitLabelUpdate
  const charCount = `${prompt.length}/${maxPrompt}`

  return (
    <section style={{ ...box, ...style }} aria-live="polite" aria-busy={isLoading} role="form">
      {/* Header */}
      <div style={row}>
        <Space>
          <Typography.Text strong>{title}</Typography.Text>
          <Badge status={isLoading ? 'processing' : 'success'} text={isLoading ? 'Обработка' : 'Готово'} />
        </Space>
        <div>{toolbarExtra}</div>
      </div>

      <Divider style={{ margin: '8px 0' }} />

      {/* Parameters */}
      <div style={section} aria-label="Параметры генерации">
        <Space align="center" style={{ justifyContent: 'space-between' }}>
          <Space>
            <SettingOutlined />
            <Typography.Text>{paramTitle}</Typography.Text>
          </Space>
        </Space>

        <div style={{ display: 'grid', gap: 8 }}>
          <div style={row}>
            <Typography.Text type="secondary">Режим</Typography.Text>
            <Select
              value={state.mode}
              onChange={handleModeChange}
              options={MODES}
              suffixIcon={<ThunderboltOutlined />}
              style={{ minWidth: 160 }}
              disabled={isLoading}
              aria-label="Режим работы"
            />
          </div>

          <div style={row}>
            <Typography.Text type="secondary">Тип диаграммы</Typography.Text>
            <Select
              value={state.diagramType}
              onChange={handleDiagramTypeChange}
              options={DIAGRAM_TYPES}
              suffixIcon={<DatabaseOutlined />}
              style={{ minWidth: 160 }}
              disabled={isLoading}
              aria-label="Тип диаграммы"
            />
          </div>
        </div>
      </div>

      {/* Input */}
      <div style={section} aria-label="Ввод запроса">
        <Space align="center" style={{ justifyContent: 'space-between' }}>
          <Space>
            <SendOutlined />
            <Typography.Text>{inputTitle}</Typography.Text>
          </Space>
          <Typography.Text type="secondary">{charCount}</Typography.Text>
        </Space>

        <TextArea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={state.mode === 'create' ? 'Опишите диаграмму...' : 'Опишите необходимые изменения...'}
          rows={5}
          disabled={isLoading}
          maxLength={maxPrompt}
        />
      </div>

      {/* Submit */}
      <div>
        <Button
          block
          type="primary"
          icon={isLoading ? spinIcon : <ThunderboltOutlined />}
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          loading={isLoading}
        >
          {isLoading ? 'Обработка...' : submitText}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <Alert
          type="error"
          showIcon
          message="Ошибка генерации"
          description={String(error)}
        />
      )}

      {/* Output */}
      {response && (
        <div role="region" aria-label="Результат" style={{ border: '1px solid #f0f0f0', borderRadius: 6, padding: 12 }}>
          <div style={{ ...row, marginBottom: 8 }}>
            <Typography.Text strong>Терминал вывода</Typography.Text>
            <Typography.Text type="secondary">{`${(response || '').length} байт`}</Typography.Text>
          </div>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            <code>{response}</code>
          </pre>
        </div>
      )}
    </section>
  )
})

AIAssistant.displayName = 'AIAssistant'
export default AIAssistant
