import { ItemView, WorkspaceLeaf, App, MetadataCache } from 'obsidian';
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

    retriveFileName = (fileId: string):string|null => {
        const files = this.app.vault.getFiles()
            for( const file of files) {
                const frontmatter = this.app.metadataCache.getFileCache(file)
                if(frontmatter?.frontmatter && frontmatter.frontmatter["oid"] && frontmatter.frontmatter["oid"]===fileId){
                    return file.basename
                }
            }

            return null
    }

    redirect =  (fileId: string) => {
        const files = this.app.vault.getFiles()
        for( const file of files) {
            const frontmatter = this.app.metadataCache.getFileCache(file)
            if(frontmatter?.frontmatter && frontmatter.frontmatter["oid"] && frontmatter.frontmatter["oid"]===fileId){
                this.app.workspace.openLinkText("",file.path)
            }
        }
    }

    protected async onOpen(): Promise<void> {
        const container = this.containerEl.children[1]
        container.empty()
        const root = createRoot(container)
        root.render(<QuizApp appendLink={this.appendLink} apiReqest={apiReqest} retriveFileName={this.retriveFileName} redirect={this.redirect}/>)

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

