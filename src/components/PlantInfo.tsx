import React from 'react';
import { PlantIdentification } from '../types/plant.types';
import { ExternalLink, CheckCircle } from 'lucide-react';

interface PlantInfoProps {
    plant: PlantIdentification;
}

const PlantInfo: React.FC<PlantInfoProps> = ({ plant }) => {
    const probabilityPercent = (plant.probability * 100).toFixed(1);

    return (
        <div className="plant-card">
            <div className="plant-header">
                <h3>{plant.plant_name}</h3>
                <span className={`probability-badge ${plant.probability > 0.7 ? 'high' : 'medium'}`}>
                    {probabilityPercent}% совпадение
                </span>
            </div>

            <div className="plant-details">
                <p className="label">Вероятные названия:</p>
                <p className="value">
                    {plant.plant_details.common_names?.join(', ') || 'Не указано'}
                </p>

                <p className="label">Описание:</p>
                <p className="value description">
                    {plant.plant_details.wiki_description?.value || 'Описание отсутствует.'}
                </p>

                <div className="plant-links">
                    <a
                        href={plant.plant_details.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-button"
                    >
                        <ExternalLink size={16} />
                        Подробнее на вики
                    </a>
                    {plant.confirmed && (
                        <div className="confirmed-badge">
                            <CheckCircle size={16} />
                            Подтверждено экспертами
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlantInfo;