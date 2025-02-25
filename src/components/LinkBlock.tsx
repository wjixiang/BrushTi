import styled from "styled-components";
import { Link } from "lucide-react";

type Props = {
    index: number;
    linkId: string;
    linkName: string;
    redirect: (linkId: string)=>void;
}

const LinkBlockContainer = styled.div`
    padding: 5px;
    /* border-radius: 5px; */
    border-bottom: solid 1px #ccc;
    display: flex;
    &:hover {  
        border: 2px #1890ff solid;
    };
    align-items: center;
    &:active {  
    transform: scale(0.98); // 点击时略微缩小  
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);  
  }
    transition: all 0.2s,
        border 0s;

`;

const LinkContent = styled.div`
    font-size: 20px;
    padding: 5px;
`

export const LinkBlock = ({index, linkId,linkName,redirect}: Props) => {
    return ( 
        <>
            <LinkBlockContainer onClick={()=>redirect(linkId)}>
                <Link size={"25px"}/> 
                <LinkContent>
                    {/* {index} */}
                    {linkName}
                </LinkContent>
            </LinkBlockContainer>
        </>
    );
}