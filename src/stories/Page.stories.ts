import type { Meta, StoryObj } from '@storybook/react';

import Page from '../components/Page';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof Page> = {
  component: Page,
};

export default meta;
type Story = StoryObj<typeof Page>;

export const FirstStory: Story = {
  args: {
    
  },
};