import * as React from "react"  
import styled from "styled-components"  
import Quiz, { quizData } from "./Quiz"  
import { useState, useMemo, useRef } from "react"  
import QuizPreview from "./QuizPreview"  
import { FaArrowLeft } from 'react-icons/fa'  
import { QuizState } from "./Quiz"
import { OptionState } from "./Option"

interface PageProps {  
    quizSet: quizData[]  
}  

const defaultQuiz:quizData = {
    name: "",
    cls: "",
    unit: "",
    mode: "",
    test: "",
    option: [],
    answer: "",
    point: "",
    discuss: ""
}

const Page:React.FC<PageProps> = (props) => {  
    const [currentPage, setCurrentPage] = useState("grid-view")  
    const [currentQuizName, setCurrentQuizName] = useState<string>(props.quizSet[0].name)  
    const [currentQuiz,setCurrentQuiz] = useState<quizData>(defaultQuiz)
    // 使用初始化函数来设置 quizStates  
    const [quizStates, setQuizStates] = useState<{[key: string]: QuizState}>(() => {  
        const initialStates: {[key: string]: QuizState} = {};  
        props.quizSet.forEach(quiz => { 
            const initOptState: {[key:number]: OptionState} = {}
            quiz.option.forEach((value:string,index:number)=>{
                initOptState[index] =  {
                            isCorrect:false,
                            isSelected:false,
                            isSubmitted:false,
                        }
                    }) 
            initialStates[quiz.name] = {  
                qaState: {
                    status: "todo",
                    optionStates: initOptState,
                },  
            };  
        });  
        return initialStates;  
    });  

    const updateQuizStates = (name:string,newState:QuizState) => {
        // console.log(`change quiz state:${name}`,newState)

        setQuizStates(quizStates=>({
            ...quizStates,
            [name]: newState
        }))

    }

    React.useEffect(()=>{
        const quiz = props.quizSet.find(quiz=>quiz.name === currentQuizName)
        if(quiz) setCurrentQuiz(quiz)
    },[currentQuizName])
    
    const renderedQuizzes = useMemo(() => {  
        return props.quizSet.map((quiz) => (  
            <div  
                key={quiz.name}  
                style={{  
                    display: currentQuizName === quiz.name && currentPage === "quiz-view" ? 'block' : 'none'  
                }}  
            >  
                <Quiz  
                    qdata={quiz}  
                    state={quizStates[quiz.name]}  
                    onStateChange={updateQuizStates}
                />  
            </div>  
        ));  
    }, [currentQuizName,quizStates]);  


    const gridToQuiz = (quizName:string)=>{  
        setCurrentQuizName(quizName)  
        setCurrentPage("quiz-view")  
        console.log(quizName,quizStates[quizName])
    }  

    const backToGridView = () => {  
        setCurrentPage("grid-view")  
    }  

    switch(currentPage){  
        case "grid-view":  
            return (  
                <GridContainer>  
                    {props.quizSet.map((quiz, index) => (  
                        <GridItem key={index}>  
                            <QuizPreview   
                                id={index}   
                                name={quiz.name}   
                                status={"todo"}   
                                redirect={gridToQuiz}  
                            />  
                        </GridItem>  
                    ))}  
                </GridContainer>  
            )  
        case "quiz-view":  
            return (  
                <>  
                    <TopBar>  
                        <BackButton onClick={backToGridView}>  
                            <FaArrowLeft />  
                        </BackButton>  
                        <QuizTitle>{currentQuizName}</QuizTitle>  
                    </TopBar>  
                    {renderedQuizzes}
                    {/* <Quiz  
                        qdata={currentQuiz}  
                        state={quizStates[currentQuiz.name]}  
                        onStateChange={updateQuizStates}
                />   */}
                </>  
            )  
        default:  
            return null  
    }  
}  

const TopBar = styled.div`  
    display: flex;  
    align-items: center;  
    padding: 10px 15px;  
    background-color: #f5f5f5;  
    position: sticky;  
    top: 0;  
    z-index: 100;  
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);  
`  

const BackButton = styled.div`  
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

// 网格容器  
const GridContainer = styled.div`  
    display: grid;  
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));   
    gap: 10px;   
    width: 100%;  
    max-width: 1200px;   
    margin: 0 auto;   
`  

// 网格项目  
const GridItem = styled.div`  
    display: flex;  
    justify-content: center;  
    align-items: center;  
`  

export default Page