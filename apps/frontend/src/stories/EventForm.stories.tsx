import type { Meta, StoryObj } from '@storybook/react';
import { EventForm } from '../components/EventForm';

const meta: Meta<typeof EventForm> = {
  title: 'Components/EventForm',
  component: EventForm,
  decorators: [
    (Story: React.ComponentType) => (
      <div className="p-6 max-w-2xl bg-white rounded-2xl shadow">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EventForm>;

export const Create: Story = {
  args: {
    buttonText: 'Create Event',
    onSubmit: (data: any) => console.log('submitted', data),
    availableTags: [
      { id: '1', name: 'Tech' },
      { id: '2', name: 'Art' },
      { id: '3', name: 'Business' },
      { id: '4', name: 'Music' },
      { id: '5', name: 'Sport' },
    ],
  },
};

export const Edit: Story = {
  args: {
    buttonText: 'Save Changes',
    initialData: {
      title: 'React Meetup Kyiv',
      description: 'Monthly React developers meetup',
      location: 'Kyiv, UNIT.City',
      startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
      capacity: 50,
      visibility: 'PUBLIC',
      tags: [{ id: 'tag-1', name: 'Tech' }],
    },
    onSubmit: (data: any) => console.log('submitted', data),
  },
};