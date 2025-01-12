import * as React from "react"  
import styled from "styled-components"  
import Quiz, { quizData } from "./Quiz"  
import { useState, useMemo, useRef } from "react"  
import QuizPreview from "./QuizPreview"  
import { FaArrowLeft } from 'react-icons/fa'  

interface PageProps {  
    quizSet: quizData[]  
}  

const Page:React.FC<PageProps> = (props) => {  
    const [currentPage, setCurrentPage] = useState("grid-view")  
    const [currentQuizName, setCurrentQuizName] = useState<string>(props.quizSet[0].name)  

    // 使用 useRef 存储 Quiz 组件的状态  
    const quizStatesRef = useRef<{[key: string]: any}>({})  

    // 创建一个函数来更新特定 Quiz 的状态  
    const updateQuizState = (quizName: string, newState: any) => {  
        quizStatesRef.current[quizName] = {  
            ...quizStatesRef.current[quizName],  
            ...newState  
        }  
    }  

    // 将所有 Quiz 组件预先渲染  
    const renderedQuizzes = useMemo(() => {  
        return props.quizSet.map((quiz, index) => {  
            // 获取或初始化该 Quiz 的状态  
            const quizState = quizStatesRef.current[quiz.name] || {}  

            return (  
                <div   
                    key={index}   
                    style={{   
                        display: currentQuizName === quiz.name && currentPage === "quiz-view" ? 'block' : 'none'   
                    }}  
                >  
                    <Quiz   
                        qdata={quiz}   
                        status={"todo"}   
                        // 传递当前状态  
                        initialState={quizState}  
                        // 提供状态更新回调  
                        onStateChange={(newState) => updateQuizState(quiz.name, newState)}  
                    />  
                </div>  
            )  
        })  
    }, [props.quizSet, currentQuizName, currentPage])  

    const gridToQuiz = (quizName:string)=>{  
        setCurrentQuizName(quizName)  
        setCurrentPage("quiz-view")  
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