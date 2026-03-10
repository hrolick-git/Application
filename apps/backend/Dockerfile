FROM node:20-bullseye-slim
WORKDIR /app
ARG CACHE_BUST=1
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

ENV PRISMA_CLI_QUERY_ENGINE_TYPE=library
ENV PRISMA_CLIENT_ENGINE_TYPE=library

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --legacy-peer-deps --include=dev

COPY . .

RUN npx prisma generate --schema ./prisma/schema.prisma

RUN npm run build

EXPOSE 4000

CMD ["sh", "-c", "ls -la /app && ls -la /app/dist 2>/dev/null || echo 'NO DIST FOLDER' && npx prisma migrate deploy --schema ./prisma/schema.prisma && node dist/main.js"]