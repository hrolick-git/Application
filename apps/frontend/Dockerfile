# Стадія 1: Збірка (Build)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY apps/frontend/package.json ./apps/frontend/
RUN npm install --legacy-peer-deps
COPY . .
# Збираємо статичні файли (зазвичай у папку dist)
RUN npm run build -w frontend

# Стадія 2: Запуск (Serve)
FROM node:20-alpine
WORKDIR /app
# Встановлюємо легкий сервер для статичних файлів
RUN npm install -g serve
# Копіюємо тільки зібраний результат із першої стадії
COPY --from=builder /app/apps/frontend/dist ./dist

EXPOSE 5173
# Запускаємо сервер, який просто віддає файли
CMD ["serve", "-s", "dist", "-l", "5173"]