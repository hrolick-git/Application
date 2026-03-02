FROM node:20-bullseye-slim

# debian bullseye has libssl1.1 which Prisma needs

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/backend/prisma ./apps/backend/prisma

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run prisma:generate -w backend

EXPOSE 4000

CMD ["npm", "run", "start:dev", "-w", "backend"]
