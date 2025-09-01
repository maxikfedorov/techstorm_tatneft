// src/frontend/src/components/CodeEditor.jsx
import { memo, useMemo, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import { Button, Space, message, Typography } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { useAppContext } from '../context/AppContext'

const box = {
  border: '1px solid #f0f0f0',
  borderRadius: 8,
  background: '#fff',
  display: 'flex',
  flexDirection: 'column',
}

const toolbarBox = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 12px',
  borderBottom: '1px solid #f0f0f0',
}

const contentBox = (h) => ({
  height: h ?? 640,
})

const CodeEditor = memo(function CodeEditor({
  value,
  onChange,
  height = 360,
  toolbarTitle = 'Редактор кода',
  toolbarExtra,
  onCopy,
  editorOptionsMerge,
  defaultLanguage = 'markdown',
  className, // не используется в «сыром» варианте
  style,
  ...props
}) {
  const { state } = useAppContext()

  const editorOptions = useMemo(
    () => ({
      minimap: { enabled: state.settings?.minimap ?? true },
      fontSize: state.settings?.fontSize ?? 14,
      wordWrap: state.settings?.wordWrap ? 'on' : 'off',
      lineNumbers: 'on',
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      padding: { top: 12 },
      ...editorOptionsMerge,
      ...props.options,
    }),
    [state.settings, editorOptionsMerge, props.options]
  )

  const handleEditorChange = useCallback(
    (newValue) => onChange?.(newValue || ''),
    [onChange]
  )

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value ?? '')
      message.success('Код скопирован в буфер обмена')
      onCopy?.(true)
    } catch (err) {
      message.error('Не удалось скопировать код')
      onCopy?.(false, err)
    }
  }, [value, onCopy])

  return (
    <section style={{ ...box, ...style }} {...props}>
      <div role="toolbar" aria-label="Редактор — панель инструментов" style={toolbarBox}>
        <Space>
          <Typography.Text strong>{toolbarTitle}</Typography.Text>
        </Space>
        <Space>
          <Button
            type="text"
            icon={<CopyOutlined />}
            onClick={handleCopy}
            size="small"
          >
            Копировать
          </Button>
          {toolbarExtra}
        </Space>
      </div>

      <div role="region" aria-label="Область редактирования кода" style={contentBox(height)}>
        <Editor
          height="100%"
          width="100%"
          defaultLanguage={defaultLanguage}
          value={value}
          onChange={handleEditorChange}
          theme={state.theme === 'dark' ? 'vs-dark' : 'light'}
          options={editorOptions}
        />
      </div>
    </section>
  )
})

CodeEditor.displayName = 'CodeEditor'
export default CodeEditor
