import { Notice, Plugin, ItemView, WorkspaceLeaf ,Events,MarkdownView,TFile, App,PluginSettingTab,Setting} from "obsidian";





export interface btsettings {  
  bank_path: string;
  api_url: string;
	api_key: string;
}


export const DEFAULT_SETTINGS: Partial<btsettings> = {  
  bank_path: "test_bank", 
  api_url: 'https://www.gptapi.us/v1/chat/completions',
	api_key: "sk-0SghhgFMzyNOoRwG981eDcFbEeCa4aEa9c1b831bDc73360b"
};

//setting part

export default class brushtee extends Plugin {
  settings:btsettings 
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new MySettingTab(this.app, this));  

    const test1 = new testdb(app,this.manifest)
    //alert(test1.testfile.length)

    this.registerView(
      test_generate,
      (leaf) => new test_gnerate_view(leaf) 
    );

    this.registerView(
      link_pract,
      (leaf) => new link_practice_view(leaf)
    )

    this.registerView(
      quiz,
      (leaf)=>new quiz_view(leaf,[],this.settings.bank_path)
    )

    this.addRibbonIcon('crosshair', 'active target-test panel', () => {
      new Notice('active setting panel');
      this.activateView();
    });

    this.addRibbonIcon('link', 'active link-test panel', () => {
      new Notice('active link-test panel');
      this.activate_link_test_view();
    });

    this.addCommand({  
      id: 'get-attribute-value',   
      name: 'Get Document Attribute Value',  
      callback: () => this.getAttributeValuesFromFolder(),  
    });  
  }

  async activate_link_test_view(){
    const { workspace } = this.app;

    let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(link_pract);

    if (leaves.length > 0) {
      // A leaf with our view already exists, use that
      leaf = leaves[0];
    } else {
      // Our view could not be found in the workspace, create a new leaf
      // in the right sidebar for it
      leaf = workspace.getRightLeaf(false); // 修改这一行，若为true则会进一步分裂  
      await leaf.setViewState({ type: link_pract, active: true });
    } 

    // "Reveal" the leaf in case it is in a collapsed sidebar
    workspace.revealLeaf(leaf);
  }

  async activateView() {
    const { workspace } = this.app;

    let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(test_generate);

    if (leaves.length > 0) {
      // A leaf with our view already exists, use that
      leaf = leaves[0];
    } else {
      // Our view could not be found in the workspace, create a new leaf
      // in the right sidebar for it
      leaf = workspace.getLeftLeaf(false); // 修改这一行  
      await leaf.setViewState({ type: test_generate, active: true });
    } 

    // "Reveal" the leaf in case it is in a collapsed sidebar
    workspace.revealLeaf(leaf);
  }   

  async getAttributeValuesFromFolder(folderPath = this.settings.bank_path) {  
    let class_list = []
    // 获取文件夹下的所有文件  
    const folder = this.app.vault.getAbstractFileByPath(folderPath); 
    if (folder && folder.children) {  
      for (const file of folder.children) {
        if (file instanceof TFile) {  
          let metadata = await processFile(file)
          if (metadata.hasOwnProperty('class') && metadata.class != null){
            //console.log(metadata['class'])
            class_list.push(metadata.class)
          }
        }  
      }  
    }  
    let uniqueArray = class_list.filter((value, index) => {  
      return class_list.indexOf(value) === index;  
    });  
    console.log(uniqueArray) 
  }   

  async loadSettings() {  
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());  
}  

  async saveSettings() {  
    await this.saveData(this.settings);  
}

}

class MySettingTab extends PluginSettingTab {  
  plugin: brushtee;  

  constructor(app: App, plugin: brushtee) {  
      super(app, plugin);  
      this.plugin = plugin;  
  }  

  display(): void {  
      let { containerEl } = this;  
      containerEl.empty();  

      new Setting(containerEl)  
          .setName("试题库目录")  
          //.setDesc("示例：test_bank")  
          .addText((text) =>  
              text  
                  .setPlaceholder("Enter a value")  
                  .setValue(this.plugin.settings.bank_path)  
                  .onChange(async (value) => {  
                      this.plugin.settings.bank_path = value;  
                      await this.plugin.saveSettings();  
                  })  
          );  

      new Setting(containerEl)
        .setName('API-URL')
        .setDesc('自定义API地址')
        .addText(text => text
          .setPlaceholder('Enter your url')
          .setValue(this.plugin.settings.api_url)
          .onChange(async (value) => {
            this.plugin.settings.api_url = value;
            await this.plugin.saveSettings();
          }));

      new Setting(containerEl)
        .setName('API-KEY')
        .setDesc("填入API-key")
        .addText(text => text
          .setPlaceholder('Enter your api-key')
          .setValue(this.plugin.settings.api_key)
          .onChange(async (value) => {
            this.plugin.settings.api_key = value;
            await this.plugin.saveSettings();
          }));
  }  
}  