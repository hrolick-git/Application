# План реалізації

1. **Ініціалізація монорепозиторію** – npm workspaces з двома додатками.
2. **Скелет бекенду** – NestJS з Prisma, модулі auth/events/users.
3. **База даних** – Prisma schema з трьома моделями; seed-скрипт.
4. **JWT-автентифікація** – bcrypt + passport-jwt; захищені маршрути.
5. **Валідація** – yup + власна pipe.
6. **API** – відповідно до специфікації.
7. **Тести** – Jest/supertest для бекенду, Vitest/RTL для фронтенду, Playwright e2e.
8. **Фронтенд** – Vite+React+TypeScript+Zustand+Tailwind; сторінки/компоненти.
9. **Календар** – простий custom із CSS Grid.
10. **Dockers** – Dockerfile для кожного додатку + docker-compose.
11. **CI** – GitHub Actions workflow.
12. **Документація** – README, deployment, acceptance, ризики, ресурси.
