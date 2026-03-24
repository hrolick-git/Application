import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function createSeedDate(dayOffset: number, hour: number) {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, 0, 0, 0);
  return date;
}

function addHours(date: Date, hours: number) {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

type SeedEvent = {
  title: string;
  description: string;
  dayOffset: number;
  hour: number;
  durationHours: number;
  location: string;
  organizer: 'alice' | 'bob';
  visibility: 'PUBLIC' | 'PRIVATE';
  capacity?: number;
  tags: string[];
};

async function main() {
  // ─── Tags ────────────────────────────────────────────────────────────────────
  const tagNames = ['Tech', 'Art', 'Business', 'Music', 'Sport', 'Food', 'Game', 'Other'];
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

  const users = {
    alice: user1.id,
    bob: user2.id
  };

  const seededEvents: SeedEvent[] = [
    {
      title: 'Future Devs Meetup: Build or Be Replaced',
      description: 'A public meetup for developers who are tired of tutorials and ready to build real things. Live coding, brutal feedback, and zero patience for “I’ll do it later.”',
      dayOffset: 3,
      hour: 18,
      durationHours: 2,
      location: 'Kyiv, UNIT.City',
      organizer: 'alice',
      visibility: 'PUBLIC',
      capacity: 50,
      tags: ['Tech']
    },
    {
      title: '🎨 Art Unleashed: No Rules, No Limits',
      description: 'An open space for creators to express whatever the hell they want. Paint, draw, experiment — just don’t play it safe.',
      dayOffset: 5,
      hour: 19,
      durationHours: 3,
      location: 'Lviv, Creative Space',
      organizer: 'bob',
      visibility: 'PUBLIC',
      capacity: 30,
      tags: ['Art', 'Business']
    },
    {
      title: 'Inner Circle: No Outsiders Allowed',
      description: 'A strictly private event for those who are actually involved. Real decisions, real responsibility, and zero room for random opinions. If you’re invited — you’re expected to contribute.',
      dayOffset: 6,
      hour: 14,
      durationHours: 3,
      location: 'Kyiv, Exclusive Venue',
      organizer: 'alice',
      visibility: 'PRIVATE',
      capacity: 10,
      tags: ['Business']
    },
    {
      title: 'Money Talks: Business Without Filters',
      description: 'A public business event where we drop the fake success stories and talk about real wins, failures, and how to actually make money.',
      dayOffset: 7,
      hour: 14,
      durationHours: 2,
      location: 'Kharkiv, Innovation Hub',
      organizer: 'alice',
      visibility: 'PUBLIC',
      tags: ['Tech']
    },
    {
      title: 'Sound Clash: Feel It or Leave',
      description: 'A live music event where artists bring raw energy and the audience decides what’s worth listening to. No vibe — no mercy.',
      dayOffset: 8,
      hour: 20,
      durationHours: 3,
      location: 'Kyiv, Atlas Club',
      organizer: 'bob',
      visibility: 'PUBLIC',
      capacity: 100,
      tags: ['Music', 'Art']
    },
    {
      title: '🏋️ No Pain No Gain: Street Workout Battle',
      description: 'A high-energy outdoor competition for those who don’t skip leg day. Strength, endurance, and pure determination.',
      dayOffset: 9,
      hour: 10,
      durationHours: 3,
      location: 'Dnipro, Central Park',
      organizer: 'alice',
      visibility: 'PUBLIC',
      tags: ['Sport']
    },
    {
      title: '🍔 Street Food Madness: Eat Like You Mean It',
      description: 'A public food festival packed with bold flavors, messy bites, and zero calorie counting. Come hungry or don’t come at all.',
      dayOffset: 10,
      hour: 13,
      durationHours: 3,
      location: 'Kyiv, Food Market',
      organizer: 'bob',
      visibility: 'PUBLIC',
      tags: ['Food']
    },
    {
      title: '🚀 Startup Grind: Pitch or Go Home',
      description: 'An open stage for founders to pitch their ideas and get real feedback. No sugarcoating — just what works and what doesn’t.',
      dayOffset: 11,
      hour: 17,
      durationHours: 3,
      location: 'Kharkiv, Startup Hub',
      organizer: 'alice',
      visibility: 'PUBLIC',
      tags: ['Business']
    },
    {
      title: '🎤 Open Mic Chaos: Say It Loud',
      description: 'Stand-up, poetry, stories — anything goes. Grab the mic and say what you’ve been holding back.',
      dayOffset: 12,
      hour: 19,
      durationHours: 3,
      location: 'Odesa, Art Space',
      organizer: 'bob',
      visibility: 'PUBLIC',
      tags: ['Other']
    },
    {
      title: '🧠 Mind Games: Think Faster Than Others',
      description: 'A public challenge of logic, puzzles, and quick thinking. Outsmart everyone or enjoy watching others do it.',
      dayOffset: 13,
      hour: 15,
      durationHours: 2,
      location: 'Dnipro',
      organizer: 'alice',
      visibility: 'PUBLIC',
      tags: ['Game']
    },
    {
      title: '🕶️ Off the Record: What Happens Here Stays Here',
      description: 'A closed-door session where the real conversations happen. No recordings, no leaks — just honest takes, risky ideas, and things we don’t say out loud in public.',
      dayOffset: 14,
      hour: 19,
      durationHours: 3,
      location: 'Lviv, Private Venue',
      organizer: 'bob',
      visibility: 'PRIVATE',
      capacity: 10,
      tags: ['Tech']
    }
  ];

  const seededEventTitles = seededEvents.map((event) => event.title);

  await prisma.event.deleteMany({
    where: {
      title: { in: seededEventTitles }
    }
  });

  // ─── Events ──────────────────────────────────────────────────────────────────
  for (const event of seededEvents) {
    const startsAt = createSeedDate(event.dayOffset, event.hour);

    await prisma.event.create({
      data: {
        title: event.title,
        description: event.description,
        startsAt,
        endsAt: addHours(startsAt, event.durationHours),
        location: event.location,
        organizerId: users[event.organizer],
        visibility: event.visibility,
        ...(event.capacity ? { capacity: event.capacity } : {}),
        tags: {
          create: event.tags.map((tagName) => ({ tagId: tags[tagName] }))
        }
      }
    });
  }

  console.log('✅ Seed completed!');
  console.log('👤 Users created:');
  console.log('   alice@example.com / password123');
  console.log('   bob@example.com / password123');
  console.log(`📅 ${seededEvents.length} events created (${seededEvents.filter((event) => event.visibility === 'PUBLIC').length} public, ${seededEvents.filter((event) => event.visibility === 'PRIVATE').length} private)`);
  console.log('🏷️  Tags: Tech, Art, Business, Music, Sport, Food, Game, Other');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });