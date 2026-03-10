FROM node:20-bullseye-slim

WORKDIR /app

# Системні залежності
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Це прибере помилку з WASM, примусово ввімкнувши бібліотеку
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=library
ENV PRISMA_CLIENT_ENGINE_TYPE=library

# Копіюємо ТІЛЬКИ файли залежностей та схему
COPY apps/backend/package*.json ./
COPY apps/backend/prisma ./prisma/

# Встановлюємо ПРІЗМУ ЯВНО перед усім іншим
RUN npm install prisma@6.4.1 @prisma/client@6.4.1 --legacy-peer-deps

# Тепер решта залежностей
RUN npm install --legacy-peer-deps

# ГЕНЕРУЄМО КЛІЄНТ (тепер Прізма точно знайде свої модулі)
RUN ./node_modules/.bin/prisma generate --schema ./prisma/schema.prisma

# Копіюємо код
COPY apps/backend/ .

# Цей варіант просто збирає проект, ігноруючи помилки діагностики TS
RUN npm run build

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy --schema ./prisma/schema.prisma && node dist/main.js"]