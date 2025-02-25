import { useState } from "react";
import { LinkBlock } from "./LinkBlock";

type Props = {
    // fetchLinks: (quizId: string)=>Promise<string[]>;
    // fetchName: (linkId: string)=>Promise<string>;
    isloading: boolean;
    links: {
        linkId: string;
        linkName: string;
    }[]
    redirect: (linkId: string)=>void;
}
export const LinkBox = ({isloading, links, redirect}: Props) => {

    if(isloading){
        return <div>
            loading
        </div>
    }

    return ( 
        <div>
            {links.map((link, index)=><LinkBlock linkId={link.linkId} linkName={link.linkName} redirect={redirect} index={index}/>)}
        </div>
    );
}