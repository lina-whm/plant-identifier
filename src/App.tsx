import React, { useState } from 'react';
import { identifyPlant } from './services/plantIdApi';
import { PlantIdentification } from './types/plant.types';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import PlantInfo from './components/PlantInfo';
import Loader from './components/Loader';
import './App.css';

const App: React.FC = () => {
    const [plants, setPlants] = useState<PlantIdentification[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = async (file: File) => {
        setIsLoading(true);
        setError(null);
        setPlants([]);

        try {
            const data = await identifyPlant(file);
            setPlants(data.suggestions.slice(0, 3)); // топ-3 результата
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка');
            console.error('Ошибка при распознавании:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <ImageUploader
                    onImageSelect={handleImageUpload}
                    isProcessing={isLoading}
                />

                {isLoading && <Loader />}

                {error && (
                    <div className="error-message">
                        <p>⚠️ {error}</p>
                        <p>Проверьте подключение к интернету и попробуйте еще раз.</p>
                    </div>
                )}

                {plants.length > 0 && (
                    <section className="results-section">
                        <h2>Результаты распознавания:</h2>
                        <div className="plants-grid">
                            {plants.map((plant) => (
                                <PlantInfo key={plant.id} plant={plant} />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <footer className="footer">
                <p>
                    Используется API от <a href="https://plant.id" target="_blank" rel="noopener noreferrer">plant.id</a>
                </p>
                <p className="copyright">© {new Date().getFullYear()} Портфолио-проект</p>
            </footer>
        </div>
    );
};

export default App;