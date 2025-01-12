import { useState, useEffect } from "react";  
import styled from "styled-components";  
import Option from "../Option"  
import * as React from "react";  
import { quizData } from "../Quiz";

interface SingleSelectQAProps {  
    qdata: quizData;  
    status?: "todo"|"correct"|"wrong"; // 可选的初始状态  
    setStatus?: (status:"todo"|"correct"|"wrong")=>void; // 可选的状态更新回调  
    noticeFn?:(notice:string)=>void  
}  

const SingleSelectQa: React.FC<SingleSelectQAProps> = ({  
    qdata,   
    status: initialStatus = "todo",   
    setStatus: setParentStatus,   
    noticeFn  
}) => {  
    // 本地状态管理  
    const [selectedOption, setSelectedOption] = useState<null|number>(null)  
    const [localStatus, setLocalStatus] = useState<"todo"|"correct"|"wrong">(initialStatus)  
    const [isSubmitted, setIsSubmitted] = useState(false)  
    const answerDict = ["A","B","C","D","E"]  

    // 选择选项  
    const selector = (id:number)=>{  
        // 如果已经提交，不允许再选  
        if (isSubmitted) return  
        setSelectedOption(id)  
    }  

    // 提交答案  
    const submit = (id:number|null)=>{  
        if (id !== null) {  
            // 判断是否正确  
            const isCorrect = answerDict[id] === qdata.answer  
            
            // 更新本地状态  
            setLocalStatus(isCorrect ? "correct" : "wrong")  
            setIsSubmitted(true)  

            // 如果父组件提供了状态更新回调，则调用  
            setParentStatus?.(isCorrect ? "correct" : "wrong")  

            // 如果父组件提供了通知函数，可以额外调用  
            if (!isCorrect && noticeFn) {  
                noticeFn("答案错误")  
            }  
        } else {  
            // 未选择任何选项  
            console.log("empty selection")  
            noticeFn?.("请选择一个答案")  
        }  
    }  

    useEffect(() => {  
        // 如果父组件传入了初始状态，同步到本地状态  
        if (initialStatus) {  
            setLocalStatus(initialStatus)  
        }  
    }, [initialStatus])  

    return (  
        <QuizBox $status={localStatus === "correct" ? true : localStatus === "wrong" ? false : null}>  
            <div>{qdata.test}</div>  
            <div>  
                {qdata.option.map((opt, index) => (  
                    <Option   
                        key={index}   
                        id={index}   
                        content={opt}   
                        isSelected={selectedOption === index}   
                        correctOpt={qdata.answer}   
                        isSubmitted={isSubmitted}   
                        select={selector}  
                        submit={submit}  
                    />  
                ))}  
            </div>  
        </QuizBox>  
    )  
}  

export default SingleSelectQa

const QuizBox = styled.div<{  
    $status: null | boolean  
}>`  
    padding: 10px;
    border-radius: 5px;
    background-color:${props => {  
        switch(props.$status) {  
            case true:  
                return 'rgba(0, 255, 0, 0.1)'; 
            case false:  
                return 'rgba(255, 0, 0, 0.1)';  
            case null:  
            default:  
                return 'rgba(10, 10, 10, 0.01)';  
        }  
    }};
    border: 2px solid ${props => {  
        switch(props.$status) {  
            case true:  
                return 'rgba(56, 184, 129)';  
            case false:  
                return '#ff0000';   
            case null:  
            default:  
                return 'rgba(224, 224, 224)';  
        }  
    }};   
`;
