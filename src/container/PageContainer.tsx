import { ItemView, WorkspaceLeaf, App } from 'obsidian';
import { createRoot } from 'react-dom/client';
import { QuizApp } from 'src/components/QuizApp';
import apiReqest from 'src/lib/obpostreq';

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
        root.render(<QuizApp appendLink={this.appendLink} apiReqest={apiReqest}/>)

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

