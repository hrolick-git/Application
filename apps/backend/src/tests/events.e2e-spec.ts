import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

describe('Events (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    app = module.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
    await prisma.$connect();
    const pw = await bcrypt.hash('pwd', 10);
    const user = await prisma.user.create({ data: { email: 'eve@example.com', passwordHash: pw } });
    const res = await request(app.getHttpServer()).post('/auth/login').send({ email: 'eve@example.com', password: 'pwd' });
    token = res.body.access_token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('/events (GET) public list', async () => {
    return request(app.getHttpServer()).get('/events').expect(200);
  });

  it('/events (POST) create', async () => {
    const future = new Date(Date.now() + 1000 * 60 * 60).toISOString();
    return request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New', startsAt: future, location: 'x', visibility: 'PUBLIC' })
      .expect(201);
  });
});
