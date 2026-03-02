import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@example.com', password: '123456' })
      .expect(201);
  });

  it('/auth/login (POST)', async () => {
    await prisma.user.create({
      data: { email: 'login@example.com', passwordHash: await require('bcrypt').hash('pwd', 10) }
    });
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'login@example.com', password: 'pwd' })
      .expect(201)
      .expect(res => {
        if (!res.body.access_token) throw new Error('Missing token');
      });
  });
});
