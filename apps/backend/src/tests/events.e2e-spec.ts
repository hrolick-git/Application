import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../../../.env') });
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
  let otherToken: string;
  let eventId: string;
  let privateEventId: string;
  let privateShareToken: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
    await prisma.$connect();

    const pw = await bcrypt.hash('pwd123', 10);

    // Main user
    await prisma.user.create({
      data: { email: 'eve@example.com', passwordHash: pw, name: 'Eve' },
    });
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'eve@example.com', password: 'pwd123' });
    token = res.body.access_token;

    // Second user (to test access restrictions)
    await prisma.user.create({
      data: { email: 'other@example.com', passwordHash: pw, name: 'Other' },
    });
    const res2 = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'other@example.com', password: 'pwd123' });
    otherToken = res2.body.access_token;
  });

  afterAll(async () => {
    await prisma.participant.deleteMany();
    await prisma.event.deleteMany();
    await prisma.user.deleteMany({
      where: { email: { in: ['eve@example.com', 'other@example.com'] } },
    });
    await prisma.$disconnect();
    await app.close();
  });

  // ─── Public routes ───────────────────────────────────────────────────────────

  it('/events/public (GET) — returns public events without auth', () => {
    return request(app.getHttpServer())
      .get('/events/public')
      .expect(200)
      .expect((res) => {
        if (!Array.isArray(res.body)) throw new Error('Expected array');
      });
  });

  it('/events (GET) — returns 401 without token', () => {
    return request(app.getHttpServer()).get('/events').expect(401);
  });

  // ─── Create ──────────────────────────────────────────────────────────────────

  it('/events (POST) — creates event successfully', async () => {
    const future = new Date(Date.now() + 1000 * 60 * 60).toISOString();
    const res = await request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Event',
        startsAt: future,
        location: 'Kyiv',
        visibility: 'PUBLIC',
      })
      .expect(201);

    eventId = res.body.id;
    if (!eventId) throw new Error('Missing event id');
  });

  it('/events (POST) — creates private event with share token', async () => {
    const future = new Date(Date.now() + 1000 * 60 * 120).toISOString();
    const res = await request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Private Event',
        startsAt: future,
        location: 'Lviv',
        visibility: 'PRIVATE',
      })
      .expect(201);

    privateEventId = res.body.id;
    privateShareToken = res.body.shareToken;

    if (!privateEventId) throw new Error('Missing private event id');
    if (!privateShareToken) throw new Error('Missing private share token');
  });

  it('/events (POST) — returns 401 without token', () => {
    const future = new Date(Date.now() + 1000 * 60 * 60).toISOString();
    return request(app.getHttpServer())
      .post('/events')
      .send({ title: 'No Auth', startsAt: future, location: 'x', visibility: 'PUBLIC' })
      .expect(401);
  });

  it('/events (POST) — returns 400 when missing required fields', () => {
    return request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'No location or date' })
      .expect(400);
  });

  it('/events (POST) — returns 403 when startsAt is in the past', () => {
    const past = new Date(Date.now() - 1000 * 60 * 60).toISOString();
    return request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Past Event', startsAt: past, location: 'x', visibility: 'PUBLIC' })
      .expect(403);
  });

  // ─── Get ─────────────────────────────────────────────────────────────────────

  it('/events (GET) — returns list for authenticated user', () => {
    return request(app.getHttpServer())
      .get('/events')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        if (!Array.isArray(res.body)) throw new Error('Expected array');
      });
  });

  it('/events/:id (GET) — returns event by id', () => {
    return request(app.getHttpServer())
      .get(`/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        if (res.body.id !== eventId) throw new Error('Wrong event id');
      });
  });

  it('/events/:id (GET) — returns 404 for non-existent event', () => {
    return request(app.getHttpServer())
      .get('/events/non-existent-id')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });

  it('/events/:id (GET) — blocks private event for another user', () => {
    return request(app.getHttpServer())
      .get(`/events/${privateEventId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403);
  });

  it('/events/shared/:shareToken (GET) — returns private event by shared link without auth', () => {
    return request(app.getHttpServer())
      .get(`/events/shared/${privateShareToken}`)
      .expect(200)
      .expect((res) => {
        if (res.body.id !== privateEventId) throw new Error('Wrong private event id');
        if (res.body.shareToken) throw new Error('Share token must not be exposed');
      });
  });

  // ─── Update ──────────────────────────────────────────────────────────────────

  it('/events/:id (PATCH) — organizer can update event', () => {
    return request(app.getHttpServer())
      .patch(`/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title' })
      .expect(200)
      .expect((res) => {
        if (res.body.title !== 'Updated Title') throw new Error('Title not updated');
      });
  });

  it('/events/:id (PATCH) — non-organizer gets 403', () => {
    return request(app.getHttpServer())
      .patch(`/events/${eventId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: 'Hacked' })
      .expect(403);
  });

  // ─── Join / Leave ─────────────────────────────────────────────────────────────

  it('/events/:id/join (POST) — user can join event', () => {
    return request(app.getHttpServer())
      .post(`/events/${eventId}/join`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(201);
  });

  it('/events/:id/join (POST) — blocks joining private event without shared link', () => {
    return request(app.getHttpServer())
      .post(`/events/${privateEventId}/join`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403);
  });

  it('/events/shared/:shareToken/join (POST) — user can join private event via shared link', () => {
    return request(app.getHttpServer())
      .post(`/events/shared/${privateShareToken}/join`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(201);
  });

  it('/events/:id (GET) — joined user can access private event by id', () => {
    return request(app.getHttpServer())
      .get(`/events/${privateEventId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(200)
      .expect((res) => {
        if (res.body.id !== privateEventId) throw new Error('Wrong private event id after join');
      });
  });

  it('/events/:id/leave (POST) — user can leave private event after shared join', () => {
    return request(app.getHttpServer())
      .post(`/events/${privateEventId}/leave`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(201);
  });

  it('/events/:id/leave (POST) — user can leave event', () => {
    return request(app.getHttpServer())
      .post(`/events/${eventId}/leave`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(201);
  });

  // ─── Delete ──────────────────────────────────────────────────────────────────

  it('/events/:id (DELETE) — non-organizer gets 403', () => {
    return request(app.getHttpServer())
      .delete(`/events/${eventId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403);
  });

  it('/events/:id (DELETE) — organizer can delete event', () => {
    return request(app.getHttpServer())
      .delete(`/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/events/:id (DELETE) — organizer can delete private event', () => {
    return request(app.getHttpServer())
      .delete(`/events/${privateEventId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});