import type { Meta, StoryObj } from '@storybook/react';
import { SearchBar } from '../components/SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Components/SearchBar',
  component: SearchBar,
  decorators: [
    (Story: React.ComponentType) => (
      <div className="p-4 max-w-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Empty: Story = {
  args: {
    value: '',
    onChange: (v: string) => console.log(v),
  },
};

export const WithValue: Story = {
  args: {
    value: 'React Meetup',
    onChange: (v: string) => console.log(v),
  },
};