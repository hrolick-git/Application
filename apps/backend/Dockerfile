FROM node:20-bullseye-slim

WORKDIR /app

# Встановлюємо лише необхідні системні бібліотеки для Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Використовуємо ci для чистої та швидкої інсталяції
RUN npm ci --legacy-peer-deps

COPY . .

# Генеруємо клієнт Prisma
RUN npx prisma generate --schema ./prisma/schema.prisma

# Збірка NestJS (створює папку /dist)
RUN npm run build

# Видаляємо devDependencies, щоб зменшити розмір образу та споживання RAM
RUN npm prune --production

EXPOSE 4000

# ЗАПУСК: Використовуємо node dist/main замість npm run start
# Це критично для економії пам'яті!
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]