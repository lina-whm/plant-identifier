import { PlantIdentification } from '../types/plant.types';

export const extractPlantsFromResponse = (data: any): PlantIdentification[] => {
    console.log('Extracting plants from:', data);
    
    let plants: any[] = [];
    
    const possiblePaths = [
        data?.data?.suggestions,
        data?.suggestions,
        data?.result?.classification?.suggestions,
        data?.data?.result?.classification?.suggestions,
    ];
    
    for (const path of possiblePaths) {
        if (Array.isArray(path)) {
            plants = path;
            break;
        }
    }
    
    return plants.slice(0, 3).map((plant: any) => {
        const similarImages = (plant as any).similar_images || plant.details?.similar_images;
        
        return {
            id: plant.id || `plant-${Date.now()}-${Math.random()}`,
            name: plant.name || plant.plant_name || 'Неизвестное растение',
            plant_name: plant.plant_name,
            probability: plant.probability || 0,
            confirmed: plant.confirmed,
            details: {
                similar_images: similarImages
            }
        } as PlantIdentification;
    });
};

export const isPlantImage = (data: any): boolean => {
    return !!(data?.suggestions || data?.result?.classification?.suggestions);
};