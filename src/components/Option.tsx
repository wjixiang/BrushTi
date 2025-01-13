import * as React from "react";  
import styled from "styled-components";  
import { Check, X } from "lucide-react"; 


export interface OptionState {
    isSelected: boolean; 
    isSubmitted: boolean;
    isCorrect: boolean;
}

export interface OptionProps {  
    id: number;  
    content: string;  
    select: (id:number)=>void;
    submit: (id:number)=>void;
    state: OptionState;
}  

const Option: React.FC<OptionProps> = (props) => {  
    const defaultState: OptionState = {  
        isSelected: false,  
        isSubmitted: false,  
        isCorrect: false  
    };  

    const state = props.state || defaultState;  


    const handleClick = () => {  
        props.select(props.id)
    };  


    const doubleClickSubmit = () => {
        props.submit(props.id)
    }
    switch (state.isSubmitted) {
        case false:
            return (  
                <OptionBox  
                    $isSelected={state.isSelected}  
                    $status={state.isCorrect}  
                    onClick={handleClick}
                    onDoubleClick={doubleClickSubmit}
                >  
                    <div>  
                        {props.content}  
                    </div>  
                </OptionBox>  
            );  
        case true:
            switch (props.state.isCorrect) {  
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
                                    {state.isSelected ? <X color="#FF4D4F" size={20} />  : <></>}
                                </IconWrapper>  
                            </ContentWrapper>  
                        </OptWrong>  
                    );  
                default:  
                    return null;  
            }  
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