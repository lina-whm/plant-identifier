import { PlantIdApiResponse } from '../types/plant.types';

const API_KEY = process.env.REACT_APP_PLANT_ID_API_KEY || '';
const API_URL = 'https://api.plant.id/v2/identify';

export const identifyPlant = async (imageFile: File): Promise<PlantIdApiResponse> => {
    if (!API_KEY) {
        throw new Error('API ключ не настроен');
    }

    const formData = new FormData();
    formData.append('images', imageFile);
    formData.append('modifiers', 'crops_fast,similar_images');
    formData.append('plant_language', 'ru');
    formData.append('api_key', API_KEY);

    const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Ошибка API: ${response.statusText}`);
    }

    return await response.json();
};