import * as React from "react";  
import styled, { keyframes } from "styled-components";  
import { FaCheck, FaTimes } from 'react-icons/fa';  

type status = "todo"|"correct"|"wrong"  

interface QuizPreviewProps {  
    id: number;  
    name: string;
    status: status;  
    redirect?: (name:string)=>void;
}  

const QuizPreview: React.FC<QuizPreviewProps> = (props) => {  
    const renderIcon = () => {  
        switch(props.status) {  
            case "correct":  
                return <CorrectIcon />  
            case "wrong":  
                return <WrongIcon />  
            default:  
                return null  
        }  
    }  

    const gotoQuiz = ()=>{
        props.redirect?.(props.name)
    }

    return (  
        <>
            <Block onClick={gotoQuiz}>
                <PreviewBlock $status={props.status}>  
                    {renderIcon()}  
                </PreviewBlock>
                <div>
                {props.id}
                </div>  
            </Block>
        </>
    )  
}  

export default QuizPreview  

// 闪烁动画  
const pulseAnimation = keyframes`  
    0% {  
        transform: scale(1);  
    }  
    50% {  
        transform: scale(1.1);  
    }  
    100% {  
        transform: scale(1);  
    }  
`  

// 图标样式  
const IconBase = styled.div`  
    display: flex;  
    justify-content: center;  
    align-items: center;  
    width: 100%;  
    height: 100%;  
    animation: ${pulseAnimation} 0.5s ease-in-out;  
`  

const CorrectIcon = styled(FaCheck)`  
    color: white;  
    font-size: 24px;  
`  

const WrongIcon = styled(FaTimes)`  
    color: white;  
    font-size: 24px;  
`  

const PreviewBlock = styled.div<{$status:status}>`  
    width: 50px;  
    height: 50px;  
    border: 2px solid ${props => {  
        switch(props.$status) {  
            case "todo":  
                return "rgba(150,150,150,0.5)";  
            case "correct":  
                return "#42B752";  
            case "wrong":  
                return "#EE222B";  
        }  
    }};  
    border-radius: 10px;  
    background-color: ${props => {  
        switch(props.$status) {  
            case "todo":  
                return "transparent";  
            case "correct":  
                return "#42B752";  
            case "wrong":  
                return "#EE222B";  
        }  
    }};  
    display: flex;  
    justify-content: center;  
    align-items: center;  
    transition: all 0.3s ease;  
    box-shadow: ${props => {  
        switch(props.$status) {  
            case "todo":  
                return "none";  
            case "correct":  
                return "0 4px 6px rgba(66, 183, 82, 0.3)";  
            case "wrong":  
                return "0 4px 6px rgba(238, 34, 43, 0.3)";  
        }  
    }};  
    
    // Hover效果  
    &:hover {  
        ${props => {  
            switch(props.$status) {  
                case "todo":  
                    return `  
                        border-color: rgba(100,100,100,0.8);  
                        transform: scale(1.05);  
                    `;  
                case "correct":  
                    return `  
                        transform: scale(1.05);  
                        box-shadow: 0 6px 8px rgba(66, 183, 82, 0.4);  
                    `;  
                case "wrong":  
                    return `  
                        transform: scale(1.05);  
                        box-shadow: 0 6px 8px rgba(238, 34, 43, 0.4);  
                    `;  
            }  
        }}  
    }  
`

const Block = styled.div`
    display: flex;    
    align-items: center;         
    text-align: center; 
    width: fit-content; 
    flex-direction: column;
`