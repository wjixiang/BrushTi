import { ItemView, WorkspaceLeaf,TFile } from "obsidian";
import {parseYamlMetadata,processFile} from "metadata_solve"

export const test_generate = "test-view";

async function getAttributeValuesFromFolder(folderPath = 'test_bank') {  
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
  return uniqueArray
}   

export class test_gnerate_view extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType() {
    return test_generate;
  }

  getDisplayText() {
    return "examination setting";
  }
 
  async onOpen() {
    let class_list = await getAttributeValuesFromFolder()
    const container = this.containerEl.children[1];
    container.empty();
    container.createEl("h4", { text: "main panel" });

    // Create a div for the dropdown  
    const dropdownDiv = container.createDiv();  

    // Create a dropdown select box  
    const selectBox = dropdownDiv.createEl("select", {  
      cls: "my-custom-select", // Optional: Add a custom class for styling  
    });  

    // Create options for the dropdown  
    const options = class_list;  
    options.forEach(optionText => {  
      const option = selectBox.createEl("option", { text: optionText });  
      option.value = optionText; // Set the value for each option  
    });  

    // Optionally, you can add an event listener to the select box  
    selectBox.addEventListener("change", (event) => {  
      console.log("Selected value:", (event.target as HTMLSelectElement).value);  
    }); 
  
    // Create a div for the input box  
    const inputDiv = container.createDiv();  

    // Create an input box  
    const inputBox = inputDiv.createEl("input", {  
      type: "text",  
      placeholder: "Enter your text here...",  
      cls: "my-custom-input", // Optional: Add a custom class for styling  
    });  

    // Optionally, you can add an event listener to the input  
    inputBox.addEventListener("input", (event) => {  
      console.log("Input value:", (event.target as HTMLInputElement).value);  
    });  

  }

  async onClose() {
    // Nothing to clean up.
  }
}