"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, '../../../.env') });
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const app_module_1 = require("../app.module");
const prisma_service_1 = require("../prisma.service");
const bcrypt = require("bcrypt");
describe('AuthController (e2e)', () => {
    let app;
    let prisma;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
        prisma = app.get(prisma_service_1.PrismaService);
        await prisma.$connect();
    });
    afterAll(async () => {
        await prisma.user.deleteMany({
            where: {
                email: {
                    in: [
                        'test@example.com',
                        'login@example.com',
                        'duplicate@example.com',
                    ],
                },
            },
        });
        await prisma.$disconnect();
        await app.close();
    });
    it('/auth/register (POST) — success', () => {
        return request(app.getHttpServer())
            .post('/auth/register')
            .send({ email: 'test@example.com', password: '123456', name: 'Test User' })
            .expect(201);
    });
    it('/auth/register (POST) — duplicate email returns 409', async () => {
        await prisma.user.create({
            data: {
                email: 'duplicate@example.com',
                passwordHash: await bcrypt.hash('pwd', 10),
                name: 'Dup User',
            },
        });
        return request(app.getHttpServer())
            .post('/auth/register')
            .send({ email: 'duplicate@example.com', password: '123456', name: 'Dup User' })
            .expect(409);
    });
    it('/auth/register (POST) — missing name returns 400', () => {
        return request(app.getHttpServer())
            .post('/auth/register')
            .send({ email: 'noname@example.com', password: '123456' })
            .expect(400);
    });
    it('/auth/register (POST) — missing email returns 400', () => {
        return request(app.getHttpServer())
            .post('/auth/register')
            .send({ password: '123456', name: 'No Email' })
            .expect(400);
    });
    it('/auth/register (POST) — password too short returns 400', () => {
        return request(app.getHttpServer())
            .post('/auth/register')
            .send({ email: 'short@example.com', password: '123', name: 'Short' })
            .expect(400);
    });
    it('/auth/login (POST) — success returns access_token', async () => {
        await prisma.user.create({
            data: {
                email: 'login@example.com',
                passwordHash: await bcrypt.hash('pwd123', 10),
                name: 'Login User',
            },
        });
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'login@example.com', password: 'pwd123' })
            .expect(201)
            .expect((res) => {
            if (!res.body.access_token)
                throw new Error('Missing access_token');
            if (!res.body.user)
                throw new Error('Missing user object');
            if (!res.body.user.email)
                throw new Error('Missing user email');
        });
    });
    it('/auth/login (POST) — wrong password returns 401', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'login@example.com', password: 'wrongpassword' })
            .expect(401);
    });
    it('/auth/login (POST) — non-existent user returns 401', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'nobody@example.com', password: 'pwd123' })
            .expect(401);
    });
    it('/auth/login (POST) — missing email returns 400', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ password: 'pwd123' })
            .expect(400);
    });
});
//# sourceMappingURL=auth.e2e-spec.js.map