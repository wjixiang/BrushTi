import type { Meta, StoryObj } from '@storybook/react';

import QuizPreview from './QuizPreview';

const meta = {
  component: QuizPreview,
} satisfies Meta<typeof QuizPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 0,
    status: "todo"
  }
};