import type { Meta, StoryObj } from '@storybook/react';

import QuizFilterPanel from './QuizFilterPanel';

const meta = {
  component: QuizFilterPanel,
} satisfies Meta<typeof QuizFilterPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    setQuizzes: () => {},
    apiReqest: {
      POST: async(reqestURL:string,requestData) => {return ""},
      GET: async(reqestURL:string) => {return ""}
    }
  }
};