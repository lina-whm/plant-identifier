import React from 'react';
import { PlantIdentification } from '../types/plant.types';

interface PlantInfoProps {
    plant: PlantIdentification;
}

interface SimilarImage {
    id: string;
    url: string;
}

const PlantInfo: React.FC<PlantInfoProps> = ({ plant }) => {
    const plantName = plant.name || plant.plant_name || 'Неизвестное растение';
    const probabilityPercent = (plant.probability * 100).toFixed(1);
    
    const similarImages: SimilarImage[] = plant.details?.similar_images || [];

    return (
        <div className="plant-card">
            <div className="plant-header">
                <h3>{plantName}</h3>
                <span className={`probability-badge ${plant.probability > 0.7 ? 'high' : plant.probability > 0.4 ? 'medium' : 'low'}`}>
                    {probabilityPercent}% совпадение
                </span>
            </div>

            <div className="plant-details">
                <p className="label">Точность распознавания:</p>
                <p className="value">
                    {probabilityPercent}% уверенности
                </p>

                {similarImages.length > 0 && (
                    <>
                        <p className="label">Похожие изображения:</p>
                        <div className="similar-images">
                            {similarImages.slice(0, 2).map((img: SimilarImage, index: number) => (
                                <img 
                                    key={img.id || index} 
                                    src={img.url} 
                                    alt={`Похожее изображение ${index + 1}`}
                                    className="similar-image"
                                />
                            ))}
                        </div>
                    </>
                )}

                <div className="api-success-note">
                    <span>✅ Распознано с помощью Plant.id API</span>
                </div>
            </div>
        </div>
    );
};

export default PlantInfo;