# Стадія 1: Збірка (Build)
FROM node:20-alpine AS builder
WORKDIR /app

# Копіюємо конфіги
COPY package*.json ./
COPY apps/frontend/package*.json ./apps/frontend/

# Встановлюємо залежності
RUN npm install --legacy-peer-deps

# !!! ФІКС ДЛЯ КАЛЕНДАРЯ !!!
# Ми встановлюємо core-пакети окремо, щоб вони точно були в node_modules
RUN npm install @fullcalendar/core @fullcalendar/daygrid @fullcalendar/react --legacy-peer-deps

# Копіюємо решту коду
COPY . .

# Пробуємо збірку знову
RUN npm run build -w frontend

# Стадія 2: Запуск (Serve)
FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/apps/frontend/dist ./dist

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]