import { PlantIdApiResponse } from '../types/plant.types';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

export const identifyPlant = async (imageFile: File): Promise<PlantIdApiResponse> => {
    console.log('📤 Отправка изображения...');
    
    // Сначала проверяем доступен ли backend
    const isBackendHealthy = await checkBackendHealth();
    
    // Если backend не доступен - возвращаем mock данные
    if (!isBackendHealthy) {
        console.log('🔄 Используем демо-данные (backend не доступен)');
        return getMockData();
    }

    // Если backend доступен - пробуем реальный API
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(`${BACKEND_URL}/api/identify-plant`, {
            method: 'POST',
            body: formData,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Ответ от backend:', result.success ? 'Успех' : 'Ошибка');
        
        if (result.success) {
            return result;
        } else {
            // Если backend вернул ошибку, пробуем демо
            console.log('🔄 Backend вернул ошибку, используем демо-данные');
            return getMockData();
        }

    } catch (error) {
        console.error('🌐 Ошибка сети:', error instanceof Error ? error.message : 'Unknown error');
        
        // При любой ошибке - возвращаем демо-данные
        console.log('🔄 Используем демо-данные из-за ошибки сети');
        return getMockData();
    }
};

export const checkBackendHealth = async (): Promise<boolean> => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${BACKEND_URL}/api/health`, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        const data = await response.json();
        return data.status === 'ok';
    } catch {
        return false;
    }
};

// Улучшенные демо-данные
const getMockData = (): PlantIdApiResponse => {
    console.log('🎭 Генерация демо-данных');
    
    // Случайный выбор растения для разнообразия
    const mockPlants = [
        {
            id: "mock-1",
            name: "Monstera deliciosa",
            plant_name: "Monstera deliciosa",
            probability: 0.95,
            confirmed: true,
            details: {
                similar_images: [
                    {
                        id: "mock-img-1",
                        url: "https://images.unsplash.com/photo-1525946549228-596740434648?w=300&h=300&fit=crop"
                    }
                ]
            }
        },
        {
            id: "mock-2",
            name: "Rosa",
            plant_name: "Rosa",
            probability: 0.88,
            confirmed: false,
            details: {
                similar_images: [
                    {
                        id: "mock-img-2",
                        url: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=300&h=300&fit=crop"
                    }
                ]
            }
        },
        {
            id: "mock-3",
            name: "Sansevieria trifasciata",
            plant_name: "Sansevieria trifasciata",
            probability: 0.92,
            confirmed: true,
            details: {}
        }
    ];
    
    // Выбираем случайное растение
    const randomPlant = mockPlants[Math.floor(Math.random() * mockPlants.length)];
    
    return {
        success: true,
        data: {
            suggestions: [randomPlant]
        },
        timestamp: new Date().toISOString(),
        isMock: true // Флаг что это демо-данные
    };
};