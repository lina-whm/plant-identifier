import React from 'react';
import { PlantIdentification, SimilarImage } from '../types/plant.types';

interface PlantInfoProps {
    plant: PlantIdentification;
}

const PlantInfo: React.FC<PlantInfoProps> = ({ plant }) => {
    const probabilityPercent = plant.probabilityPercent || Math.round(plant.probability * 100);
    const isMock = plant.isMock || false;
    
    const getProbabilityClass = () => {
        if (plant.probability > 0.7) return 'high';
        if (plant.probability > 0.4) return 'medium';
        return 'low';
    };
    
    const commonNames = plant.details?.common_names || [];
    const latinName = plant.details?.latin_name || '';
    const russianName = commonNames.length > 0 ? commonNames[0] : plant.name;
    const similarImages = plant.details?.similar_images || [];

    return (
        <div className="plant-card">
            <div className="plant-header">
                <h3>{russianName}</h3>
                
                {latinName && latinName !== russianName && (
                    <p className="latin-name">
                        <i>{latinName}</i>
                    </p>
                )}
                
                <span className={`probability-badge ${getProbabilityClass()}`}>
                    {probabilityPercent}% совпадение
                </span>
            </div>

            <div className="plant-details">
                <div className="detail-row">
                    <p className="label">Точность распознавания:</p>
                    <p className="value">{probabilityPercent}% уверенности</p>
                </div>

                {latinName && latinName !== russianName && (
                    <div className="detail-row">
                        <p className="label">Латинское название:</p>
                        <p className="value latin">
                            <i>{latinName}</i>
                        </p>
                    </div>
                )}

                {commonNames.length > 1 && (
                    <div className="detail-row">
                        <p className="label">Другие названия:</p>
                        <p className="value">
                            {commonNames.slice(1).join(', ')}
                        </p>
                    </div>
                )}

                {plant.details?.url && (
                    <div className="detail-row">
                        <p className="label">Подробнее:</p>
                        <a 
                            href={plant.details.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="value link"
                        >
                            Открыть в Википедии
                        </a>
                    </div>
                )}

                {plant.details?.description && (
                    <div className="detail-row">
                        <p className="label">Описание:</p>
                        <p className="value description">
                            {plant.details.description}
                        </p>
                    </div>
                )}

                {similarImages.length > 0 && (
                    <>
                        <p className="label">Похожие изображения:</p>
                        <div className="similar-images">
                            {similarImages.slice(0, 3).map((img: SimilarImage, index: number) => (
                                <div key={img.id || `img-${index}`} className="image-wrapper">
                                    <img 
                                        src={img.url} 
                                        alt={`Похожее изображение растения`}
                                        className="similar-image"
                                        loading="lazy"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = `https://via.placeholder.com/150/10b981/ffffff?text=Растение`;
                                            target.alt = 'Изображение не загружено';
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <div className="api-source-note">
                    <span className={isMock ? 'demo-source' : 'real-source'}>
                        {isMock ? 'Демо-данные' : ' Распознано с помощью Plant.id API'}
                    </span>
                    {plant.confirmed && (
                        <span className="confirmed-badge">Подтверждено экспертом</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlantInfo;