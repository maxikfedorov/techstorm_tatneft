# 🚀 AI-Powered Mermaid Editor

Интеллектуальный редактор диаграмм Mermaid с ИИ-ассистентом для создания и редактирования диаграмм по текстовому описанию.

## ✨ Возможности

- **9 типов диаграмм**: flowchart, sequence, class, ER, state, gantt, pie, journey, git
- **AI-генерация**: создание диаграмм по текстовому описанию
- **Умное редактирование**: модификация существующих диаграмм через ИИ
- **Живое превью**: мгновенный рендеринг с обработкой ошибок
- **Monaco Editor**: продвинутый редактор кода с подсветкой синтаксиса

## 🛠️ Технологии

**Frontend:**
- React.js + Vite
- Monaco Editor
- Mermaid.js
- Ant Design

**Backend:**
- FastAPI
- LM Studio (OpenAI API)
- Python 3.8+
- Docker

**DB**
- MongoDB
- Minio S3
- Redis

## 🚀 Быстрый старт

### Установка

```bash
# Клонирование репозитория
git clone https://github.com/maxikfedorov/techstorm_tatneft.git
cd techstorm_tatneft

# Frontend
cd src/frontend
npm install

# Backend
cd ../backend
pip install -r requirements.txt
```

### Настройка LM Studio

1. Установите [LM Studio](https://lmstudio.ai/)
2. Загрузите модель `openai/gpt-oss-20b`
3. Запустите локальный сервер на `http://127.0.0.1:1234`

### Запуск

```bash
# Backend (терминал 1)
cd src/backend
python app.py

# Frontend (терминал 2) 
cd src/frontend
npm run dev
```

Приложение будет доступно на `http://localhost:5173`

## 📁 Структура проекта

```
src/
├── frontend/
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── hooks/         # Кастомные хуки
│   │   ├── context/       # Context API
│   │   ├── services/      # API сервисы
│   │   └── constants/     # Константы
│   └── package.json
└── backend/
    ├── routers/           # FastAPI роуты
    ├── models/           # Pydantic модели
    ├── config/           # Конфигурация
    └── app.py           # Главный файл
```

## 📺 Демо

**Видео демонстрация:** [Смотреть на Яндекс.Диске](https://disk.yandex.ru/i/gfOavksAJN3leg)

## 🎯 Планы развития

- [ ] Логирование данных, сохранение схем пользователя
- [ ] Личный кабинет, авторизация
- [ ] Развертывание приложения через Docker compose 
- [ ] Завершение UI/UX дизайна (glassmorphism)
- [ ] Экспорт диаграмм (PNG, SVG, PDF)
- [ ] Система сохранения проектов
- [ ] Совместное редактирование
- [ ] Интеграция с GitHub/Confluence
- [ ] Мобильная версия


## 📄 Лицензия

Распространяется под лицензией MIT. См. `LICENSE` для подробностей.

## 👥 Команда

**Разработчик:** [maxikfedorov](https://github.com/maxikfedorov)

