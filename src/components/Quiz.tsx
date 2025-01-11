import * as React from "react";
import { useState } from "react";
import Option from "./Option";
import styled from "styled-components";  

interface quizData {
    name: string,
    cls: string,
    unit: string,
    mode: string,
    test: string,
    option: string[],
    answer: string,
    point: string,
    discuss: string
  }

interface QuizProps {
    qdata: quizData;
    status: "todo"|"correct"|"wrong";
    setStatus?: (id:number)=>void;
    noticeFn?:(notice:string)=>void
}

const Quiz: React.FC<QuizProps> = (props)=>{
    const [selectedOption,setSelectedOption] = useState<null|number>(null)
    const [status,setStatus] = useState<null|boolean>(null)
    const [isSubmitted,setIsSubmitted] = useState(false)
    const answerDict = ["A","B","C","D","E"]

    const selector = (id:number)=>{
        setSelectedOption(id)
    }

    const submit = (id:number|null)=>{
        if(id!=null){
            setStatus(answerDict[id]===props.qdata.answer)
            setIsSubmitted(true)
        }else{
            console.log("empty selection")
            if(props.noticeFn) props.noticeFn("empty selection")
        }
    }

    return <QuizBox $status={status}>
    <div>
        {props.qdata.test}
    </div>
    <div>
        {props.qdata.option.map((opt,index)=>{
            return (<Option key={index} id={index} content={opt} isSelected={selectedOption===index} correctOpt={props.qdata.answer} isSubmitted={isSubmitted} select={selector}/>)
        })}
    </div>
    <div>
        <button onClick={()=>submit(selectedOption)}>submit</button>
    </div>
    </QuizBox>
}

export default Quiz


const QuizBox = styled.div<{  
    $status: null | boolean  
}>`  
    padding: 10px;
    border-radius: 5px;
    background-color:${props => {  
        switch(props.$status) {  
            case true:  
                return 'rgba(0, 255, 0, 0.1)';  // 绿色，表示正确  
            case false:  
                return 'rgba(255, 0, 0, 0.1)';  // 红色，表示错误  
            case null:  
            default:  
                return 'rgba(10, 10, 10, 0.01)';  // 默认黑色  
        }  
    }};
    border: 2px solid ${props => {  
        switch(props.$status) {  
            case true:  
                return 'rgba(56, 184, 129)';  // 绿色，表示正确  
            case false:  
                return '#ff0000';  // 红色，表示错误  
            case null:  
            default:  
                return 'rgba(224, 224, 224)';  // 默认黑色  
        }  
    }};   
`;

