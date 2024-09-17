import { ItemView } from "obsidian"

export const link_pract = "link-test-view";

export class link_practice_view extends ItemView{
    getViewType(): string {
        return link_pract;
    }
    getDisplayText(): string {
        return "link-test"
    }

    async onOpen(){
        const container = this.containerEl.children[1];
        container.empty();
        // container.createEl("h4", { text: "随机抽题" });

        const config_div = container.createDiv({cls:"config-div"})
        const setting = config_div.createDiv({cls:"setting-set"})
        // Create a div for the dropdown  
        const dropdownDiv = setting.createDiv({cls:"setting_div"});  

        // Create a dropdown select box  
        dropdownDiv.createEl("p",{text:"科目"})
    }

    async flash_test(testlist: any){
        
    }
}