import { ItemView, WorkspaceLeaf } from 'obsidian';
import { createRoot } from 'react-dom/client';
import Page from '../components/Page';
import { quizData } from 'src/components/Quiz';



export default class PageContainer extends ItemView {
    
    viewType = "pageview";
    dispalytext = "quiz";
    quizList: quizData[] = []

    constructor(leaf: WorkspaceLeaf,quizList: quizData[]){
        super(leaf)
        this.quizList = quizList
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
        console.log(this.quizList)
        root.render(<Page quizSet={this.quizList} />)

    }

}