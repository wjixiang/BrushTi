import { ItemView, WorkspaceLeaf, App } from 'obsidian';
import { createRoot } from 'react-dom/client';
import Page from '../components/Page';
import { useState } from 'react';
import QuizFilterPanel from 'src/components/QuizFilterPanel';
import { quizType } from 'src/types/quizData.types';




export default class PageContainer extends ItemView {
    
    viewType = "pageview";
    dispalytext = "quiz";

    constructor(leaf: WorkspaceLeaf){
        super(leaf)
    }

    getViewType(): string {
        return this.viewType
    }
    getDisplayText(): string {
        return this.dispalytext
    }

    protected async onOpen(): Promise<void> {
        const container = this.containerEl.children[1]
        container.empty()
        const root = createRoot(container)
        root.render(<QuizApp appendLink={this.appendLink}/>)

    }

    appendLink = ():Promise<string|null> => {
        const currentNote = this.app.workspace.getActiveFile()
        return new Promise((resolve)=>{
            if(currentNote){
                this.app.fileManager.processFrontMatter(currentNote,(frontmatter)=>{
                    if(frontmatter.oid){
                        resolve(frontmatter.oid)
                    }else{
                        const uuid = crypto.randomUUID()
                        frontmatter.oid = uuid
                        resolve(uuid)
                    }
                })
            }else{
                resolve(null)
            }
        })
        

}}

type Props = {
    appendLink: ()=>Promise<null|string>
}
export const QuizApp = ({appendLink}: Props) => {
    const [quizzes,setQuizzes] = useState<quizType[]>([])
  
    return (
      <div>
        <div>
          <QuizFilterPanel setQuizzes={setQuizzes}/>
        </div>
        
        <div>
          <Page quizSet={quizzes} appendLink={appendLink}/>
        </div>
      </div>
    );
}