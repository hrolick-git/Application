FROM node:20-bullseye-slim

WORKDIR /app

# Встановлюємо системні залежності для Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Копіюємо конфіги з поточної директорії (apps/backend)
COPY package*.json ./
COPY prisma ./prisma/

# Встановлюємо залежності
RUN npm install --legacy-peer-deps

# Копіюємо решту коду бекенду
COPY . .

# Генеруємо клієнт
RUN npx prisma generate --schema ./prisma/schema.prisma

# Збірка проекту
RUN npm run build

# Видаляємо зайве для економії пам'яті
RUN npm prune --production

EXPOSE 4000

# Команда запуску: ТУТ МИ МІНЯЄМО ШЛЯХ ДО СХЕМИ
CMD ["sh", "-c", "npx prisma migrate deploy --schema ./prisma/schema.prisma && node dist/main"]