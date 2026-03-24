const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const total = await prisma.event.count();
  const violet = await prisma.event.count({ where: { colorTheme: 'violet' } });
  const nulls = await prisma.event.count({ where: { colorTheme: null } });

  console.log(JSON.stringify({ total, violet, nulls }, null, 2));

  const sample = await prisma.event.findMany({
    select: { id: true, title: true, visibility: true, colorTheme: true },
    orderBy: { createdAt: 'desc' },
    take: 8,
  });

  console.log(sample);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
