import * as React from "react";
import SingleSelectQa from "./QA/SingleSelect";
import styled from "styled-components";  
import { useState } from "react";
import { useEffect } from "react";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';  
import { QAState } from './QA/SingleSelect';
import { OptionState } from "./Option";

const QAType = {
    "A1": SingleSelectQa,//单选题
    //多选题
}

export interface quizData {
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

export interface QuizState {  
    isPointOpen?: boolean;  
    isDiscussOpen?: boolean;  
    selectedAnswers?: [];
    qaState: QAState;
}  

interface QuizProps {
    qdata: quizData;
    noticeFn?:(notice:string)=>void;
    state: QuizState;
    onStateChange?: (name:string,newState: QuizState) => void; 
}

const Quiz: React.FC<QuizProps> = (props) => {  
    // 使用传入的状态或默认值初始化  
    // console.log(props.state)
    // const [quizState, setQuizState] = useState<QuizState>(() => ({  
    //     isPointOpen: props.state.isPointOpen ?? true,  
    //     isDiscussOpen: props.state.isDiscussOpen ?? true,  
    //     selectedAnswers: [], 
    //     qaState: {
    //         status: props.state.qaState.status,
    //         optionStates: props.state.qaState.optionStates,
    //     }
    // }));  

    const [quizState, setQuizState] = useState<QuizState>(() => {  
        // 创建默认的 optionStates  
        const defaultOptionStates: {[key: number]: OptionState} = {};  
        props.qdata.option.forEach((_, index) => {  
            defaultOptionStates[index] = {  
                isCorrect: false,  
                isSelected: false,  
                isSubmitted: false,  
            };  
        });  

        return {  
            isPointOpen: props.state.isPointOpen ?? true,  
            isDiscussOpen: props.state.isDiscussOpen ?? true,  
            selectedAnswers: [],   
            qaState: {  
                status: props.state.qaState.status,  
                optionStates: props.state.qaState.optionStates || defaultOptionStates,  
            }  
        };  
    }); 

    // 当本地状态改变时，通知父组件  
    useEffect(() => {  
        if (props.onStateChange) {  
            props.onStateChange(props.qdata.name,quizState);  
        }  
    }, [quizState]); // 添加正确的依赖项  
  

    // 状态更新函数  
    const updateState = (updates: Partial<QuizState>) => {  
        setQuizState(prev => ({  
            ...prev,  
            ...updates  
        }));  
    };  

    const changeStatus = (newQAState: QAState) => {  
        console.log("input state",newQAState)
        setQuizState(prev => {
            const NewState = {
                ...prev,
                qaState: newQAState
            }
            props.onStateChange?.(props.qdata.name,quizState)
            console.log(NewState)
            return NewState
        })
        
    };  

    return <>  
        <Info>  
            {props.qdata.mode}  
            {props.qdata.cls}  
        </Info>  
        {(()=>{  
            switch(props.qdata.mode){  
                case "A1":  
                    return <SingleSelectQa   
                        qdata={props.qdata}   
                        state={quizState.qaState}  
                        noticeFn={props.noticeFn}   
                        onSubmitted={changeStatus}
                    />  
            }  
        })()}  

        {quizState.qaState.status !== "todo" && props.qdata.point && (  
            <ExpandableSection>  
                <SectionHeader   
                    onClick={() => updateState({   
                        isPointOpen: !quizState.isPointOpen   
                    })}  
                >  
                    <h3>知识要点</h3>  
                    {quizState.isPointOpen ? <FaChevronUp /> : <FaChevronDown />}  
                </SectionHeader>  
                <PointContent $isOpen={quizState.isPointOpen}>  
                    {props.qdata.point}  
                </PointContent>  
            </ExpandableSection>  
        )}  

        {quizState.qaState.status !== "todo" && props.qdata.discuss && (  
            <ExpandableSection>  
                <SectionHeader   
                    onClick={() => updateState({   
                        isDiscussOpen: !quizState.isDiscussOpen   
                    })}  
                >  
                    <h3>解析</h3>  
                    {quizState.isDiscussOpen ? <FaChevronUp /> : <FaChevronDown />}  
                </SectionHeader>  
                <DiscussContent $isOpen={quizState.isDiscussOpen}>  
                    {props.qdata.discuss}  
                </DiscussContent>  
            </ExpandableSection>  
        )}  
    </>  
} 

export default Quiz  

const Info = styled.div`  
    color: grey;  
    margin-bottom: 10px;  
`  

const ExpandableSection = styled.div`  
    background-color: #f9f9f9;  
    border-radius: 8px;  
    margin: 10px 0;  
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);  
`  

const SectionHeader = styled.div`  
    display: flex;  
    justify-content: space-between;  
    align-items: center;  
    padding: 10px 15px;  
    cursor: pointer;  
    background-color: #f0f0f0;  
    border-radius: 8px 8px 0 0;  

    h3 {  
        margin: 0;  
        color: #333;  
        font-size: 16px;  
    }  

    svg {  
        color: #666;  
    }  

    &:hover {  
        background-color: #e9e9e9;  
    }  
`  

const ContentBase = styled.div<{ $isOpen: boolean }>`  
    max-height: ${props => props.$isOpen ? '1000px' : '0'};  
    overflow: hidden;  
    transition: max-height 0.3s ease-in-out, padding 0.3s ease-in-out;  
    padding: ${props => props.$isOpen ? '10px 15px' : '0 15px'};  
    background-color: #fff;  
    color: #555;  
`  

const PointContent = styled(ContentBase)`  
    border-top: 1px solid #e9e9e9;  
`  

const DiscussContent = styled(ContentBase)`  
    border-top: 1px solid #e9e9e9; 
`

