# 📅 VibeCheck

> A full-stack web application for event management with registration, calendar view, and JWT authentication.

🌐 **Live Demo:** [https://frontend-production-0751.up.railway.app](https://frontend-production-0751.up.railway.app)

![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)
![Railway](https://img.shields.io/badge/Deployed-Railway-0B0D0E?style=flat-square&logo=railway&logoColor=white)

---

## ✨ Features

- 🔐 User registration and login with JWT authentication
- 📆 Event calendar powered by FullCalendar
- 🔒 Private and public events
- 👥 Join and leave events created by other users
- 🛡 Security: bcrypt, Helmet, CORS, rate limiting, input validation

---

## 🧱 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Zustand, FullCalendar |
| **Backend** | NestJS, Prisma ORM, PostgreSQL |
| **Auth** | JWT, Passport.js |
| **DevOps** | Docker, docker-compose, Railway |
| **Testing** | Jest, Vitest, Playwright |

---

## 🗂 Project Structure (Monorepo)

```
application/
├── apps/
│   ├── backend/          # NestJS REST API
│   │   ├── src/
│   │   ├── prisma/
│   │   └── Dockerfile
│   └── frontend/         # React + Vite SPA
│       ├── src/
│       └── Dockerfile
├── docs/                 # Project documentation
├── docker-compose.yml
└── package.json          # npm workspaces root
```

---

## 🚀 Getting Started (Local)

### Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Option 1 — Docker Compose (recommended)

```bash
# 1. Clone the repository
git clone <repo-url>
cd application

# 2. Copy environment variables
cp .env.example .env

# 3. Start all services
docker-compose up --build
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:4000](http://localhost:4000)

### Option 2 — Manual

**Backend:**
```bash
cd apps/backend
npm install
# Configure .env (DATABASE_URL)
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

**Frontend:**
```bash
cd apps/frontend
npm install
npm run dev
```

---

## 🌍 Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres

# JWT
JWT_SECRET=your-super-secret-key

# Frontend
VITE_API_URL=http://localhost:4000
```

---

## 🛠 Available Scripts

```bash
# Development
npm run dev            # Start backend + frontend simultaneously
npm run docker:up      # Start all services via Docker
npm run docker:down    # Stop all containers

# Database
npm run db:migrate     # Apply Prisma migrations
npm run db:seed        # Seed database with test data

# Code quality
npm run lint
npm run test
npm run test:e2e
```

---

## ☁️ Deployment (Railway)

The project is deployed as two separate services on [Railway](https://railway.app).

### Backend Service
- **Root Directory:** `apps/backend`
- **Dockerfile:** `apps/backend/Dockerfile`
- **Database:** Railway PostgreSQL plugin (use the internal `DATABASE_URL`)

### Frontend Service
- **Root Directory:** *(leave empty)*
- **Dockerfile:** `apps/frontend/Dockerfile`

---

## 🐛 Troubleshooting

### Prisma engine error on Railway/Docker

If you see `Cannot find module ... query_engine_bg.postgresql.wasm-base64.js`, make sure these env vars are set in your Dockerfile:

```dockerfile
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=library
ENV PRISMA_CLIENT_ENGINE_TYPE=library
```

### Frontend build fails — missing `@fullcalendar/core`

```bash
npm install @fullcalendar/core -w apps/frontend
```

Then commit the updated `package-lock.json`.

### Database connection error on Railway

Make sure `DATABASE_URL` points to the **internal** Railway PostgreSQL address (not the public one).

### Prisma version mismatch (`@prisma/config` conflict)

```bash
rm package-lock.json
npm install
```

Make sure `prisma` and `@prisma/client` versions match in `package.json`.

### Useful Git commands for rollback

```bash
# Hard reset to a stable commit
git reset --hard <commit_id>

# Force push after rollback
git push origin main --force
```

---

## 🛡 Security

- Passwords hashed with **bcrypt**
- **JWT** tokens stored in httpOnly cookies
- **Helmet** — HTTP header protection
- **CORS** — cross-origin request restrictions
- **Rate limiting** — brute-force protection
- Input validation via **Yup** + **class-validator**

---

## 📚 Documentation

- [`docs/implementation-plan.md`](docs/implementation-plan.md)
- [`docs/acceptance.md`](docs/acceptance.md)
- [`docs/deploy.md`](docs/deploy.md)
- [`docs/risks.md`](docs/risks.md)
- [`docs/resources.md`](docs/resources.md)
- [`docs/file-manifest.md`](docs/file-manifest.md)