'use client'  

import { ChangeEvent, useEffect, useMemo, useState } from "react"  
import { quizType } from "src/types/quizData.types"
import styled from "styled-components"
import { SelectComponent } from "./SelectBox"
import { OptionType } from "./SelectBox";
import Select, {   
    SingleValue,  
    GroupBase,  
    StylesConfig  
} from 'react-select';  


const TagContainer = styled.div`  
    display: flex;  
    flex-wrap: wrap;  
    gap: 8px;  
    margin-bottom: 10px;  
`;  

// 标签样式  
const Tag = styled.div`  
    background-color: #f0f0f0;  
    border-radius: 16px;  
    padding: 4px 10px;  
    display: flex;  
    align-items: center;  
    gap: 6px;  
    font-size: 14px;  
`;  

// 关闭按钮  
const CloseButton = styled.span`  
    cursor: pointer;  
    color: #888;  
    font-weight: bold;  
    margin-left: 5px;  

    &:hover {  
        color: #ff0000;  
    }  
`;  

// 输入容器  
const InputContainer = styled.div`  
    display: flex;  
    gap: 10px;  
    margin-top: 10px;  
`;  


interface quizSelector {  
    cls: string;
    mode: string[];
    quizNum: number;
    unit: string[] ;
    source: string[] ;
    extractedYear: number[] ;
}  

type Props = {  
    setQuizzes: (quizzes: quizType[]) => void  ;
    apiReqest: {
        POST: (requestURL:string, reqestData: object)=>Promise<string>;
        GET: (url:string)=>Promise<string>
    }
}  

