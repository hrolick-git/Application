# Application

**Опис:**  
Proof‑of‑Concept застосунок для керування подіями з реєстрацією, календарем, JWT‑аутентифікацією.

## 📦 Швидкий старт

1. Скопіюйте `.env.example` в `.env` і заповніть (достатньо дефолтних значень).
2. Запустіть:
   ```bash
   npm ci
   npm run docker:up
   ```
3. Відкрийте [http://localhost:5173](http://localhost:5173) для фронтенду.

Backend доступний на порту 4000.

## 🧱 Архітектура

- Монорепозиторій з npm workspaces (`apps/backend`, `apps/frontend`)
- Бекенд: NestJS + Prisma + PostgreSQL
- Фронтенд: React + Vite + TypeScript + Tailwind + Zustand
- Контейнеризація: Docker + docker-compose
- Тести: Jest, Vitest, Playwright
- Документація у `docs/`

## 🛠 Команди

```bash
npm run dev        # одночасно запускає бекенд та фронтенд
npm run lint
npm run test
npm run test:e2e
npm run db:migrate
npm run db:seed
npm run docker:up
npm run docker:down
```

## 📝 Примітки

- Невказані параметри позначені як «не вказано» у документах.
- `input type="datetime-local"` використано для вибору дати/часу.
- Приватні події не показуються у списку, але доступні по id для організатора/учасників.

## 🧩 Структура

Див. `docs/file-manifest.md`.

## 🛡 Безпека

- Паролі хешуються bcrypt
- JWT секрет з `.env`
- Helmet, CORS, rate limiting
- Валідація через yup

## 📚 Додаткові доки

- `docs/implementation-plan.md`
- `docs/acceptance.md`
- `docs/deploy.md`
- `docs/risks.md`
- `docs/resources.md`
