import  { useImperativeHandle, useState, forwardRef } from 'react';  
import { quizType } from 'src/types/quizData.types';
import styled from 'styled-components';  
import * as React from 'react'
import { CirclePlus } from 'lucide-react';
import axios from 'axios';
import { request } from 'obsidian';

// 假设类型接口已经定义在 types.ts 文件中  
// import { quizType, oid } from './types';  

//////////////////////////  
// Styled Components  
//////////////////////////  

const Container = styled.div`  
  border: 1px solid #ddd;  
  padding: 16px;  
  border-radius: 8px;  
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);  
  margin: 16px 0;  
`;  

const QuestionTitle = styled.h2`  
  font-size: 1.2rem;   
  margin-bottom: 12px;  
`;  

const MainQuestion = styled.h2`  
  font-size: 1.2rem;  
  margin-bottom: 12px;  
`;  

const SubQuestion = styled.h3`  
  font-size: 1rem;  
  margin: 8px 0;  
`;  

const OptionsList = styled.ul`  
  list-style: none;  
  padding: 0;  
`;  

interface OptionItemProps {  
  selected: boolean;  
}  

const OptionItem = styled.li<OptionItemProps>`  
  padding: 8px;  
  margin: 4px 0;  
  border: 1px solid ${props => (props.selected ? '#1890ff' : '#ccc')};  
  border-radius: 4px;   
  cursor: pointer;  
  &:hover {  
    border: dashed ${props => (props.selected ? '#1890ff' : '#ccc')};
  }  
  transition: all;
`;  

const SubmitButton = styled.button`  
  padding: 8px 16px;  
  background: #1890ff;  
  color: #fff;  
  border: none;  
  border-radius: 4px;  
  cursor: pointer;  
  margin-top: 16px;  
`;  

const Result = styled.div`  
  margin-top: 16px;  
  font-weight: bold;  
  color: ${props => (props.children === '正确' ? 'green' : 'red')};  
`;  

//////////////////////////  
// QuizComponent  
//////////////////////////  

// 定义组件属性  
interface QuizComponentProps {  
  quiz: quizType; // 实际项目中可以替换为 quizType  
  appendLink:()=>Promise<null|string>
}  

export interface QuizImperativeHandle {  
    getCurrentState: () => any;  
}  

