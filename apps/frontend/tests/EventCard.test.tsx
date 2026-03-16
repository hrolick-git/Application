import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { EventCard } from '../src/components/EventCard';

const mockEvent = {
  id: '1',
  title: 'React Meetup',
  startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  location: 'Kyiv',
  visibility: 'PUBLIC' as const,
  organizerId: 'user1',
  participants: [],
  tags: [{ id: '1', name: 'Tech' }],
};

describe('EventCard', () => {
  test('renders event title', () => {
    render(
      <MemoryRouter>
        <EventCard event={mockEvent} isOrganizer={false} onRefresh={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText('React Meetup')).toBeInTheDocument();
  });

  test('renders tag chip', () => {
    render(
      <MemoryRouter>
        <EventCard event={mockEvent} isOrganizer={false} onRefresh={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText('Tech')).toBeInTheDocument();
  });
});