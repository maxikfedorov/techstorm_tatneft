// src/frontend/src/components/CodeEditor.jsx
import { memo } from 'react'
import Editor from '@monaco-editor/react'
import { Button, Space, message } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { useAppContext } from '../context/AppContext'

const CodeEditor = memo(({ value, onChange, className = '', ...props }) => {
  const { state } = useAppContext()
  
  const editorOptions = {
    minimap: { enabled: state.settings?.minimap ?? true },
    fontSize: state.settings?.fontSize ?? 14,
    wordWrap: state.settings?.wordWrap ? 'on' : 'off',
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    padding: { top: 16 },
    ...props.options
  }

  const handleEditorChange = (newValue) => {
    onChange?.(newValue || '')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      message.success('Код скопирован в буфер обмена')
    } catch (err) {
      message.error('Не удалось скопировать код')
    }
  }

  return (
    <div className={`code-editor ${className}`} style={{ height: '100%' }}>
      <div className="code-editor__toolbar">
        <Space>
          <Button 
            type="text"
            icon={<CopyOutlined />}
            onClick={handleCopy}
            size="small"
          >
            Копировать
          </Button>
        </Space>
      </div>
      
      <div className="code-editor__content" style={{ height: 'calc(100% - 45px)' }}>
        <Editor
          height="100%" // Убедитесь что это 100%
          width="100%"
          defaultLanguage="markdown"
          value={value}
          onChange={handleEditorChange}
          theme={state.theme === 'dark' ? 'vs-dark' : 'light'}
          options={editorOptions}
          {...props}
        />
      </div>
    </div>
  )
})

CodeEditor.displayName = 'CodeEditor'
export default CodeEditor