const QuizComponent = forwardRef<QuizImperativeHandle, QuizComponentProps>(({ quiz,appendLink }, ref) => {  
  // submitted：是否提交过答案  
  // selected：记录选项的选中情况  
  // 对于单选类型（A1、A2）：selected 为 string（oid）；  
  // 对于多选题型（X）：selected 为 oid[] ；  
  // 对于带子题的题型（A3、B）：selected 为一个对象，key 为子题ID  
  const [submitted, setSubmitted] = useState(false);  
  const [selected, setSelected] = useState<any>(  
    quiz.type === 'X' ? [] : (quiz.type === 'A3' || quiz.type === 'B' ? {} : '')  
  );  

  //////////////////////////  
  // 选项点击处理函数  
  //////////////////////////  
  const handleOptionSelect = (oid: string, questionKey?: number) => {  
    if (submitted) return;  
    if (quiz.type === 'A1' || quiz.type === 'A2') {  
      setSelected(oid);  
    } else if (quiz.type === 'X') {  
      // 多选题  
      if (Array.isArray(selected)) {  
        if (selected.includes(oid)) {  
          setSelected(selected.filter((item: string) => item !== oid));  
        } else {  
          setSelected([...selected, oid]);  
        }  
      }  
    } else if (quiz.type === 'A3' || quiz.type === 'B') {  
      // 针对子题或拆分题，如 A3 或 B，questionKey 表示子题id  
      setSelected({ ...selected, [questionKey as number]: oid });  
    }  
  };  

  //////////////////////////  
  // 提交答案处理函数  
  //////////////////////////  
  const handleSubmit = () => {  
    setSubmitted(true);  
    pushRecord()
  };  

  //////////////////////////  
  // 答案判断逻辑  
  //////////////////////////  
  let isCorrect = false;  
  if (submitted) {  
    switch (quiz.type) {  
      case 'A1':  
      case 'A2':  
        isCorrect = selected === quiz.answer;  
        break;  
      case 'X':  
        if (Array.isArray(selected)) {  
          // 排序后比较数组内容  
          isCorrect =  
            JSON.stringify(selected.sort()) ===  
            JSON.stringify(quiz.answer.sort());  
        }  
        break;  
      case 'A3':  
        // 对于 A3，遍历每个子题  
        isCorrect = quiz.subQuizs.every(  
          (sub: any) => selected[sub.subQuizId] === sub.answer  
        );  
        break;  
      case 'B':  
        isCorrect = quiz.questions.every(  
          (q: any) => selected[q.questionId] === q.answer  
        );  
        break;  
      default:  
        break;  
    }  
  }  

  // 对外暴露的试题状态  
  const quizState = {  
    submitted,  
    isCorrect,  
    selectedOptions: selected,  
  };    

    // 使用 useImperativeHandle 将 getCurrentState 方法暴露给父组件调用  
    useImperativeHandle(ref, () => ({  
        getCurrentState: () => quizState,  
    }), [submitted, selected]);  
          
    const API_URL = 'http://localhost:3000/api';  

  const appendNewLink = () => {

    appendLink()
      .then(async(value)=>{
        if(value){
          //get past link
          
          const plresponse = await request({url:`${API_URL}/obcors/updatelink/${quiz._id}`,method:'GET'})
          const res = JSON.parse(plresponse)
          console.log(res)
          if(res.success){
            const newLinks = res.links
            newLinks.push(value)
            console.log(newLinks)
            await request({  
              url:`${API_URL}/obcors/updatelink/${quiz._id}`,  
              contentType: "application/x-www-form-urlencoded",
              body: JSON.stringify({ link: newLinks }),
              method: "POST",
              headers: {  
                  'Content-Type': 'application/json',  
              },  
              }  
            ); 
          }


        }else{

        }
      })
  }

  const userid = "wjixiang"

  const pushRecord = async() => {
    await request({  
      url:`${API_URL}/obcors/addrecord/${userid}`,  
      contentType: "application/x-www-form-urlencoded",
      body: JSON.stringify({ link: quiz._id, selectrecord: selected, correct: isCorrect  }),
      method: "POST",
      headers: {  
          'Content-Type': 'application/json',  
      },  
      }  
    ); 
  }

  //////////////////////////  
  // 渲染不同类型试题代码  
  //////////////////////////  
  const renderQuizContent = () => {  
    if (quiz.type === 'A1' || quiz.type === 'A2' || quiz.type === 'X') {  
      return (  
        <>  
          <QuestionTitle>{quiz.question}</QuestionTitle>  
          <OptionsList>  
            {quiz.options.map((item: any) => {  
              // 判断选中状态：单选与多选处理不同  
              let isSelected =  
                quiz.type === 'X'  
                  ? Array.isArray(selected) && selected.includes(item.oid)  
                  : selected === item.oid;  
              return (  
                <OptionItem  
                  key={item.oid}  
                  selected={isSelected}  
                  onClick={() => handleOptionSelect(item.oid)}  
                >  
                  {item.oid}. {item.text}  
                </OptionItem>  
              );  
            })}  
          </OptionsList>  
        </>  
      );  
    } 
    // else if (quiz.type === 'A3') {  
    //   return (  
    //     <>  
    //       <MainQuestion>{quiz.mainQuestion}</MainQuestion>  
    //       {quiz.subQuizs.map((sub: any) => (  
    //         <div key={sub.subQuizId}>  
    //           <SubQuestion>{sub.question}</SubQuestion>  
    //           <OptionsList>  
    //             {quiz.options.map((item: any) => {  
    //               const isSelected = selected[sub.subQuizId] === item.oid;  
    //               return (  
    //                 <OptionItem  
    //                   key={item.oid}  
    //                   selected={isSelected}  
    //                   onClick={() => handleOptionSelect(item.oid, sub.subQuizId)}  
    //                 >  
    //                   {item.oid}. {item.text}  
    //                 </OptionItem>  
    //               );  
    //             })}  
    //           </OptionsList>  
    //         </div>  
    //       ))}  
    //     </>  
    //   );  
    // } 
    else if (quiz.type === 'B') {  
      return (  
        <>  
          {quiz.questions.map((q: any) => (  
            <div key={q.questionId}>  
              <SubQuestion>{q.questionText}</SubQuestion>  
              <OptionsList>  
                {quiz.options.map((item: any) => {  
                  const isSelected = selected[q.questionId] === item.oid;  
                  return (  
                    <OptionItem  
                      key={item.oid}  
                      selected={isSelected}  
                      onClick={() => handleOptionSelect(item.oid, q.questionId)}  
                    >  
                      {item.oid}. {item.text}  
                    </OptionItem>  
                  );  
                })}  
              </OptionsList>  
            </div>  
          ))}  
        </>  
      );  
    }  
    return null;  
  };  

  return (  
    <Container>  
      {renderQuizContent()}  
      {!submitted && (  
        <SubmitButton onClick={handleSubmit}>提交答案</SubmitButton>  
      )}  
      {submitted && (  
        <Result>{isCorrect ? '正确' : '错误'}</Result>  
      )}  
      <button onClick={appendNewLink}>
        <CirclePlus/>
      </button>
    </Container>  
  );  
})

export default QuizComponent;