# 🌿 Plant Identifier - Full-Stack React Application

[![React](https://img.shields.io/badge/React-19.2-blue)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue)](https://typescriptlang.org)
[![PWA](https://img.shields.io/badge/PWA-✅-yellow)](https://web.dev/progressive-web-apps/)
[![Responsive](https://img.shields.io/badge/Responsive-✅-green)](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)

Полнофункциональное приложение для распознавания растений с использованием искусственного интеллекта. Full-stack решение с разделением frontend и backend для безопасной работы с API.

## Демо

[![Live Demo](https://img.shields.io/badge/Live_Demo-Посмотреть-brightgreen)](https://lina-whm.github.io/plant-id-portfolio)

### Режимы работы:
1. **Режим с API** (backend запущен) - реальное распознавание через Plant.id
2. **Демо-режим** (backend не запущен) - тестовые данные для демонстрации

##  Особенности

###  Основной функционал
- **Распознавание растений** через Plant.id AI API
- **Высокая точность** - до 98% для распространенных растений
- **Drag & Drop** загрузка изображений
- **Адаптивный дизайн** - работает на всех устройствах
- **PWA поддержка** - установка на домашний экран



###  Безопасность
- **Backend proxy** - API ключи никогда не попадают в клиентский код
- **Environment variables** - конфиденциальные данные в `.env` файлах
- **CORS защита** - только разрешенные источники

###  Технологии
- **Frontend**: React 19 + TypeScript
- **Backend**: Node.js + Express
- **Стили**: CSS Grid/Flexbox + современные CSS функции
- **API**: Plant.id v2 REST API
- **PWA**: Service Workers + Web App Manifest

## 📸 Скриншоты

| Главный экран | Результаты распознавания | Мобильная версия |
|--------------|-------------------------|------------------|
| ![Main Screen](/src/screenshots/main.png) | ![Results](/src/screenshots/results.png) | ![Mobile](/src/screenshots/mobile.png) |

##  Быстрый старт

### Предварительные требования
- Node.js 16+
- npm или yarn
- API ключ от [Plant.id](https://plant.id)

### Установка и запуск

```bash
# 1. Клонировать репозиторий
git clone https://github.com/lina-whm/plant-id-portfolio.git
cd plant-id-portfolio

# 2. Установить зависимости
npm run install:all

# 3. Настроить environment variables
# Создайте server/.env:
echo "PLANT_ID_API_KEY=ваш_ключ_здесь" > server/.env
echo "PORT=3001" >> server/.env
echo "CORS_ORIGIN=http://localhost:3000" >> server/.env

# Создайте корневой .env:
echo "REACT_APP_BACKEND_URL=http://localhost:3001" > .env

# 4. Запустить в режиме разработки
npm run dev
# Или отдельно:
# Терминал 1: npm run backend
# Терминал 2: npm start