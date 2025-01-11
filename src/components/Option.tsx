import * as React from "react";  
import styled from "styled-components";  
import { Check, X } from "lucide-react"; 
import { useEffect, useState } from "react";

interface OptionProps {  
    id: number;  
    content: string;  
    isSelected: boolean;  
    isSubmitted: boolean;
    correctOpt: string;
    select: (id:number)=>void
    
}  

const Option: React.FC<OptionProps> = (props) => {  
    const answerDict = ["A","B","C","D","E"]

    const [isCorrect,setIsCorrect] = useState<null|boolean>(null)
    useEffect(() => {  
        // 只在 isSubmitted 为 true 时设置 isCorrect  
        if (props.isSubmitted) {  
            setIsCorrect(props.correctOpt === answerDict[props.id])  
        }  
    }, [props.isSubmitted, props.correctOpt, props.id])  

    const handleClick = () => {  
        console.log(props.id)
        props.select(props.id)
    };  

    switch (isCorrect) {  
        case null:  
            return (  
                <OptionBox  
                    $isSelected={props.isSelected}  
                    $status={isCorrect}  
                    onClick={handleClick}  
                >  
                    <div>  
                        {props.content}  
                    </div>  
                </OptionBox>  
            );  
        case true:  
            return (  
                <OptCorrect>  
                    <ContentWrapper>  
                        <div>{props.content}</div>  
                        <IconWrapper>  
                            <Check color="#38B881" size={20} />  
                        </IconWrapper>  
                    </ContentWrapper>  
                </OptCorrect>  
            );  
        case false:  
            return (  
                <OptWrong>  
                    <ContentWrapper>  
                        <div>{props.content}</div>  
                        <IconWrapper>  
                            <X color="#FF4D4F" size={20} />  
                        </IconWrapper>  
                    </ContentWrapper>  
                </OptWrong>  
            );  
        default:  
            return null;  
    }  
}  

export default Option;  


const ContentWrapper = styled.div`  
    display: flex;  
    justify-content: space-between;  
    align-items: center;  
    width: 100%;  
`;  

const IconWrapper = styled.div`  
    display: flex;  
    align-items: center;  
    justify-content: center;  
`;  

const OptionBox = styled.div<{  
    $isSelected: boolean  
    $status: null | boolean
}>`  
    padding: 10px;  
    margin: 3px;  
    border: 1px solid ${props =>   
        props.$isSelected ? '#007bff' : '#D9D9D9'  
    };  
    border-radius: 10px;  
    background-color: ${props =>   
        props.$isSelected ? '#e6f2ff' : 'transparent'  
    };  
    cursor: pointer;  
    transition: all 0.3s ease;  

    &:hover {  
        background-color: ${props =>   
            props.$isSelected ? '#e6f2ff' : '#F5F5F5'  
        };  
    }  
`;  

const OptCorrect = styled.div`  
    padding: 10px;  
    margin: 3px;  
    border: 1px solid #38B881;  
    background-color: #ADFFCB;  
    border-radius: 10px;  
    cursor: pointer;  
    transition: all 0.3s ease;  
`;  

const OptWrong = styled.div`  
    padding: 10px;  
    margin: 3px;  
    border: 1px solid #FF4D4F;  
    background-color: #FFF1F0;  
    border-radius: 10px;  
    cursor: pointer;  
    transition: all 0.3s ease;  
`;