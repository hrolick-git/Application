FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/backend/package.json ./apps/backend/
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build -w frontend

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/apps/frontend/dist ./dist

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]