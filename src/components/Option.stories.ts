import type { Meta, StoryObj } from '@storybook/react';
import { OptionProps } from '../components/Option';

import Option from '../components/Option';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof Option> = {
  component: Option,
};

export default meta;
type Story = StoryObj<typeof Option>;

const optionProps:OptionProps = {
  id: 0,
  content: 'A.稳态是指细胞内液理化性质相对恒定',
  select: function (id: number): void {
    throw new Error('Function not implemented.');
  },
  submit: function (id: number): void {
    throw new Error('Function not implemented.');
  },
  state: {
    isSelected: false,
    isSubmitted: false,
    isCorrect: false
  }
}

export const FirstStory: Story = {
  args: optionProps,
};