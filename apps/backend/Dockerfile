FROM node:20-bullseye-slim

WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

ENV PRISMA_CLI_QUERY_ENGINE_TYPE=library
ENV PRISMA_CLIENT_ENGINE_TYPE=library

COPY apps/backend/package*.json ./
COPY apps/backend/prisma/ ./prisma/

RUN npm install --legacy-peer-deps

COPY apps/backend/ .

RUN npx nest build

EXPOSE 4000

CMD ["sh", "-c", "npx prisma generate --schema ./prisma/schema.prisma && npx prisma migrate deploy --schema ./prisma/schema.prisma && node dist/main.js"]