const QuizFilterPanel = ({ setQuizzes, apiReqest }: Props) => {  
    const [cls, setCls] = useState("内科学")  
    const [quizNum, setQuizNum] = useState(10)  
    const [mode, setMode] = useState<string[]>([])   
    const [unit, setUnit] = useState<string[]>([])  
    const [source, setSource] = useState<string[]>([])  
    const [extractedYear, setExtractedYear] = useState<number[]>([])  
    const [isLoading, setIsLoading] = useState(false)  

    const [clsOptions,setClsOptions] = useState<OptionType[]>([]);

    useEffect(() => {  
        const updateOptions = async () => {  
            const newOptions = await fetchOptions();  
            setClsOptions(newOptions);  
        };  

        updateOptions();  
    }, []);  

    const handleSelectChange = (selected: SingleValue<OptionType>) => {  
        if (selected && selected.value) {  
            setCls(selected.value as string)
        }  
    };  

    const fetchOptions = async () => {  
        try {  
            // setIsLoadingOptions(true);  
            const classList: { _id: string; class: string; }[] = JSON.parse(  
                await apiReqest.POST("http://localhost:3000/api/obcors/subject", selector)  
            );  
            
            return classList.map(value => ({  
                value: value.class,  
                label: value.class  
            }));  
        } catch (error) {  
            console.error('Error fetching options:', error);  
            return [];  
        } finally {  
            // setIsLoadingOptions(false);  
        }  
    };  

    // 使用 useMemo 创建 selector  
    const selector = useMemo(() => ({  
        cls,  
        mode,  
        quizNum,  
        unit,  
        source,  
        extractedYear  
    }), [cls, mode, quizNum, unit, source, extractedYear]);  

    const createPage = async (selector: quizSelector) => {  
        try {  
            const quizdata = JSON.parse(  
                await apiReqest.POST("http://localhost:3000/api/obcors/quiz", selector)  
            );  
            setQuizzes(quizdata);  
        } catch (error) {  
            console.error('Error fetching quizzes:', error);  
            // 可以添加错误提示  
        }  
    }  

    const handleClsInput = (event: ChangeEvent<HTMLInputElement>) => {  
        setCls(event.target.value);  
    }  

    const submitSelector = async () => {  
        setIsLoading(true);  
        try {  
            await createPage(selector);  
        } finally {  
            setIsLoading(false);  
        }  
    }  

    return (  
        <div>  
            <div>  
                科目  
                <SelectComponent   
                    options={clsOptions}  
                    onChange={handleSelectChange}  
                    // placeholder={`选择${boxName}`}  
            /> 
            </div>  

            <div>  
                题数  
                <input   
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {  
                        setQuizNum(parseInt(event.target.value) || 0);  
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
                <ClusterBox   
                    boxName={"章节"}   
                    cluster={unit}   
                    setCluster={setUnit}   
                    apiRequest={apiReqest}  
                    selector={selector}  
                />  
            </div>  
        </div>  
    )  
}  

interface ClusterBoxProps {  
    boxName: string;  
    cluster: string[] | null;  
    setCluster: (cluster: string[]) => void;  
    apiRequest: {  
        POST: (requestURL: string, requestData: object) => Promise<string>;  
    };  
    selector: quizSelector;  
}  

export const ClusterBox = ({  
    cluster,   
    setCluster,   
    boxName,   
    apiRequest,  
    selector  
}: ClusterBoxProps) => {  
    const [content, setContent] = useState("");  
    const [options, setOptions] = useState<OptionType[]>([]);  
    const [isLoadingOptions, setIsLoadingOptions] = useState(false);  

    // 使用 useMemo 记忆化 selector  
    const memoizedSelector = useMemo(() => {  
        return JSON.stringify(selector);  
    }, [selector]);  

    const fetchOptions = async () => {  
        try {  
            setIsLoadingOptions(true);  
            const unitList: { _id: string; unit: string; }[] = JSON.parse(  
                await apiRequest.POST("http://localhost:3000/api/obcors/unit", selector)  
            );  
            
            return unitList.map(value => ({  
                value: value.unit,  
                label: value.unit  
            }));  
        } catch (error) {  
            console.error('Error fetching options:', error);  
            return [];  
        } finally {  
            setIsLoadingOptions(false);  
        }  
    };  

    useEffect(() => {  
        const updateOptions = async () => {  
            const newOptions = await fetchOptions();  
            setOptions(newOptions);  
        };  

        updateOptions();  
    }, [memoizedSelector]);  

    const handleSelectChange = (selected: SingleValue<OptionType>) => {  
        if (selected && selected.value) {  
            setContent(selected.value as string)
        }  
    };  

    // const handleInput = (event: ChangeEvent<HTMLInputElement>) => {  
    //     setContent(event.target.value);  
    // }  

    const appendCluster = () => {  
        if (content.trim() !== "") {  
            if (cluster) {  
                if (!cluster.includes(content.trim())) {  
                    setCluster([...cluster, content.trim()]);  
                }  
            } else {  
                setCluster([content.trim()]);  
            }  
            setContent("");  
        }  
    }  

    const removeClusterItem = (itemToRemove: string) => {  
        if (cluster) {  
            setCluster(cluster.filter(item => item !== itemToRemove));  
        }  
    }  

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {  
        if (event.key === 'Enter') {  
            appendCluster();  
        }  
    }  

    return (   
        <div>  
            <h3>{boxName}</h3>  
            <TagContainer>  
                {cluster && cluster.map((e, index) => (  
                    <Tag key={index}>  
                        {e}  
                        <CloseButton onClick={() => removeClusterItem(e)}>  
                            ×  
                        </CloseButton>  
                    </Tag>  
                ))}  
            </TagContainer>  
            <SelectComponent   
                options={options}  
                onChange={handleSelectChange}  
                placeholder={`选择${boxName}`}  
            />  
            <InputContainer>  
                {/* <input   
                    value={content}  
                    onChange={handleInput}  
                    onKeyDown={handleKeyDown}  
                    placeholder={`输入${boxName}`}  
                />   */}
                <button onClick={appendCluster}>  
                    添加{boxName}  
                </button>  
            </InputContainer>  
        </div>  
    );  
}   

export default QuizFilterPanel;