FROM node:20-bullseye-slim

WORKDIR /app

# Копіюємо package.json з поточної директорії (apps/backend)
COPY package*.json ./

# Встановлюємо залежності
RUN npm install --legacy-peer-deps

# Копіюємо папку prisma ТА решту коду
COPY . .

# Генеруємо клієнт (шлях відносний до WORKDIR /app)
RUN npx prisma generate --schema ./prisma/schema.prisma

# Збірка проекту (якщо у тебе TypeScript)
RUN npm run build

EXPOSE 4000

# Запускаємо міграції та сервер однією командою
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]