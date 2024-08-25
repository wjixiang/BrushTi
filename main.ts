import { Notice, Plugin, ItemView, WorkspaceLeaf ,Events,MarkdownView,TFile, App} from "obsidian";
import {test_gnerate_view, test_generate} from "generate";
import { testdb } from "base";
import { log } from "console";
import {parseYamlMetadata,processFile} from "metadata_solve"
import {quiz_view,new_test} from "quiz"

export default class brushtee extends Plugin {
  folderpath: string;

  async onload() {
    this.folderpath = 'test_bank'

    const test1 = new testdb(app,this.manifest)
    //alert(test1.testfile.length)

    this.registerView(
      test_generate,
      (leaf) => new test_gnerate_view(leaf) 
    );

    this.addRibbonIcon('circle', 'active panel', () => {
      new Notice('active setting panel');
      this.activateView();
    });

    this.addCommand({  
      id: 'get-attribute-value',  
      name: 'Get Document Attribute Value',  
      callback: () => this.getAttributeValuesFromFolder(),  
    });  
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
      leaf = workspace.getLeaf(true); // 修改这一行  
      await leaf.setViewState({ type: test_generate, active: true });
    } 

    // "Reveal" the leaf in case it is in a collapsed sidebar
    workspace.revealLeaf(leaf);
    console.log("123")

  }   

  async getAttributeValuesFromFolder(folderPath = 'test_bank') {  
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

}
