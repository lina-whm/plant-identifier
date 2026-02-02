import React, { useState, useEffect } from 'react';
import { identifyPlant, checkBackendHealth } from './services/plantIdApi';
import { PlantIdentification } from './types/plant.types';
import { extractPlantsFromResponse } from './utils/apiHelpers';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import PlantInfo from './components/PlantInfo';
import Loader from './components/Loader';
import './App.css';

const App: React.FC = () => {
    const [plants, setPlants] = useState<PlantIdentification[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    // проверка backend при загрузке
    useEffect(() => {
        const checkBackend = async () => {
            try {
                const isOnline = await checkBackendHealth();
                setBackendOnline(isOnline);
                
                if (!isOnline) {
                    setError('Backend сервер не запущен. Для работы с реальным API выполните:');
                }
            } catch (err) {
                setBackendOnline(false);
                setError('Не удалось подключиться к backend серверу.');
            }
        };
        
        checkBackend();
    }, []);

  const handleImageUpload = async (file: File) => {
      if (backendOnline === false) {
        console.log('Backend не запущен, используем демо-режим');
    }

    setIsLoading(true);
    setError(null);
    setPlants([]);
    setSelectedImage(file);

   try {
        const data = await identifyPlant(file);
        console.log('Полученные данные:', data);
         setError(null);
        const extractedPlants = extractPlantsFromResponse(data);

        
        if (extractedPlants.length === 0) {
            setError('Не удалось распознать растения. Попробуйте другое изображение.');
        } else {
            setPlants(extractedPlants);
            if (data.isMock) {
                setError('Используется демо-режим. Для реального распознавания запустите backend сервер.');
            }
        }
        
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Произошла неизвестная ошибка';
        
        // пользовательские сообщения для разных ошибок
        if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Network Error')) {
            setError('Ошибка сети. Проверьте подключение к интернету и что backend сервер запущен.');
        } else if (errorMessage.includes('401') || errorMessage.includes('Invalid API key')) {
            setError('Неверный API ключ. Проверьте файл server/.env');
        } else if (errorMessage.includes('429') || errorMessage.includes('Rate limit')) {
            setError('Превышен лимит запросов. Попробуйте позже или проверьте баланс кредитов на plant.id');
        } else {
            setError(`Ошибка: ${errorMessage}`);
        }
        
        console.error('Ошибка при распознавании:', err);
    } finally {
        setIsLoading(false);
    }
};

    const handleRetryBackend = async () => {
        setError(null);
        const isOnline = await checkBackendHealth();
        setBackendOnline(isOnline);
        
        if (isOnline && selectedImage) {
            handleImageUpload(selectedImage);
        }
    };

    return (
        <div className="app">
            <Header />
            
            <main className="main-content">
               {backendOnline === false && (
    <div className="backend-warning">
        <h3> Backend сервер не запущен</h3>
        <p>Для работы с реальным API Plant.id:</p>
        <ol>
            <li>Откройте новый терминал</li>
            <li>Перейдите в папку: <code>cd server</code></li>
            <li>Запустите сервер: <code>npm run dev</code></li>
        </ol>
        <p className="demo-info">
            <strong> Демо-режим активен</strong><br/>
            Вы можете загружать фото и получать тестовые данные
        </p>
        <button 
            onClick={handleRetryBackend}
            className="button retry-button"
        >
            Проверить подключение снова
        </button>
    </div>
)}
                
                {backendOnline === true && (
                    <div className="backend-success">
                        <span>Backend сервер подключен. Используется реальный API Plant.id</span>
                    </div>
                )}

                <ImageUploader
                    onImageSelect={handleImageUpload}
                    isProcessing={isLoading}
                />

                {isLoading && <Loader />}

               {error && (
              <div className={`error-message ${error.includes('демо') || error.includes('демо-режим') ? 'demo-notice' : ''}`}>
                 <h3>
                 {error.includes('демо') ? ' Демо-режим' : ' Ошибка'}
                 </h3>
                    <p style={{ whiteSpace: 'pre-line' }}>{error}</p>
                        {error.includes('backend') && (
                <button  onClick={handleRetryBackend} className="button small">
                     Проверить подключение снова
                </button>
        )}
    </div>
)}

                {plants.length > 0 && (
                    <section className="results-section">
                        <div className="results-header">
                            <h2>Результаты распознавания</h2>
                            <div className="results-count">
                                Найдено растений: <strong>{plants.length}</strong>
                            </div>
                        </div>
                        
                        <div className="plants-grid">
                            {plants.map((plant, index) => (
                                <PlantInfo key={plant.id || `plant-${index}`} plant={plant} />
                            ))}
                        </div>
                        
                        <div className="api-info">
                            <p className="api-note">
                                <small>
                                     Используется {backendOnline ? 'реальный' : 'демо'} режим. 
                                    {backendOnline ? ' Запросы отправляются в API Plant.id.' : ' Данные для демонстрации.'}
                                </small>
                            </p>
                        </div>
                    </section>
                )}

                {!isLoading && plants.length === 0 && !error && (
                    <div className="info-section">
                        <h3>Как использовать:</h3>
                        <div className="instructions">
                            <div className="instruction-step">
                                <div className="step-number">1</div>
                                <div className="step-content">
                                    <strong>Загрузите фото растения</strong>
                                    <p>Используйте кнопку выше или перетащите изображение</p>
                                </div>
                            </div>
                            <div className="instruction-step">
                                <div className="step-number">2</div>
                                <div className="step-content">
                                    <strong>Дождитесь анализа</strong>
                                    <p>ИИ проанализирует изображение и определит растение</p>
                                </div>
                            </div>
                            <div className="instruction-step">
                                <div className="step-number">3</div>
                                <div className="step-content">
                                    <strong>Получите результат</strong>
                                    <p>Узнайте название растения и точность распознавания</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="tech-info">
                            <h4>Технологии проекта:</h4>
                            <div className="tech-tags">
                                <span className="tech-tag">React 19</span>
                                <span className="tech-tag">TypeScript</span>
                                <span className="tech-tag">PWA</span>
                                <span className="tech-tag">Node.js Backend</span>
                                <span className="tech-tag">Plant.id API</span>
                                <span className="tech-tag">Responsive Design</span>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h4>Plant Identifier</h4>
                        <p>Приложение для распознавания растений с помощью искусственного интеллекта</p>
                    </div>
                    
                    <div className="footer-section">
                        <h4>Технологии</h4>
                        <ul>
                            <li>React + TypeScript</li>
                            <li>Node.js Express Backend</li>
                            <li>Plant.id API</li>
                            <li>Progressive Web App</li>
                        </ul>
                    </div>
                    
                    <div className="footer-section">
                        <h4>Ссылки</h4>
                        <ul>
                            <li>
                                <a href="https://plant.id" target="_blank" rel="noopener noreferrer">
                                    Plant.id API
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/lina-whm/plant-id-portfolio" target="_blank" rel="noopener noreferrer">
                                    Исходный код
                                </a>
                            </li>
                            <li>
                                <a href="https://www.kindwise.com/plant-id" target="_blank" rel="noopener noreferrer">
                                    Kindwise
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div className="footer-bottom">
                    <p>
                        Используется API от <a href="https://plant.id" target="_blank" rel="noopener noreferrer">plant.id </a> 
                        от <a href="https://www.kindwise.com" target="_blank" rel="noopener noreferrer">kindwise</a>
                    </p>
                    <p className="copyright">
                        © {new Date().getFullYear()} Портфолио-проект 
                    </p>
                    <p className="security-note">
                         API ключи защищены через backend proxy сервер
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default App;