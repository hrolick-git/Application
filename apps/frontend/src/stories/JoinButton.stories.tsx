import type { Meta, StoryObj } from '@storybook/react';
import { JoinButton } from '../components/JoinButton';
import { Toaster } from 'react-hot-toast';

const meta: Meta<typeof JoinButton> = {
  title: 'Components/JoinButton',
  component: JoinButton,
  decorators: [
    (Story: React.ComponentType) => (
      <div className="p-4 max-w-sm">
        <Toaster />
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof JoinButton>;

const baseEvent = {
  id: '1',
  title: 'React Meetup',
  visibility: 'PUBLIC',
  capacity: 50,
  participants: [],
  joined: false,
};

export const Default: Story = {
  args: {
    event: baseEvent,
    onRefresh: () => console.log('refresh'),
  },
};

export const Joined: Story = {
  args: {
    event: { ...baseEvent, joined: true },
    onRefresh: () => console.log('refresh'),
  },
};

export const Full: Story = {
  args: {
    event: { ...baseEvent, capacity: 2, participants: [{ userId: 'a' }, { userId: 'b' }] },
    onRefresh: () => console.log('refresh'),
  },
};

export const Private: Story = {
  args: {
    event: { ...baseEvent, visibility: 'PRIVATE' },
    onRefresh: () => console.log('refresh'),
  },
};