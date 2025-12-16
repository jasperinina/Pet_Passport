// Базовый URL API
// По умолчанию пустой, чтобы эндпоинты выглядели как "/api/..."
// Для продакшена/стендов задайте VITE_API_BASE_URL (например, "http://localhost:3000")
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export default API_BASE_URL;
