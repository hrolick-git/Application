FROM node:20-bullseye-slim

WORKDIR /app

# 1. Копіюємо файли залежностей
COPY package*.json ./

# 2. Встановлюємо залежності
RUN npm install --legacy-peer-deps

# 3. Копіюємо папку prisma ОКРЕМО перед іншим кодом (це надійніше)
COPY prisma ./prisma/

# 4. Копіюємо решту коду бекенду
COPY . .

# 5. Генеруємо клієнт, явно вказуючи шлях, якщо потрібно
RUN npx prisma generate --schema ./prisma/schema.prisma

EXPOSE 4000

# Використовуємо node для продакшну замість start:dev, якщо це можливо
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]