// Базовый URL API
// Для продакшена отправляем запросы на /api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export default API_BASE_URL;
