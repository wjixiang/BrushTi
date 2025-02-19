import type { Meta, StoryObj } from '@storybook/react';

import Page from './Page';
import { A1 } from 'src/types/quizData.types';

const meta = {
  component: Page,
} satisfies Meta<typeof Page>;

export default meta;

type Story = StoryObj<typeof meta>;

const testQuizList = [
  {
    _id: "aofjiofoih",
    type: 'A1',
    class: '生理学',
    unit: '第一章 绪论',
    tags: [],
    question: '2010N1A 关于体液的叙述正确的是',
    options: [{
      oid: 'A',
      text: 'A.分布在各部分的体液量大体相等'
    },{
      oid: 'B',
      text: 'B.各部分体液彼此隔开又相互沟通'
    },{
      oid: 'C',
      text: 'C.各部分体液的成分几乎没有差别'
    },{
      oid: 'D',
      text: 'D.各部分体液中最活跃的是细胞内液'
    }],
    answer: 'B',
    analysis: {
      point: null,
      discuss: null,
      link: []
    }
  } as A1,
  {
    _id: "aofjiofoih",
    type: 'A1',
    class: '生理学',
    unit: '第一章 绪论',
    tags: [],
    question: '2010N1A 关于体液的叙述正确的是',
    options: [{
      oid: 'A',
      text: 'A.分布在各部分的体液量大体相等'
    },{
      oid: 'B',
      text: 'B.各部分体液彼此隔开又相互沟通'
    },{
      oid: 'C',
      text: 'C.各部分体液的成分几乎没有差别'
    },{
      oid: 'D',
      text: 'D.各部分体液中最活跃的是细胞内液'
    }],
    answer: 'B',
    analysis: {
      point: null,
      discuss: null,
      link: []
    }
  } as A1
]

export const Default: Story = {
  args: {
    quizSet: testQuizList
  }
};

