import type { Meta, StoryObj } from '@storybook/react';
import { SearchBar } from '../components/SearchBar';
import { useState } from 'react';

const meta: Meta<typeof SearchBar> = {
  title: 'Components/SearchBar',
  component: SearchBar,
  decorators: [
    (Story) => (
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
    onChange: (v) => console.log(v),
  },
};

export const WithValue: Story = {
  args: {
    value: 'React Meetup',
    onChange: (v) => console.log(v),
  },
};