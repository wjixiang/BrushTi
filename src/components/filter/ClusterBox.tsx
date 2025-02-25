import { useState, useMemo, useEffect } from "react";
import { SingleValue } from "react-select";
import { OptionType, SelectComponent } from "../SelectBox";
import { quizSelector } from "./QuizFilterPanel";
import styled from "styled-components";

const Tag = styled.div`  
    background-color: #f0f0f0;  
    border-radius: 16px;  
    padding: 4px 10px;  
    display: flex;  
    align-items: center;  
    gap: 6px;  
    font-size: 14px;  
`;  

const TagContainer = styled.div`  
    display: flex;  
    flex-wrap: wrap;  
    gap: 8px;  
    margin-bottom: 10px;  
`;  

const CloseButton = styled.span`  
    cursor: pointer;  
    color: #888;  
    font-weight: bold;  
    margin-left: 5px;  

    &:hover {  
        color: #ff0000;  
    }  
`;  

const InputContainer = styled.div`  
    display: flex;  
    gap: 10px;  
    margin-top: 10px;  
`;  

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
            {/* <h3>{boxName}</h3>   */}
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
                <button onClick={appendCluster}>  
                    添加{boxName}  
                </button>  
            </InputContainer>  
        </div>  
    );  
}   