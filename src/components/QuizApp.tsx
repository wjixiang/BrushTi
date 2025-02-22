import Page from '../components/Page';
import { useState } from 'react';
import QuizFilterPanel from './QuizFilterPanel';
import { quizType } from 'src/types/quizData.types';
import * as React from 'react';


type Props = {
    appendLink: ()=>Promise<null|string>;
    apiReqest: {
        POST: (requestURL:string, reqestData: object)=>Promise<string>;
        GET: (url:string)=>Promise<string>
    }
}
export const QuizApp = ({appendLink, apiReqest}: Props) => {
    const [quizzes,setQuizzes] = useState<quizType[]>([])
  
    return (
      <div>
        <div>
          <QuizFilterPanel setQuizzes={setQuizzes} apiReqest={apiReqest}/>
        </div>
        
        <div>
          <Page quizSet={quizzes} appendLink={appendLink} apiReqest={apiReqest}/>
        </div>
      </div>
    );
}