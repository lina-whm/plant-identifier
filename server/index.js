const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const PORT = process.env.PORT || 3001;

// middleware
app.use(cors());
app.use(express.json());

// health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

app.post('/api/identify-plant', upload.single('image'), async (req, res) => {
    try {
        // проверка существует ли файл
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                error: 'No image provided' 
            });
        }

        const API_KEY = process.env.PLANT_ID_API_KEY;
        
        // реальный API если ключ доступен
        if (API_KEY) {
            try {
                const formData = new FormData();
                formData.append('images', req.file.buffer, {
                    filename: req.file.originalname || 'plant.jpg',
                    contentType: req.file.mimetype
                });
                
                // API параметры 
                formData.append('plant_language', 'ru');
                formData.append('details', 'common_names');
                
                const response = await axios.post('https://api.plant.id/v2/identify', formData, {
                    headers: {
                        'Api-Key': API_KEY,
                        ...formData.getHeaders()
                    },
                    timeout: 30000
                });
                
                return res.json({
                    success: true,
                    data: response.data,
                    timestamp: new Date().toISOString()
                });
                
            } catch (apiError) {
                console.error('Plant.id API error:', apiError.message);
                // переходим к демо данным
            }
        }
        
        // резервный вариант демо данных
        const mockData = {
            success: true,
            data: {
                suggestions: [
                    {
                        id: "demo-1",
                        plant_name: "Leucanthemum vulgare",
                        probability: 0.96,
                        confirmed: false,
                        plant_details: {
                            scientific_name: "Leucanthemum vulgare"
                        }
                    },
                    {
                        id: "demo-2", 
                        plant_name: "Rosa",
                        probability: 0.75,
                        confirmed: false,
                        plant_details: {
                            scientific_name: "Rosa"
                        }
                    }
                ]
            },
            timestamp: new Date().toISOString(),
            isMock: true
        };
        
        return res.json(mockData);

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            timestamp: new Date().toISOString()
        });
    }
});

// запуск бек
app.listen(PORT, () => {
    console.log(` Plant ID Backend running on port ${PORT}`);
    console.log(` API Key: ${process.env.PLANT_ID_API_KEY ? 'Configured' : 'Not configured (demo mode)'}`);
});