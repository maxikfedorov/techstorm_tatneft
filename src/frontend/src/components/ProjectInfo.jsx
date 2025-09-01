// src/frontend/src/components/ProjectInfo.jsx
import { useState, memo, useCallback } from 'react'
import { Drawer, Button, Space, Typography, Tag, Divider } from 'antd'
import { InfoCircleOutlined, GithubOutlined, UserOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const ProjectInfo = memo(function ProjectInfo({
  title = 'MERMAID INDUSTRIAL EDITOR',
  version = 'v1.0.0 ALPHA',
  description = 'Промышленный редактор диаграмм с интеграцией ИИ-ассистента. Создание и редактирование Mermaid-диаграмм в реальном времени.',
  features = ['Визуальный редактор кода', 'ИИ-генерация диаграмм', 'Экспорт в SVG'],
  tech = ['React', 'Ant Design', 'Monaco Editor', 'Mermaid.js'],
  developer = 'RTU MIREA',
  repoLabel = 'GitHub Repository',
  placement = 'left',
  width = 360,
}) {
  const [open, setOpen] = useState(false)
  const toggle = useCallback(() => setOpen(v => !v), [])

  return (
    <>
      <div style={{ position: 'fixed', top: 16, left: 16, zIndex: 20 }}>
        <Button
          className="glass-toolbar"
          icon={<InfoCircleOutlined />}
          onClick={toggle}
        >
          Проект
        </Button>
      </div>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        placement={placement}
        width={width}
        styles={{
          body: { padding: 16 },
          content: {
            background: 'var(--glass-bg)',
            backdropFilter: `blur(var(--blur))`,
            WebkitBackdropFilter: `blur(var(--blur))`,
            border: 'var(--glass-border)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-hard)',
          },
          header: { borderBottom: '1px solid hsla(var(--border) / 0.6)' },
        }}
        title={
          <Space direction="vertical" size={0}>
            <Title level={5} style={{ margin: 0 }}>{title}</Title>
            <Text type="secondary">{version}</Text>
          </Space>
        }
      >
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Text>{description}</Text>

          <div>
            <Text strong>Возможности</Text>
            <ul style={{ margin: '6px 0 0 18px' }}>
              {features.map((f) => <li key={f}><Text>{f}</Text></li>)}
            </ul>
          </div>

          <Divider style={{ margin: '8px 0' }} />

          <Space direction="vertical" size={6}>
            <Space>
              <GithubOutlined />
              <Text>{repoLabel}</Text>
            </Space>
            <Space>
              <UserOutlined />
              <Text>Developer: {developer}</Text>
            </Space>
          </Space>

          <Divider style={{ margin: '8px 0' }} />

          <div>
            <Text strong>Стек технологий</Text>
            <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {tech.map((t) => (
                <Tag key={t} className="glass">
                  {t}
                </Tag>
              ))}
            </div>
          </div>
        </Space>
      </Drawer>
    </>
  )
})

export default ProjectInfo
