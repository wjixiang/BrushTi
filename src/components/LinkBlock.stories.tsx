import type { Meta, StoryObj } from '@storybook/react';

import { LinkBlock } from './LinkBlock';

const meta = {
  component: LinkBlock,
} satisfies Meta<typeof LinkBlock>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    index: 1,
    linkId: "abc",
    linkName: "ABC",
    redirect: (id: string)=>{}
  }
};