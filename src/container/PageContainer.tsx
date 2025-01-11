import { ItemView } from 'obsidian';
import { createRoot } from 'react-dom/client';
import Page from '../components/Page';



export default class PageContainer extends ItemView {
    viewType = "pageview";
    dispalytext = "quiz"

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
        root.render(<Page />)

    }

}