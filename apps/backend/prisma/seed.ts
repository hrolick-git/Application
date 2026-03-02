import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const pw = await bcrypt.hash('password', 10);
  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: { email: 'alice@example.com', passwordHash: pw }
  });
  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: { email: 'bob@example.com', passwordHash: pw }
  });

  await prisma.event.createMany({
    data: [
      {
        title: 'Public Event 1',
        description: 'Тестова подія',
        startsAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
        location: 'Київ',
        organizerId: user1.id,
        visibility: 'PUBLIC'
      },
      {
        title: 'Public Event 2',
        startsAt: new Date(Date.now() + 1000 * 60 * 120).toISOString(),
        location: 'Львів',
        organizerId: user2.id,
        visibility: 'PUBLIC',
        capacity: 5
      },
      {
        title: 'Public Event 3',
        startsAt: new Date(Date.now() + 1000 * 60 * 180).toISOString(),
        location: 'Одеса',
        organizerId: user1.id,
        visibility: 'PUBLIC'
      }
    ]
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
