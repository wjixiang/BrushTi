import { Notice, Plugin, ItemView, WorkspaceLeaf ,Events,MarkdownView,TFile, App,PluginSettingTab,Setting} from "obsidian";
import { btsettings,BtSettingTab,DEFAULT_SETTINGS } from "./setting";
import PageContainer from './container/PageContainer';
import quizDB from "./quizDB";


export default class brushtee extends Plugin {
  settings: btsettings;
  quizDB: quizDB;
  view = {
    practice: "pageview"
  }

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new BtSettingTab(this.app,this));  
    this.quizDB = new quizDB(this)
    this.quizDB.load()

    this.addRibbonIcon('crosshair', 'active target-test panel', () => {
      new Notice('active setting panel');
      this.activateQuiz();
    });

  }

  
  async activateQuiz() {
    this.registerView(
      "pageview",
      (leaf) => new PageContainer(leaf,this.quizDB.quizes.slice(0,30)) 
    );

    const { workspace } = this.app;

    let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(this.view.practice);

    if (leaves.length > 0) {
      // A leaf with our view already exists, use that
      leaf = leaves[0];
    } else {
      // Our view could not be found in the workspace, create a new leaf
      // in the right sidebar for it
      leaf = workspace.getRightLeaf(false); 
      if(leaf) {
        await leaf.setViewState({ type: this.view.practice, active: true });
      }else {
        throw new Error("void leaf")
      }
    } 

    // "Reveal" the leaf in case it is in a collapsed sidebar
    workspace.revealLeaf(leaf);
  }

  async loadSettings() {  
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());  
}  

  async saveSettings() {  
    await this.saveData(this.settings);  
}

}

