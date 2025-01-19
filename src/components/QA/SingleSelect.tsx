import { useState, useEffect } from "react";  
import styled from "styled-components";  
import Option from "../Option"  
import * as React from "react";  
import { quizData } from "../Quiz";
import { OptionState } from "../Option";

export interface QAState {
    status: "todo"|"correct"|"wrong";
    optionStates: {[key: number]: OptionState};
}

export interface SingleSelectQAProps {  
    qdata: quizData;  
    state: QAState; 
    // setStatus?: (status:"todo"|"correct"|"wrong")=>void; // 可选的状态更新回调  
    noticeFn?:(notice:string)=>void;
    onSubmitted?:(newState: QAState)=>void;

}  

const SingleSelectQa: React.FC<SingleSelectQAProps> = (props) => {  
    // 本地状态管理  
    const [localStatus, setLocalStatus] = useState<"todo"|"correct"|"wrong">(props.state.status)  
    const [isSubmitted, setIsSubmitted] = useState(false)  
    const answerDict = ["A","B","C","D","E"]  
    // const [optionStates,setOptionStates] = useState<{[key:number]: OptionState}>(()=>{
    //     const initialOptStates:{[key:number]:OptionState} = {}
    //     props.qdata.option.forEach((value:string,index:number)=>{
    //         initialOptStates[index] =  {
    //             isCorrect:false,
    //             isSelected:false,
    //             isSubmitted:false,
    //         }
    //     })
    //     return initialOptStates
    // })

    const [optionStates, setOptionStates] = useState<{[key:number]: OptionState}>(() => {  
        // 如果有传入的状态，优先使用传入的状态  
        if (props.state.optionStates && Object.keys(props.state.optionStates).length > 0) {  
            return props.state.optionStates;  
        }  
        
        // 否则创建新的初始状态  
        const initialOptStates: {[key:number]: OptionState} = {};  
        props.qdata.option.forEach((value: string, index: number) => {  
            initialOptStates[index] = {  
                isCorrect: false,  
                isSelected: false,  
                isSubmitted: false,  
            };  
        });  
        return initialOptStates;  
    });

    // 选择选项  
    const selector = (id:number)=>{  
        
        setOptionStates(preState=>{
            const updatedStates:{[key:number]:OptionState} = {}
            props.qdata.option.forEach((value:string,index:number)=>{
                updatedStates[index] =  {
                    ...preState[index],
                    isSelected:index===id ? true : false,
                }
            })
            return updatedStates
        })
    }  

    // 提交答案  
    const submit = (id:number|null)=>{  
        if (id !== null) {  
            // 判断是否正确  
            const isCorrect = answerDict[id] === props.qdata.answer  
            setLocalStatus(isCorrect ? "correct":"wrong")
            if(isCorrect){
                setOptionStates(() => {
                    const newOptStates: {[key:number]: OptionState} = {};  
                    props.qdata.option.forEach((value: string, index: number) => {  
                        if(index===id){
                            newOptStates[index] = {  
                                isCorrect: true,  
                                isSelected: true,  
                                isSubmitted: true,  
                            }; 
                        }else{
                            newOptStates[index] = {  
                                isCorrect: false,  
                                isSelected: false,  
                                isSubmitted: true,  
                            };  
                        }
                    });  
                    props.onSubmitted?.({
                        status: isCorrect ? "correct":"wrong",
                        optionStates: newOptStates
                    })
                    return newOptStates
                })
            }else{
                setOptionStates(() => {
                    const newOptStates: {[key:number]: OptionState} = {};  
                    props.qdata.option.forEach((value: string, index: number) => {  
                        if(index===id){
                            newOptStates[index] = {  
                                isCorrect: false,  
                                isSelected: true,  
                                isSubmitted: true,  
                            }; 
                        }else if(answerDict[index]===props.qdata.answer){
                            newOptStates[index] = {  
                                isCorrect: true,  
                                isSelected: false,  
                                isSubmitted: true,  
                            };
                        }else{
                            newOptStates[index] = {  
                                isCorrect: false,  
                                isSelected: false,  
                                isSubmitted: true,  
                            };  
                        }
                    });  
                    props.onSubmitted?.({
                        status: isCorrect ? "correct":"wrong",
                        optionStates: newOptStates
                    })
                    return newOptStates
                })
            }
   
        } else {  
            // 未选择任何选项  
            console.log("empty selection")  
            // props.noticeFn?.("请选择一个答案")  
        }  
    }  

    useEffect(() => {  
        // 如果父组件传入了初始状态，同步到本地状态  
        setLocalStatus(props.state.status)  
        
    }, [props.state.status])  

    return (  
        <QuizBox $status={localStatus === "correct" ? true : localStatus === "wrong" ? false : null}>  
            <div>{props.qdata.test}</div>  
            <div>  
                {props.qdata.option.map((opt, index) => (  
                    <Option   
                        key={index}   
                        id={index}   
                        content={opt}   
                        select={selector}  
                        submit={submit}  
                        state={optionStates[index]}
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
