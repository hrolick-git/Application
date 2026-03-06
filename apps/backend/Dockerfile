FROM node:20-bullseye-slim

WORKDIR /app

# Системні бібліотеки для Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Railway зазвичай запускає збірку з кореня вибраної Root Directory (apps/backend)
# Тому копіюємо файли відносно цієї папки
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --legacy-peer-deps

# Копіюємо решту коду
COPY . .

# Генеруємо клієнт, явно вказуючи шлях
RUN npx prisma generate --schema ./prisma/schema.prisma

RUN npm run build

# Очищення для економії пам'яті
RUN npm prune --production

EXPOSE 4000

# Використовуємо прямий шлях до схеми в CMD
CMD ["sh", "-c", "npx prisma migrate deploy --schema ./prisma/schema.prisma && node dist/main"]