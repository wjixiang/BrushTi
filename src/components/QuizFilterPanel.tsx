'use client'  

import axios from "axios"
import { ChangeEvent, useState } from "react"  
import { quizType } from "src/types/quizData.types"

const createPage = async (selector: quizSelector, setQuizzes: (quizzes: quizType[]) => void) => {  
    try {  

        
        const response = await axios.get(`http://localhost:3000/api/quiz?cls=${encodeURIComponent(selector.cls)}&quizNum=${selector.quizNum}`)
        
        if (!response.status) {  
            throw new Error('Failed to fetch quizzes')  
        }  

        const quizdata = await response.data 
        setQuizzes(quizdata)  
    } catch (error) {  
        console.error('Error fetching quizzes:', error)  
        // 这里可以添加错误处理逻辑  
    }  
}  

interface quizSelector {  
    cls: string  
    quizNum: number  
}  

type Props = {  
    setQuizzes: (quizzes: quizType[]) => void  
}  

const QuizFilterPanel = ({ setQuizzes }: Props) => {  
    const [cls, setCls] = useState("内科学")  
    const [quizNum, setQuizNum] = useState(10)  
    const [isLoading, setIsLoading] = useState(false)  

    const handleClsInput = (event: ChangeEvent<HTMLInputElement>) => {  
        setCls(event.target.value)  
    }  

    const submitSelector = async () => {  
        setIsLoading(true)  
        try {  
            const selector: quizSelector = {  
                cls: cls,  
                quizNum: quizNum  
            }  
            await createPage(selector, setQuizzes)  
        } finally {  
            setIsLoading(false)  
        }  
    }  

    return (  
        <div>  
            <div>  
                科目  
                <input   
                    onChange={handleClsInput}   
                    value={cls}  
                    disabled={isLoading}  
                />  
            </div>  

            <div>  
                题数  
                <input   
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {  
                        setQuizNum(parseInt(event.target.value))  
                    }}   
                    value={quizNum}  
                    type="number"  
                    disabled={isLoading}  
                />  
            </div>  

            <div>  
                <button   
                    onClick={submitSelector}  
                    disabled={isLoading}  
                >  
                    {isLoading ? '加载中...' : '随机抽题'}  
                </button>  
            </div>  
        </div>  
    )  
}  

export default QuizFilterPanel