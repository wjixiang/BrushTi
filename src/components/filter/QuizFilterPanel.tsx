'use client'  

import { ChangeEvent, useEffect, useMemo, useState } from "react"  
import { quizType } from "src/types/quizData.types"
import styled from "styled-components"
import { SelectComponent } from "../SelectBox"
import { OptionType } from "../SelectBox";
import {   
    SingleValue,  
} from 'react-select';  
import { ClusterBox } from "./ClusterBox"
import Collapsible from "./FloatingContainer"
import { Filter } from "lucide-react"


const FilterContainer = styled.div`  
  display: flex;  
  flex-direction: column;  
  gap: 20px;  
  padding: 24px;  
  /* background: #ffffff;   */
  border-radius: 12px;  
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);   */
`;  

const FilterRow = styled.div`  
  display: flex;  
  align-items: center;  
  gap: 16px;  
`;  

const FilterLabel = styled.label`  
  min-width: 80px;  
  font-size: 14px;  
  font-weight: 500;  
`;  

const StyledInput = styled.input`  
  width: 120px;  
  height: 36px;  
  padding: 0 12px;  
  border: 1px solid #e0e0e0;  
  border-radius: 6px;  
  font-size: 14px;  
  outline: none;  
  transition: all 0.3s ease;  

  &:focus {  
    border-color: #4a90e2;  
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.1);  
  }  

  &:disabled {  
    background-color: #f5f5f5;  
    cursor: not-allowed;  
  }  
`;  

const SubmitButton = styled.button`  
  width: 100%;  
  height: 40px;  
  background: #4a90e2;  
  color: white;  
  border: none;  
  border-radius: 6px;  
  font-size: 14px;  
  font-weight: 500;  
  cursor: pointer;  
  transition: all 0.3s ease;  

  &:hover {  
    background: #357abd;  
  }  

  &:disabled {  
    background: #cccccc;  
    cursor: not-allowed;  
  }  
`;  

export interface quizSelector {  
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
        <Collapsible trigger={"题目筛选"}  >
        <FilterContainer>  
          <FilterRow>  
            <FilterLabel>科目</FilterLabel>  
            <SelectComponent  
              options={clsOptions}  
              onChange={handleSelectChange}   
            />  
          </FilterRow>  
    
          <FilterRow>  
            <FilterLabel>题数</FilterLabel>  
            <StyledInput  
              type="number"  
              value={quizNum}  
              onChange={(event: ChangeEvent<HTMLInputElement>) => {  
                setQuizNum(parseInt(event.target.value) || 0);  
              }}  
              disabled={isLoading}  
            />  
          </FilterRow>  
    
          <FilterRow>  
            <FilterLabel>章节</FilterLabel>  
            <ClusterBox  
              boxName="章节"  
              cluster={unit}  
              setCluster={setUnit}  
              apiRequest={apiReqest}  
              selector={selector}  
            />  
          </FilterRow>  
    
          <SubmitButton  
            onClick={submitSelector}  
            disabled={isLoading}  
          >  
            {isLoading ? '加载中...' : '随机抽题'}  
          </SubmitButton>  
        </FilterContainer>  
        </Collapsible> 

      );  
}  



export default QuizFilterPanel;