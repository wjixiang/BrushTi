import  { useState } from 'react';  
import styled from 'styled-components';  
import * as React from 'react';

// 定义props接口  
interface CollapsibleProps {  
  trigger: React.ReactNode;  
  children: React.ReactNode;  
  className?: string;  
}  

// 为styled-components定义props接口  
interface CollapsibleContentProps {  
  isOpen: boolean;  
}  

// 创建容器组件  
const Container = styled.div`  
  width: 100%;  
  overflow: hidden;  
  border-radius: 5px;
`;  

// 创建可折叠的内容区域  
const CollapsibleContent = styled.div<CollapsibleContentProps>`  
  transition: max-height 0.3s ease-in-out;  
  max-height: ${props => props.isOpen ? '1000px' : '0'};  
  overflow: hidden;  
`;  

// 创建触发器按钮  
const Trigger = styled.div`  
  padding: 10px;  
  /* background-color: #f0f0f0;   */
  cursor: pointer;  
  user-select: none;  
  
  &:hover {  
    background-color: #e0e0e0;  
  }  
`;  

const Collapsible: React.FC<CollapsibleProps> = ({   
  trigger,   
  children,   
  className   
}) => {  
  const [isOpen, setIsOpen] = useState<boolean>(false);  

  const toggleCollapse = (): void => {  
    setIsOpen(!isOpen);  
  };  

  return (  
    <Container className={className}>  
      <Trigger onClick={toggleCollapse}>  
        {trigger}  
        <span style={{ float: 'right' }}>  
          {isOpen ? '▼' : '▶'}  
        </span>  
      </Trigger>  
      <CollapsibleContent isOpen={isOpen}>  
        {children}  
      </CollapsibleContent>  
    </Container>  
  );  
};  

export default Collapsible;