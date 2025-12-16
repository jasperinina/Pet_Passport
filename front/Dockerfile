FROM node:18 AS build
WORKDIR /app

# Устанавливаем зависимости отдельно, чтобы кешировать слой
COPY package*.json ./
RUN npm install

# Копируем остальной код
COPY . .

# Передаём переменную для Vite (URL бэкенда)
ARG VITE_API_BASE_URL=http://localhost:81
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Сборка фронтенда
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]