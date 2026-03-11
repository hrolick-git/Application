import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
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

  await prisma.event.createMany({
    data: [
      {
        title: 'React Meetup Kyiv',
        description: 'Monthly React developers meetup in Kyiv. All levels welcome!',
        startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
        endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 120).toISOString(),
        location: 'Kyiv, UNIT.City',
        organizerId: user1.id,
        visibility: 'PUBLIC',
        capacity: 50
      },
      {
        title: 'Node.js Workshop',
        description: 'Hands-on Node.js and NestJS workshop for backend developers.',
        startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
        endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 180).toISOString(),
        location: 'Lviv, IT Cluster',
        organizerId: user2.id,
        visibility: 'PUBLIC',
        capacity: 30
      },
      {
        title: 'TypeScript Conference',
        description: 'Annual TypeScript conference with talks from industry experts.',
        startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
        location: 'Odesa, Innovation Hub',
        organizerId: user1.id,
        visibility: 'PUBLIC'
      },
      {
        title: 'Team Planning Session',
        description: 'Private team quarterly planning meeting.',
        startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(),
        location: 'Online, Google Meet',
        organizerId: user2.id,
        visibility: 'PRIVATE'
      }
    ]
  });

  console.log('✅ Seed completed!');
  console.log('👤 Users created:');
  console.log('   alice@example.com / password123');
  console.log('   bob@example.com / password123');
  console.log('📅 4 events created (3 public, 1 private)');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });