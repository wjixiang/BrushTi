import type { Meta, StoryObj } from '@storybook/react';

import { QuizApp } from './QuizApp';
import axios from 'axios';


const meta = {
  component: QuizApp,
} satisfies Meta<typeof QuizApp>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    apiReqest: {
      POST:(requestURL: string, requestData: object): Promise<string>=>{
        return new Promise(async(solve)=>{
          const response = await axios.post(requestURL, {reqestData: requestData});
          console.log(response.data)
          solve(JSON.stringify(response.data)); // 返回响应数据
        })
      },
      GET:(url: string): Promise<string>=>{
        return new Promise(async(solve)=>{
          const response = await axios.get(url);
          console.log(response.data)
          solve(JSON.stringify(response.data)); // 返回响应数据
        })
      }
    },
    appendLink: ()=>new Promise(()=>null)
  }
};