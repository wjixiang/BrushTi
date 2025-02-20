'use client'  

import axios from "axios"
import { ChangeEvent, useState } from "react"  
import { oid, quizType } from "src/types/quizData.types"
import apiReqest from "src/lib/obpostreq"


const createPage = async (selector: quizSelector, setQuizzes: (quizzes: quizType[]) => void) => {  
    try {  

        
        // const response = await axios.get(`http://localhost:3000/api/quiz?cls=${encodeURIComponent(selector.cls)}&quizNum=${selector.quizNum}&unit=${encodeURIComponent(selector.unit)}`)
        const quizdata = JSON.parse(await apiReqest("http://localhost:3000/api/obcors/quiz", selector))
        
        setQuizzes(quizdata)  
    } catch (error) {  
        console.error('Error fetching quizzes:', error)  
        // 这里可以添加错误处理逻辑  
    }  
}  

interface quizSelector {  
    cls: string;
    mode: string[];
    quizNum: number;
    unit: string[] ;
    source: string[] ;
    extractedYear: number[] ;
}  

type Props = {  
    setQuizzes: (quizzes: quizType[]) => void  
}  

const QuizFilterPanel = ({ setQuizzes }: Props) => {  
    const [cls, setCls] = useState("内科学")  
    const [quizNum, setQuizNum] = useState(10)  
    const [mode, setMode] = useState<string[]>([]) 
    const [unit,setUnit] = useState<string[]>([])
    const [source, setSource] = useState<string[]>([])
    const [extractedYear,setExtractedYear] = useState<number[]>([])

    const [isLoading, setIsLoading] = useState(false)  

    const handleClsInput = (event: ChangeEvent<HTMLInputElement>) => {  
        setCls(event.target.value)  
    }  

    const submitSelector = async () => {  
        setIsLoading(true)  
        try {  
            const selector: quizSelector = {
                cls: cls,
                mode: mode,
                quizNum: quizNum,
                unit: unit,
                source: source,
                extractedYear: extractedYear
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

            <div>
                <ClusterBox boxName={"章节"} cluster={unit} setCluster={setUnit} />
            </div>
        </div>  
    )  
}  

type clusterBoxProps = {
    boxName: string;
    cluster: string[] | null;
    setCluster: (cluster: string[])=>void
}
export const ClusterBox = ({cluster, setCluster, boxName}: clusterBoxProps) => {
    const [content, setContent] = useState("")

    // const [contentList, setContentList] = useState(cluster)

    const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
       setContent(event.target.value)
    }

    const appendCluster = () => {
        if (content !== "") {
            if (cluster) {
                // 创建一个新的数组
                const newCluster = [...cluster, content];
                setCluster(newCluster);
            } else {
                setCluster([content]);
            }
            // 清空输入框内容
            setContent("");
        }
    }

    return ( 
        <div>
            <h3>{boxName}</h3>
            <div>
                {cluster && cluster.map(e=><li>{e}</li>)}
            </div>
            <div>
                <input onChange={handleInput}/>
                <button onClick={appendCluster}/>
            </div>
        </div>
    );
}

export default QuizFilterPanel