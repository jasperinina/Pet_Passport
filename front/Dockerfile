FROM node:18 AS build
WORKDIR /app

# Устанавливаем зависимости отдельно, чтобы кешировать слой
COPY package*.json ./
RUN npm install

# Копируем остальной код
COPY . .

# Передаём переменные для Vite
ARG VITE_API_BASE_URL
ARG VITE_TG_BOT_URL
ARG VITE_GITHUB_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_TG_BOT_URL=${VITE_TG_BOT_URL}
ENV VITE_GITHUB_URL=${VITE_GITHUB_URL}

# Сборка фронтенда
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]