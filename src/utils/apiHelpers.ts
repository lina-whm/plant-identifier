import { PlantIdentification } from '../types/plant.types';

export const extractPlantsFromResponse = (data: any): PlantIdentification[] => {
    console.log(' ПРОСТОЙ извлечение растений');
    
    let suggestions = [];
    
    if (data?.data?.suggestions) {
        suggestions = data.data.suggestions;
        console.log('Нашли в data.data.suggestions');
    } else if (data?.suggestions) {
        suggestions = data.suggestions;
        console.log('Нашли в data.suggestions');
    } else if (data?.data && Array.isArray(data.data)) {
        suggestions = data.data;
        console.log('Data является массивом');
    }
    
    console.log(`🌿 Найдено растений: ${suggestions.length}`);
    
    if (suggestions.length === 0) {
        console.log(' Растений не найдено');
        return [];
    }
    
    return suggestions.slice(0, 3).map((plant: any, index: number) => {
        console.log(`🌱 Растение ${index}:`, plant);
        
        const plantName = plant.plant_name || plant.name || 'Растение';
        const probability = plant.probability || 0;
        const probabilityPercent = Math.round(probability * 100);
        
        // простой перевод популярных растений
        const plantTranslations: Record<string, string> = {
            'Leucanthemum vulgare': 'Ромашка луговая',
            'Leucanthemum maximum': 'Нивяник наибольший',
            'Syringa vulgaris': 'Сирень',
            'Rosa': 'Роза',
            'Monstera deliciosa': 'Монстера',
            'Sansevieria trifasciata': 'Сансевиерия',
            'Tulipa': 'Тюльпан',
            'Orchidaceae': 'Орхидея',
            'Cactaceae': 'Кактус'
        };
        
        const russianName = plantTranslations[plantName] || plantName;
        
        console.log(`Название: ${russianName} (${probabilityPercent}%)`);
        
        return {
            id: plant.id || `plant-${index}`,
            name: russianName,
            probability: probability,
            probabilityPercent: probabilityPercent,
            confirmed: plant.confirmed || false,
            isMock: data.isMock || false,
            details: {
                common_names: [russianName],
                url: `https://ru.wikipedia.org/wiki/${encodeURIComponent(plantName)}`,
                description: `Распознано с точностью ${probabilityPercent}%`,
                similar_images: [],
                latin_name: plantName
            }
        };
    });
};