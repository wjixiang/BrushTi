import { ItemView, WorkspaceLeaf,TFile,MetadataCache,Events } from "obsidian";
import {parseYamlMetadata,processFile} from "metadata_solve"
import { string } from "yaml/dist/schema/common/string";

export const test_generate = "test-view";

async function getAttributeValuesFromFolder(folderPath = 'test_bank') {  
  let class_list = []
  // 获取文件夹下的所有文件  
  const folder = this.app.vault.getAbstractFileByPath(folderPath); 
  if (folder && folder.children) {  
    for (const file of folder.children) {  
      if (file instanceof TFile) {  

        let metadata = this.app.metadataCache.getFileCache(file);
        let front_matter = metadata.frontmatter
        // console.log(front_matter.frontmatter)
        // let metadata = await processFile(file)
        if (front_matter['class'] != null){
          //console.log(metadata['class'])
          class_list.push(front_matter.class)
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
  path: string;
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
    this.path = 'test_bank'
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
    const dropdownDiv = container.createDiv({cls:"setting_div"});  

    // Create a dropdown select box  
    dropdownDiv.createEl("p",{text:"科目"})
    const selectBox = dropdownDiv.createEl("select", {  
      cls: "brushti_suject_select", // Optional: Add a custom class for styling  
    });  

    // Create options for the dropdown  
    const options = class_list;  
    options.forEach(optionText => {  
      const option = selectBox.createEl("option", { text: optionText });  
      option.value = optionText; // Set the value for each option  
    });  

    // Optionally, you can add an event listener to the select box  
    selectBox.addEventListener("change", async (event) => {  
      console.log("Selected suject:",selectBox.value);  
      mode_select_Box.options.length = 0
      let mode_list = await this.set_mode_list(selectBox.value,this.path)
      mode_list.forEach(optionText => {  
        console.log(optionText)
        const option = mode_select_Box.createEl("option", { text: optionText });  
        option.value = optionText; // Set the value for each option  
      }); 
    }); 
  
    // Create a div for the input box  
    const mode_select_div = container.createDiv({cls:"setting_div"});  

    mode_select_div.createEl("p",{text:"题型"})

    const mode_select_Box = mode_select_div.createEl("select", {  
      cls: "brushti_mode_select", // Optional: Add a custom class for styling  
    }); 

    // Create an input box  
    // const inputBox = mode_select_div.createEl("input", {  
    //   type: "text",  
    //   placeholder: "Enter your text here...",  
    //   cls: "my-custom-input", // Optional: Add a custom class for styling  
    // });  

    // // Optionally, you can add an event listener to the input  
    // inputBox.addEventListener("input", (event) => {  
    //   console.log("Input value:", (event.target as HTMLInputElement).value);  
    // });  

    //create table_view

    const numberDiv = container.createDiv({cls:"setting_div"});
    numberDiv.createEl("p",{text:"题数"})

    const numberInputBox = numberDiv.createEl("input", {  
      type: "number", // 设置输入类型为数字  
      cls: "test-number-input",  
      value:1
  }); 

  const buttonDiv = container.createDiv({ cls: "button_div" });  
  const button = buttonDiv.createEl("button", {  
      text: "新建题目", // 按钮文本  
      cls: "add_button",  
  });  

  // 添加按钮点击事件  
  button.addEventListener("click", () => {  
      const numberValue = numberInputBox.value;  
      console.log("输入的数字:", numberValue);  
      // 在此处添加你的处理逻辑，比如将输入的数字发送到某个函数  
      new Notice(`您输入的数字是: ${numberValue}`); // 使用 Obsidian 的通知显示输入  
      const row = tbody.createEl("tr")
      row.createEl("td", { text: selectBox.value });  
      row.createEl("td", { text: mode_select_Box.value });  
      row.createEl("td", { text: numberValue }); 
  });  

    const tableDiv = container.createDiv({cls:"brushti_table_div"});
    const table = tableDiv.createEl("table", { cls: "my-table" });  
    
    // 添加表头  
    const thead = table.createEl("thead");  
    const headerRow = thead.createEl("tr");  
    headerRow.createEl("th", { text: "科目" }); // 第一列的标题  
    headerRow.createEl("th", { text: "题型" }); // 第二列的标题  
    headerRow.createEl("th", { text: "题数" }); // 第三列的标题  

    // 添加表格主体  
    const tbody = table.createEl("tbody");  
  
  }

  async set_mode_list(suject: string,folderPath:string){
    const folder = this.app.vault.getAbstractFileByPath(folderPath); 
    let mode_list = []
    if (folder && folder.children) {  
      for (const file of folder.children) {  
        if (file instanceof TFile) {  
  
          let metadata = this.app.metadataCache.getFileCache(file);
          let front_matter = metadata.frontmatter
          // console.log(front_matter.frontmatter)
          // let metadata = await processFile(file)
          if (front_matter['class'] == suject){
            //console.log(metadata['class'])
            mode_list.push(front_matter['mode'])
          }
        }  
      }  

      let uniqueArray = mode_list.filter((value, index) => {  
        return mode_list.indexOf(value) === index;  
      });  
      console.log(typeof(uniqueArray))
      return uniqueArray
  }}

  async onClose() {
    // Nothing to clean up.
  }
}