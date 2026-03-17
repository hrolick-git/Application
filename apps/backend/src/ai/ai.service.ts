import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import Groq from 'groq-sdk';

@Injectable()
export class AiService {
  private groq: Groq;

  constructor(private prisma: PrismaService) {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  async ask(question: string, userId: string): Promise<{ answer: string }> {
    // Load user's events with tags and participants
    const events = await this.prisma.event.findMany({
      where: {
        OR: [
          { organizerId: userId },
          { participants: { some: { userId } } }
        ]
      },
      include: {
        tags: { include: { tag: true } },
        participants: { include: { user: { select: { email: true, name: true } } } }
      },
      orderBy: { startsAt: 'asc' }
    });

    // Format events as compact snapshot for the prompt
    const snapshot = events.map(e => ({
      id: e.id,
      title: e.title,
      description: e.description,
      startsAt: e.startsAt,
      endsAt: e.endsAt,
      location: e.location,
      visibility: e.visibility,
      isOrganizer: e.organizerId === userId,
      tags: e.tags.map(et => et.tag.name),
      participants: e.participants.map(p => p.user.email),
      capacity: e.capacity,
    }));

    const today = new Date().toISOString();

    const prompt = `You are an AI assistant for an event management app called VibeCheck.
Today's date is ${today}.
The user is asking: "${question}"

Here is a snapshot of the user's events (JSON):
${JSON.stringify(snapshot, null, 2)}

Rules:
- Answer only based on the data provided above.
- Be concise and friendly.
- If the question is unclear or you cannot answer based on the data, respond with exactly: "Sorry, I didn't understand that. Please try rephrasing your question."
- Do not create, edit, or delete any data.
- Format dates in a human-readable way.
- If listing events, use bullet points.`;

    try {
      const completion = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.3,
      });

      const answer = completion.choices[0]?.message?.content || 
        "Sorry, I didn't understand that. Please try rephrasing your question.";

      return { answer };
    } catch (err) {
      console.error('Groq API error:', err);
      return { answer: "Sorry, I didn't understand that. Please try rephrasing your question." };
    }
  }
}