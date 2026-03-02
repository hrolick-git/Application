# apps/backend/Dockerfile

FROM node:20-bullseye-slim

# Встановлюємо робочу директорію
WORKDIR /app

# Копіюємо тільки package.json та package-lock.json для кешування npm install
COPY apps/backend/package*.json ./

# Встановлюємо залежності
RUN npm install --legacy-peer-deps

# Копіюємо весь бекенд (включно з Prisma)
COPY apps/backend .

# Генеруємо Prisma Client
RUN npx prisma generate

# Відкриваємо порт бекенду
EXPOSE 4000

# Команда для запуску
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:dev"]