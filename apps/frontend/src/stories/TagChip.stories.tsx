import type { Meta, StoryObj } from '@storybook/react';
import { TagChip } from '../components/tags/TagChip';

const meta: Meta<typeof TagChip> = {
  title: 'Components/TagChip',
  component: TagChip,
  args: {
    label: 'Tech',
  },
};

export default meta;
type Story = StoryObj<typeof TagChip>;

export const Default: Story = {
  args: {},
};

export const Selected: Story = {
  args: {
    selected: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

