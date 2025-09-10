// frontend/src/components/common/ProjectInfo.jsx
import Modal from './Modal'

function ProjectInfo({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="О проекте">
      <div>
        <h3>Diagram Builder</h3>
        <p>Веб-приложение для создания диаграмм с помощью искусственного интеллекта.</p>
        
        <h4 style={{ marginTop: '20px' }}>Возможности:</h4>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Генерация диаграмм из текстового описания</li>
          <li>Поддержка различных типов диаграмм (Flowchart, Sequence, Class, ER, Gantt)</li>
          <li>Выбор различных LLM моделей</li>
          <li>История генераций и версионирование</li>
          <li>Экспорт в различные форматы</li>
          <li>Редактирование кода диаграмм</li>
        </ul>

        <h4 style={{ marginTop: '20px' }}>Технологии:</h4>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Frontend: React + Vite</li>
          <li>Backend: Python FastAPI</li>
          <li>AI: LM Studio с различными моделями</li>
          <li>Database: MongoDB + Redis</li>
          <li>Диаграммы: Mermaid.js</li>
        </ul>

        <h4 style={{ marginTop: '20px' }}>Использование:</h4>
        <ol style={{ paddingLeft: '20px' }}>
          <li>Создайте новую диаграмму или откройте существующую</li>
          <li>Введите описание того, что хотите изобразить</li>
          <li>Выберите тип диаграммы и модель ИИ</li>
          <li>Нажмите "Сгенерировать"</li>
          <li>При необходимости отредактируйте код диаграммы</li>
          <li>Сохраните результат</li>
        </ol>
      </div>
    </Modal>
  )
}

export default ProjectInfo
