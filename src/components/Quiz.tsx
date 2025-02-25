import  { useImperativeHandle, useState, forwardRef } from 'react';  
import { quizType } from 'src/types/quizData.types';
import styled from 'styled-components';  
import * as React from 'react'
import { CirclePlus } from 'lucide-react';
import { FaArrowLeft } from 'react-icons/fa';
import { FaArrowRight } from 'react-icons/fa';
import { Grid } from 'lucide-react';
import { LinkBox } from './LinkBox';
//////////////////////////  
// Styled Components  
//////////////////////////  

const Container = styled.div`  
  border: 1px solid #ddd;  
  padding: 16px;  
  border-radius: 8px;  
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);  
  margin: 16px 0;  
  max-width: 800px;
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
  submitted: boolean;
  correct: boolean;
}  


const OptionItem = styled.li<OptionItemProps>`  
  padding: 8px;  
  margin: 4px 0;  
  border: 1px solid ${props =>{
    if(props.selected){
      if(props.submitted){
        return props.correct  ? '#4FDC62' : '#FF0133'
      }else{
        return '#1890ff'
      }
    }else{
      if(props.submitted){
        return props.correct ? '#FBFF40' : '#ccc'
      }else{
        return '#ccc'
      }
    }} };  
  border-radius: 4px;   
  cursor: pointer;  
  &:hover {  
    border: dashed ${props => (props.selected ? '#1890ff' : '#ccc')};
  }  
  transition: all;
`;  

const SubmitButton = styled.button`  
  padding: 8px 16px;   
  border: none;  
  border-radius: 4px solid #ccc;  
  cursor: pointer;  
`;  

const Result = styled.div`  
  margin-top: 16px;  
  font-weight: bold;  
  color: ${props => (props.children === '正确' ? 'green' : 'red')};  
`;  

const AnswerSection = styled.div`  
  margin-top: 20px;  
  padding: 15px;  
  background-color: #f5f5f5;  
  border-radius: 8px;  
`;  

const AnswerTitle = styled.h3`  
  color: #333;  
  margin-bottom: 10px;  
`;  

const AnalysisText = styled.p`  
  color: #666;  
  margin: 10px 0;  
`;  

const LinksList = styled.ul`  
  list-style: none;  
  padding: 0;  
`;  

const LinkItem = styled.li`  
  margin: 5px 0;  
  a {  
    color: #1890ff;  
    text-decoration: none;  
    &:hover {  
      text-decoration: underline;  
    }  
  }  
`;  

const TopBar = styled.div`  
    display: flex;  
    align-items: center;  
    justify-content: space-between; // 在元素之间添加相等的间距  
    padding: 3px 3px;  
    /* position: sticky;   */
    top: 0;  
    z-index: 100;  
    width: 100%; // 确保容器占满父元素宽度  
`  

const ToolButton = styled.div`  
    cursor: pointer;  
    display: flex;  
    align-items: center;  
    justify-content: center;  
    width: 40px;  
    height: 40px;  
    border-radius: 50%;  
    transition: background-color 0.3s ease;  

    &:hover {  
        background-color: rgba(0,0,0,0.1);  
    }  
`  

const QuizTitle = styled.div`  
    margin-left: 15px;  
    font-size: 18px;  
    font-weight: 600;  
