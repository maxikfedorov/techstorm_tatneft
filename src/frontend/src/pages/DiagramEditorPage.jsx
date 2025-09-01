// src/frontend/src/pages/DiagramEditorPage.jsx
import { Layout, Row, Col, Card, Space, Typography } from "antd";
import { CodeOutlined, EyeOutlined, RobotOutlined } from "@ant-design/icons";
import CodeEditor from "../components/CodeEditor";
import DiagramViewer from "../components/DiagramViewer";
import AIAssistant from "../components/AIAssistant";
import ProjectInfo from "../components/ProjectInfo";
import { useState } from "react";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

export default function DiagramEditorPage() {
	const [code, setCode] = useState(
		"graph TD\n  A[Start] --> B[Process]\n  B --> C[End]",
	);

	return (
		<Layout>
			<ProjectInfo />
			<Content>
<Row gutter={[16, 16]} align="stretch">
  <Col xs={{ span: 24, order: 2 }} lg={{ span: 16, order: 1 }} style={{ display: 'flex' }}>
    <Card className="glass-card" style={{ width: '100%' }} bodyStyle={{ padding: 12, display: 'flex', flexDirection: 'column', flex: 1 }}>
      <DiagramViewer code={code} title="Предпросмотр" style={{ flex: 1 }} />
    </Card>
  </Col>

  <Col xs={{ span: 24, order: 3 }} lg={{ span: 8, order: 2 }} style={{ display: 'flex' }}>
    <Card className="glass-card" style={{ width: '100%' }} bodyStyle={{ padding: 12, display: 'flex', flexDirection: 'column', flex: 1 }}>
      <AIAssistant code={code} onCodeUpdate={setCode} />
    </Card>
  </Col>

  <Col xs={{ span: 24, order: 1 }} lg={{ span: 24, order: 3 }}>
    <Card className="glass-card" bodyStyle={{ padding: 12 }}>
      {/* заголовок редактора можно оставить */}
      <CodeEditor value={code} onChange={setCode} height={360} />
    </Card>
  </Col>
</Row>

			</Content>

			<Sider width={0} style={{ display: "none" }} />
		</Layout>
	);
}
