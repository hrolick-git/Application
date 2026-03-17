import type { Meta, StoryObj } from '@storybook/react';
import { EventCard } from '../components/EventCard';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof EventCard> = {
  title: 'Components/EventCard',
  component: EventCard,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="max-w-sm p-4">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EventCard>;

const baseEvent = {
  id: '1',
  title: 'React Meetup Kyiv',
  description: 'Monthly React developers meetup in Kyiv. All levels welcome!',
  startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
  location: 'Kyiv, UNIT.City',
  capacity: 50,
  participants: [],
  visibility: 'PUBLIC' as const,
  organizerId: 'user-1',
  tags: [
    { id: 'tag-1', name: 'Tech' },
    { id: 'tag-2', name: 'Business' },
  ],
};

export const Public: Story = {
  args: {
    event: baseEvent,
    isOrganizer: false,
    onRefresh: () => console.log('refresh'),
  },
};

export const Private: Story = {
  args: {
    event: { ...baseEvent, visibility: 'PRIVATE' as const, title: 'Private Team Meeting' },
    isOrganizer: false,
    onRefresh: () => console.log('refresh'),
  },
};

export const AsOrganizer: Story = {
  args: {
    event: baseEvent,
    isOrganizer: true,
    onRefresh: () => console.log('refresh'),
  },
};

export const FullEvent: Story = {
  args: {
    event: {
      ...baseEvent,
      capacity: 2,
      participants: [{ userId: 'a' }, { userId: 'b' }],
    },
    isOrganizer: false,
    onRefresh: () => console.log('refresh'),
  },
};

export const NoTags: Story = {
  args: {
    event: { ...baseEvent, tags: [] },
    isOrganizer: false,
    onRefresh: () => console.log('refresh'),
  },
};