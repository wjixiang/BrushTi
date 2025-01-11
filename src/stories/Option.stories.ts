import type { Meta, StoryObj } from '@storybook/react';

import Option from '../components/Option';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof Option> = {
  component: Option,
};

export default meta;
type Story = StoryObj<typeof Option>;

export const FirstStory: Story = {
  args: {
    
  },
};