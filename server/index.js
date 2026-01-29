const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const upload = multer();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

// health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: 'Plant ID Backend Proxy',
        timestamp: new Date().toISOString()
    });
});

app.post('/api/identify-plant', upload.single('image'), async (req, res) => {
    try {
        console.log(' Получен запрос на распознавание растения');
        
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                error: 'Необходимо загрузить изображение' 
            });
        }

        const API_KEY = process.env.PLANT_ID_API_KEY;
        
        if (!API_KEY) {
            console.error('❌ API ключ не настроен в .env файле');
            return res.status(500).json({ 
                success: false, 
                error: 'Серверная ошибка: API ключ не настроен' 
            });
        }

        console.log(' Изображение:', req.file.originalname, 'size:', req.file.size, 'type:', req.file.mimetype);

        const formData = new FormData();
        
        // правильный способ добавить файл в FormData для axios
        formData.append('images', req.file.buffer, {
            filename: req.file.originalname || 'plant.jpg',
            contentType: req.file.mimetype
        });
        
        // параметры для plant.id API
        formData.append('similar_images', 'true');
        formData.append('plant_language', 'ru');
        formData.append('details', 'common_names,url,wiki_description');
        formData.append('modifiers', 'crops_fast'); 


        console.log('Отправляем запрос к Plant.id API...');

        // получаем headers правильно
        const headers = {
            'Api-Key': API_KEY,
            ...formData.getHeaders()
        };

        const response = await axios.post('https://api.plant.id/v2/identify', formData, {
        headers: headers,
        timeout: 30000
});

        console.log(' Получен ответ от Plant.id API, статус:', response.status);
        
        // возвращаем данные клиенту
        res.json({
            success: true,
            data: response.data,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error(' Ошибка при запросе к Plant.id API:');
        
        let statusCode = 500;
        let errorMessage = 'Внутренняя ошибка сервера';

        if (error.response) {
            // ошибка от plant.id API
            statusCode = error.response.status;
            const errorData = error.response.data;
            
            console.error('Plant.id API Error:', errorData);
            
            if (statusCode === 401) {
                errorMessage = 'Неверный API ключ. Проверьте .env файл';
            } else if (statusCode === 429) {
                errorMessage = 'Превышен лимит запросов. Попробуйте позже или проверьте баланс кредитов';
            } else if (errorData && errorData.message) {
                errorMessage = `Plant.id API: ${errorData.message}`;
            } else {
                errorMessage = `Plant.id API Error: ${statusCode} ${error.response.statusText}`;
            }
            
        } else if (error.request) {
            // нет ответа от API
            errorMessage = 'Нет ответа от Plant.id API. Проверьте подключение к интернету';
            console.error('No response from API:', error.message);
        } else {
            errorMessage = `Ошибка: ${error.message}`;
            console.error('Request setup error:', error.message);
        }

        res.status(statusCode).json({
            success: false,
            error: errorMessage,
            timestamp: new Date().toISOString()
        });
    }
});

// запуск сервера
app.listen(PORT, () => {
    console.log(` Backend сервер запущен на http://localhost:${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/api/health`);
    console.log(` Upload endpoint: POST http://localhost:${PORT}/api/identify-plant`);
    console.log(` API Key: ${process.env.PLANT_ID_API_KEY ? 'Настроен ' : 'Не настроен '}`);
    console.log(` CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
});
