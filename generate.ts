import { ItemView, WorkspaceLeaf,TFile,MetadataCache,Events, Notice } from "obsidian";
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
  test_list: never[];
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
    this.path = 'test_bank'
    this.test_list = []
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
  const button_add = buttonDiv.createEl("button", {  
      text: "新建题目", // 按钮文本  
      cls: "add_button",  
  });  

  const button_generate = buttonDiv.createEl("button", {  
    text: "生成试卷", // 按钮文本  
    cls: "add_button",  
}); 

  // 添加按钮点击事件  
  button_add.addEventListener("click", () => {  
      const numberValue = numberInputBox.value;  
      this.test_list.push([selectBox.value,mode_select_Box.value,numberValue])
      console.log(this.test_list)
      this.parse_table(tbody,this.test_list)
  });  

  button_generate.addEventListener("click", () => {  
    this.fetch_test()
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

    const button_reset = buttonDiv.createEl("button", {  
      text: "重置预设", // 按钮文本  
      cls: "add_button",  
  });  

  button_reset.addEventListener("click", () => {  
    new Notice("重置题目预设",1000)
    this.reset_table(tbody)
    this.test_list = []
});  
  
  }

  async parse_table(tbody,table_data: any[][]){
    this.reset_table(tbody)
    table_data.forEach((data: any[])=>{
      const row = tbody.createEl("tr");  
      row.createEl("td", { text: data[0] });  
      row.createEl("td", { text: data[1] });  
      row.createEl("td", { text: data[2]});  
    });

  }

  async reset_table(tbody:HTMLTableElement){
    tbody.innerHTML = ''
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

  async fetch_test(){
    const folder = this.app.vault.getAbstractFileByPath(this.path); 
    this.test_list.forEach(async req =>{
      //调取指定科目的所有题目、题型
      let suject_req = []
      for (const file of folder.children) {  
        if (file instanceof TFile) {  
          let metadata = this.app.metadataCache.getFileCache(file);
          let front_matter = metadata.frontmatter
          if ((front_matter['class'] == req[0]) && (front_matter['mode'] == req[1])){
            //console.log(metadata['class'])
            suject_req.push(file.name)
          }
        }  
      } 

      //抽题
      let selet_test_list = await this.getRandomElements(suject_req,req[2])
      req[3] = selet_test_list
      // console.log(selet_test_list)
    });
    console.log(this.test_list)
  }

  async getRandomElements(arr, count) {  
    // 确保 count 不超过数组的长度  
    if (count > arr.length) {  
      new Notice("请求的数量超过数组长度", 1000)
      throw new Error("请求的数量超过数组长度");  
    }  

    // 创建一个 Set 用于存储随机选择的索引  
    const resultSet = new Set();  

    // 随机选择索引，直到选择的数量达到 count  
    while (resultSet.size < count) {  
        const randomIndex = Math.floor(Math.random() * arr.length);  
        resultSet.add(randomIndex);  
    }  

    // 根据随机选择的索引获取相应的元素  
    const result = Array.from(resultSet).map(index => arr[index]);  
    return result;  
  } 

  async onClose() {
    // Nothing to clean up.
  }
}