`  


//////////////////////////  
// QuizComponent  
//////////////////////////  

// 定义组件属性  
interface QuizComponentProps {  
  quiz: quizType; // 实际项目中可以替换为 quizType  
  handleBackToGrid:()=>void;
  appendLink:()=>Promise<null|string>
  currentQuizIndex: number;
  back:()=>void;
  forward: ()=>void;
  apiReqest: {
    POST: (requestURL:string, reqestData: object)=>Promise<string>;
    GET: (url:string)=>Promise<string>
  };
  retriveFileName: (fileId: string)=>string|null;
  redirect: (fileId: string)=>void;
}  

export interface QuizImperativeHandle {  
    getCurrentState: () => {
      submitted: boolean,  
      isCorrect: boolean,  
      selectedOptions: string
    };
}  

const QuizComponent = forwardRef<QuizImperativeHandle, QuizComponentProps>(({ quiz, appendLink, handleBackToGrid, currentQuizIndex, back, forward, apiReqest, redirect, retriveFileName }, ref) => {  
  // submitted：是否提交过答案  
  // selected：记录选项的选中情况  
  // 对于单选类型（A1、A2）：selected 为 string（oid）；  
  // 对于多选题型（X）：selected 为 oid[] ；  
  // 对于带子题的题型（A3、B）：selected 为一个对象，key 为子题ID  
  const [submitted, setSubmitted] = useState(false);  
  const [selected, setSelected] = useState<any>(  
    quiz.type === 'X' ? [] : (quiz.type === 'A3' || quiz.type === 'B' ? {} : '')  
  );  

  React.useEffect(() => {
    setSubmitted(false);
    setSelected(quiz.type === 'X' ? [] : (quiz.type === 'A3' || quiz.type === 'B' ? {} : ''));
}, [quiz]);



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
    fetchLinks()
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
          
          const plresponse = await apiReqest.GET(`${API_URL}/obcors/updatelink/${quiz._id}`)
          console.log(quiz._id)
          const res = JSON.parse(plresponse)

          if(res.success){
            const newLinks = res.links
            console.log(`past link: ${newLinks}`)
            newLinks.push(value)
            setLinks(newLinks)
            console.log(`links after instertion: ${newLinks}`)
            await apiReqest.POST(  
              `${API_URL}/obcors/updatelink/${quiz._id}`,  
              { link: newLinks }
            ); 

            fetchLinks()
          }


        }else{

        }
      })
  }

  const userid = "wjixiang"

  const pushRecord = async() => {
    await apiReqest.POST( 
      `${API_URL}/obcors/addrecord/${userid}`,  
      { quizid: quiz._id, selectrecord: selected, correct: isCorrect  }, 
    ); 
  }

  const renderAnswer = () => {  
    if (!submitted) return null;  
  
    switch (quiz.type) {  
      case 'A1':  
      case 'A2':  
        return (  
          <AnswerSection>  
            <AnswerTitle>正确答案：{quiz.answer}</AnswerTitle>  
            {quiz.analysis.point && (  
              <AnalysisText>要点：{quiz.analysis.point}</AnalysisText>  
            )}  
            {quiz.analysis.discuss && (  
              <AnalysisText>解析：{quiz.analysis.discuss}</AnalysisText>  
            )}  
            {quiz.analysis.link && quiz.analysis.link.length > 0 && (  
              <>  
                <AnswerTitle>相关链接：</AnswerTitle>  
                <LinksList>  
                  {quiz.analysis.link.map((link, index) => (  
                    <LinkItem key={index}>  
                      <a href={link} target="_blank" rel="noopener noreferrer">  
                        参考资料 {index + 1}  
                      </a>  
                    </LinkItem>  
                  ))}  
                </LinksList>  
              </>  
            )}  
          </AnswerSection>  
        );  
  
      case 'X':  
        return (  
          <AnswerSection>  
            <AnswerTitle>  
              正确答案：{quiz.answer.join('、')}  
            </AnswerTitle>  
            {quiz.analysis.point && (  
              <AnalysisText>要点：{quiz.analysis.point}</AnalysisText>  
            )}  
            {quiz.analysis.discuss && (  
              <AnalysisText>解析：{quiz.analysis.discuss}</AnalysisText>  
            )}  
            {quiz.analysis.link && quiz.analysis.link.length > 0 && (  
              <>  
                <AnswerTitle>相关链接：</AnswerTitle>  
                <LinksList>  
                  {quiz.analysis.link.map((link, index) => (  
                    <LinkItem key={index}>  
                      <a href={link} target="_blank" rel="noopener noreferrer">  
                        参考资料 {index + 1}  
                      </a>  
                    </LinkItem>  
                  ))}  
                </LinksList>  
              </>  
            )}  
          </AnswerSection>  
        );  
  
      case 'A3':  
        return (  
          <AnswerSection>  
            {quiz.subQuizs.map((sub, index) => (  
              <div key={sub.subQuizId}>  
                <AnswerTitle>  
                  子题 {index + 1} 正确答案：{sub.answer}  
                </AnswerTitle>  
              </div>  
            ))}  
            {quiz.analysis.point && (  
              <AnalysisText>要点：{quiz.analysis.point}</AnalysisText>  
            )}  
            {quiz.analysis.discuss && (  
              <AnalysisText>解析：{quiz.analysis.discuss}</AnalysisText>  
            )}  
            {quiz.analysis.link && quiz.analysis.link.length > 0 && (  
              <>  
                <LinksList>  
                  {quiz.analysis.link.map((link, index) => (  
                    <LinkItem key={index}>  
                      <a href={link} target="_blank" rel="noopener noreferrer">  
                        参考资料 {index + 1}  
                      </a>  
                    </LinkItem>  
                  ))}  
                </LinksList>  
              </>  
            )}  
          </AnswerSection>  
        );  
  
      case 'B':  
        return (  
          <AnswerSection>  
            {quiz.questions.map((q, index) => (  
              <div key={q.questionId}>  
                <AnswerTitle>  
                  问题 {index + 1} 正确答案：{q.answer}  
                </AnswerTitle>  
              </div>  
            ))}  
            {quiz.analysis.point && (  
              <AnalysisText>要点：{quiz.analysis.point}</AnalysisText>  
            )}  
            {quiz.analysis.discuss && (  
              <AnalysisText>解析：{quiz.analysis.discuss}</AnalysisText>  
            )}  
            {quiz.analysis.link && quiz.analysis.link.length > 0 && (  
              <>  
                <AnswerTitle>相关链接：</AnswerTitle>  
                <LinksList>  
                  {quiz.analysis.link.map((link, index) => (  
                    <LinkItem key={index}>  
                      <a href={link} target="_blank" rel="noopener noreferrer">  
                        参考资料 {index + 1}  
                      </a>  
                    </LinkItem>  
                  ))}  
                </LinksList>  
              </>  
            )}  
          </AnswerSection>  
        );  
  
      default:  
        return null;  
    }  
  }; 


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
                correct={(()=>{
                  if(quiz.type==="X"){ 
                    return quiz.answer.includes(item.oid) ? 'true' : undefined
                  }else{
                    return quiz.answer === item.oid ? 'true' : undefined
                  }
                })()} // 修改为字符串形式
                submitted={submitted}
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
    else if (quiz.type === 'A3') {  
      return (  
        <>  
          <MainQuestion>{quiz.mainQuestion}</MainQuestion>  
          {quiz.subQuizs.map((sub: any) => (  
            <div key={sub.subQuizId}>  
              <SubQuestion>{sub.question}</SubQuestion>  
              <OptionsList>  
                {sub.options.map((item: any) => {  
                  const isSelected = selected[sub.subQuizId] === item.oid;  
                  return (  
                    <OptionItem  
                      key={item.oid}  
                      selected={isSelected}  
                      onClick={() => handleOptionSelect(item.oid, sub.subQuizId)}  
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



  const [links,setLinks] = useState<string[]>([])
  const [isLinkLoading,setIsLinkLoading] = useState<boolean>(false)
  const [connection, setConnection] = useState<{ linkId: string; linkName: string; }[]>([])


  const fetchLinks = async() => {
    setIsLinkLoading(true)
    const plresponse = await apiReqest.GET(`${API_URL}/obcors/updatelink/${quiz._id}`)
    const res = JSON.parse(plresponse)

    if(res.success){
      setLinks(res.links as string[])

      
      const theLinks = res.links as string[]
      const newConnections:{
        linkId: string;
        linkName: string;
      }[] = [] 

      for(const link of theLinks) {
        const linkName = retriveFileName(link)
        if(linkName) {
          newConnections.push({
            linkId: link,
            linkName:linkName
          })
        }
      }

      setConnection(newConnections)
      console.log(newConnections)
    }

    setIsLinkLoading(false)
  }

  React.useEffect(()=>{
    fetchLinks()
  },[])



  return (  
    <Container>  
      <TopBar> 
        <ToolButton onClick={back}>  
            <FaArrowLeft/>
        </ToolButton>   
        <ToolButton onClick={handleBackToGrid}>  
            <Grid />  
        </ToolButton>  
        <QuizTitle>  
            Quiz {currentQuizIndex + 1}  
        </QuizTitle>  
          
        <QuizTitle>  
          {quiz.type}型题
        </QuizTitle>  

        <ToolButton onClick={forward}>  
            <FaArrowRight/>
        </ToolButton>  
      </TopBar>  
    {renderQuizContent()}  
    <TopBar>
      <ToolButton onClick={appendNewLink}>  
        <CirclePlus/>  
      </ToolButton>  

      {!submitted && (  
      <SubmitButton onClick={handleSubmit}>提交答案</SubmitButton>  
    )}  
    </TopBar>
    

    {submitted && (  
      <>  
        <Result>{isCorrect ? '正确' : '错误'}</Result>  
        <div>
          <LinkBox isloading={isLinkLoading} links={connection} redirect={redirect}/>
        </div>
        {renderAnswer()}
      </>  
    )}  
  </Container>
  );  
})



export default QuizComponent;