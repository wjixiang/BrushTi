import * as React from "react";  
import { useState } from "react";  
import styled from "styled-components";  
import { Check, X } from "lucide-react"; // 导入 Check 和 X 图标  

interface OptionProps {  
    id: number;  
    content: string;  
    isSelected: boolean;  
    status: "correct" | "wrong" | "unknown"  
    onSelect?: (id: number) => void;  
}  

const Option: React.FC<OptionProps> = (props) => {  
    const handleClick = () => {  
        if (props.onSelect) {  
            props.onSelect(props.id);  
        }  
    };  

    switch (props.status) {  
        case "unknown":  
            return (  
                <OptionBox  
                    $isSelected={props.isSelected}  
                    $status={props.status}  
                    onClick={handleClick}  
                >  
                    <div>  
                        {props.content}  
                    </div>  
                </OptionBox>  
            );  
        case "correct":  
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
        case "wrong":  
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

// 新增内容：用于布局内容和图标的容器  
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
    $status: "correct" | "wrong" | "unknown"  
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