import * as React from "react"  
import { useState, useRef, useEffect } from "react"  
import styled from "styled-components"  
import Quiz, { QuizImperativeHandle } from "./Quiz"  
import QuizPreview from "./QuizPreview"  
import { FaArrowLeft } from 'react-icons/fa'  
import { quizType } from "src/types/quizData.types"  

interface PageProps {  
    quizSet: quizType[];
    appendLink: ()=>Promise<null|string>;
}  

const Page: React.FC<PageProps> = (props) => {  
    const [currentPage, setCurrentPage] = useState<"grid-view" | "quiz-view">("grid-view")  
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0)  
    
    // 正确的 refs 类型定义  
    const quizRefs = useRef<Array<React.RefObject<QuizImperativeHandle>>>([])  

    // 初始化 refs  
    useEffect(() => {  
        quizRefs.current = Array(props.quizSet.length)  
            .fill(null)  
            .map(() => React.createRef<QuizImperativeHandle>())  
    }, [props.quizSet.length])  

    // 切换到具体题目视图  
    const handleQuizSelect = (index: number) => {  
        setCurrentQuizIndex(index)  
        setCurrentPage("quiz-view")  
    }  

    // 返回网格视图  
    const handleBackToGrid = () => {  
        setCurrentPage("grid-view")  
        // 可以在这里调用当前 Quiz 的保存或重置方法  
        const currentRef = quizRefs.current[currentQuizIndex]  
        if (currentRef.current) {  
            // currentRef.current.saveState?.()  
        }  
    }  

    return (  
        <PageContainer>  
            {/* 网格视图 */}  
            <div style={{ display: currentPage === "grid-view" ? "block" : "none" }}>  
                <GridContainer>  
                    {props.quizSet.map((quiz, index) => (  
                        <GridItem key={index}>  
                            <QuizPreview  
                                id={index}  
                                name={`Quiz ${index + 1}`}  
                                status="todo"  
                                redirect={() => handleQuizSelect(index)}  
                            />  
                        </GridItem>  
                    ))}  
                </GridContainer>  
            </div>  

            {/* Quiz 视图 */}  
            <div style={{ display: currentPage === "quiz-view" ? "block" : "none" }}>  
                <TopBar>  
                    <BackButton onClick={handleBackToGrid}>  
                        <FaArrowLeft />  
                    </BackButton>  
                    <QuizTitle>  
                        Quiz {currentQuizIndex + 1}  
                    </QuizTitle>  
                </TopBar>  
                
                {/* Quiz 组件容器 */}  
                <QuizContainer>  
                    {props.quizSet.map((quiz, index) => (  
                        <div   
                            key={index}  
                            style={{   
                                display: index === currentQuizIndex ? "block" : "none",  
                                height: "100%"  
                            }}  
                        >  
                            <Quiz  
                                quiz={quiz}  
                                ref={quizRefs.current[index]}  
                                appendLink={props.appendLink}
                            />  
                        </div>  
                    ))}  
                </QuizContainer>  
            </div>  
        </PageContainer>  
    )  
}  

// 样式组件  
const PageContainer = styled.div`  
    width: 100%;  
    height: 100%;  
    overflow: hidden;  
`  

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

const GridContainer = styled.div`  
    display: grid;  
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));  
    gap: 10px;  
    width: 100%;  
    max-width: 1200px;  
    margin: 0 auto;  
    padding: 20px;  
`  

const GridItem = styled.div`  
    display: flex;  
    justify-content: center;  
    align-items: center;  
`  

const QuizContainer = styled.div`  
    height: calc(100vh - 60px); // 减去 TopBar 的高度  
    overflow-y: auto;  
    padding: 20px;  
`  

export default Page