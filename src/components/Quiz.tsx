import * as React from "react";
import SingleSelectQa from "./QA/SingleSelect";
import styled from "styled-components";  
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';  

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

interface QuizProps {
    qdata: quizData;
    status: "todo"|"correct"|"wrong";
    noticeFn?:(notice:string)=>void;
    initialState?: any;  
    onStateChange?: (state: any) => void;  
}

const Quiz: React.FC<QuizProps> = (props) => {  
    const [status, setStatus] = useState(props.status)  
    const [isPointOpen, setIsPointOpen] = useState(false)  
    const [isDiscussOpen, setIsDiscussOpen] = useState(false)  

    const changeStatus = (status: "todo" | "correct" | "wrong") => {  
        setStatus(status)  
        console.log(status)  
    }  
    
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
                                status={status}   
                                noticeFn={props.noticeFn}   
                                setStatus={changeStatus}  
                            />  
            }  
        })()}  

        {status !== "todo" && props.qdata.point && (  
            <ExpandableSection>  
                <SectionHeader onClick={() => setIsPointOpen(!isPointOpen)}>  
                    <h3>知识要点</h3>  
                    {isPointOpen ? <FaChevronUp /> : <FaChevronDown />}  
                </SectionHeader>  
                <PointContent $isOpen={isPointOpen}>  
                    {props.qdata.point}  
                </PointContent>  
            </ExpandableSection>  
        )}  

        {status !== "todo" && props.qdata.discuss && (  
            <ExpandableSection>  
                <SectionHeader onClick={() => setIsDiscussOpen(!isDiscussOpen)}>  
                    <h3>解析</h3>  
                    {isDiscussOpen ? <FaChevronUp /> : <FaChevronDown />}  
                </SectionHeader>  
                <DiscussContent $isOpen={isDiscussOpen}>  
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