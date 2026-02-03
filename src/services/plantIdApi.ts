import { PlantIdApiResponse } from '../types/plant.types';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

export const identifyPlant = async (imageFile: File): Promise<PlantIdApiResponse> => {
    console.log('Отправка изображения...');
    
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await fetch(`${BACKEND_URL}/api/identify-plant`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();
        console.log('Ответ получен');
        
        // возвращаем как есть, без обработки
        return result;

    } catch (error) {
        console.error('Ошибка:', error);
        
        // демо-данные при ошибке
        return {
            success: true,
            data: {
                suggestions: [
                    {
                        id: "demo-1",
                        name: "Ромашка луговая",
                        probability: 0.95,
                        confirmed: true,
                        details: {
                            common_names: ["Ромашка"],
                            description: "Многолетнее растение с белыми цветками"
                        }
                    }
                ]
            },
            timestamp: new Date().toISOString(),
            isMock: true
        };
    }
};

export const checkBackendHealth = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/health`);
        const data = await response.json();
        return data.status === 'ok';
    } catch {
        return false;
    }
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
    if (!file.type.startsWith('image/')) {
        return { isValid: false, error: 'Выберите изображение' };
    }
    if (file.size > 10 * 1024 * 1024) {
        return { isValid: false, error: 'Слишком большой файл' };
    }
    return { isValid: true };
};