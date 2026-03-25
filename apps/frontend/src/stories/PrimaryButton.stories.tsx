import type { Meta, StoryObj } from '@storybook/react';
import { PrimaryButton } from '../components/PrimaryButton';

const meta: Meta<typeof PrimaryButton> = {
  title: 'Components/PrimaryButton',
  component: PrimaryButton,
  args: {
    children: 'Primary Button',
  },
};

export default meta;
type Story = StoryObj<typeof PrimaryButton>;

export const Default: Story = {
  args: {},
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const NotFullWidth: Story = {
  args: {
    fullWidth: false,
  },
};

