import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import type { Tag } from '../types/tag';
import { TagSelector } from '../components/tags/TagSelector';

const meta: Meta<typeof TagSelector> = {
  title: 'Components/TagSelector',
  component: TagSelector,
  decorators: [
    (Story: React.ComponentType) => (
      <div className="p-6 max-w-2xl bg-white rounded-2xl shadow">
        <Story />
      </div>
    ),
  ],
  args: {
    maxSelected: 5,
  },
};

export default meta;
type Story = StoryObj<typeof TagSelector>;

const TAGS: Tag[] = [
  { id: '1', name: 'Tech' },
  { id: '2', name: 'Art' },
  { id: '3', name: 'Business' },
  { id: '4', name: 'Music' },
  { id: '5', name: 'Sport' },
  { id: '6', name: 'Food' },
  { id: '7', name: 'Other' },
];

export const Interactive: Story = {
  render: (args) => {
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>(['1']);
    return (
      <TagSelector
        {...args}
        availableTags={TAGS}
        selectedTagIds={selectedTagIds}
        onChangeSelectedTagIds={setSelectedTagIds}
      />
    );
  },
};

