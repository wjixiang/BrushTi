import { useState, useMemo, useEffect } from "react";
import { SingleValue } from "react-select";
import { OptionType, SelectComponent } from "../SelectBox";
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

interface FixedClusterBoxProps {  
    boxName: string;  
    cluster: string[] | null;  
    setCluster: (cluster: string[]) => void;   
    options: string[]
}  

export const FixedClusterBox = ({  
    cluster,   
    boxName,   
    setCluster,
    options
}: FixedClusterBoxProps) => {  
    const [content, setContent] = useState("");  
    const [isLoadingOptions, setIsLoadingOptions] = useState(false);  

    const handleSelectChange = (selected: SingleValue<OptionType>) => {  
        if (selected && selected.value) {  
            setContent(selected.value as string)
        }  
    };  

    

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
                options={options.map(e=>{return {label: e, value: e}})}  
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