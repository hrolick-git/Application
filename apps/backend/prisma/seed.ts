import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // ─── Tags ────────────────────────────────────────────────────────────────────
  const tagNames = ['Tech', 'Art', 'Business', 'Music', 'Sport', 'Food', 'Other'];
  const tags: Record<string, string> = {};

  for (const name of tagNames) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name }
    });
    tags[name] = tag.id;
  }

  console.log('🏷️  Tags created:', tagNames.join(', '));

  // ─── Users ───────────────────────────────────────────────────────────────────
  const pw = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: { email: 'alice@example.com', passwordHash: pw, name: 'Alice Johnson' }
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: { email: 'bob@example.com', passwordHash: pw, name: 'Bob Smith' }
  });

  // ─── Events ──────────────────────────────────────────────────────────────────
  await prisma.event.create({
    data: {
      title: 'React Meetup Kyiv',
      description: 'Monthly React developers meetup in Kyiv. All levels welcome!',
      startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 120),
      location: 'Kyiv, UNIT.City',
      organizerId: user1.id,
      visibility: 'PUBLIC',
      capacity: 50,
      tags: { create: [{ tagId: tags['Tech'] }] }
    }
  });

  await prisma.event.create({
    data: {
      title: 'Node.js Workshop',
      description: 'Hands-on Node.js and NestJS workshop for backend developers.',
      startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 180),
      location: 'Lviv, IT Cluster',
      organizerId: user2.id,
      visibility: 'PUBLIC',
      capacity: 30,
      tags: { create: [{ tagId: tags['Tech'] }, { tagId: tags['Business'] }] }
    }
  });

  await prisma.event.create({
    data: {
      title: 'TypeScript Conference',
      description: 'Annual TypeScript conference with talks from industry experts.',
      startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      location: 'Odesa, Innovation Hub',
      organizerId: user1.id,
      visibility: 'PUBLIC',
      tags: { create: [{ tagId: tags['Tech'] }, { tagId: tags['Business'] }] }
    }
  });

  await prisma.event.create({
    data: {
      title: 'Jazz Night',
      description: 'An intimate jazz evening with live performances.',
      startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6),
      location: 'Kyiv, Atlas Club',
      organizerId: user2.id,
      visibility: 'PUBLIC',
      capacity: 100,
      tags: { create: [{ tagId: tags['Music'] }, { tagId: tags['Art'] }] }
    }
  });

  await prisma.event.create({
    data: {
      title: 'Team Planning Session',
      description: 'Private team quarterly planning meeting.',
      startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
      location: 'Online, Google Meet',
      organizerId: user2.id,
      visibility: 'PRIVATE',
      tags: { create: [{ tagId: tags['Business'] }] }
    }
  });

  console.log('✅ Seed completed!');
  console.log('👤 Users created:');
  console.log('   alice@example.com / password123');
  console.log('   bob@example.com / password123');
  console.log('📅 5 events created (4 public, 1 private)');
  console.log('🏷️  Tags: Tech, Art, Business, Music, Sport, Food, Other');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });