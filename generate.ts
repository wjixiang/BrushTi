import { ItemView, WorkspaceLeaf,TFile,MetadataCache,Events, Notice ,Plugin} from "obsidian";
import {quiz_view,new_test} from "quiz"

export const test_generate = "test-view";

function read_property(filepath,property){
  const tf = this.app.vault.getFileByPath(filepath)
  let metadata = this.app.metadataCache.getFileCache(tf);
  let front_matter = metadata.frontmatter
  return(front_matter[property])
}

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
  tbody: any;
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
    this.path = 'test_bank'
    this.test_list = []
    this.tbody
  }

  getViewType() {
    return test_generate;
  }

  getDisplayText() {
    return "随机抽题";
  }
 
  async onOpen() {
    let class_list = await getAttributeValuesFromFolder()
    const container = this.containerEl.children[1];
    container.empty();
    container.createEl("h4", { text: "随机抽题" });

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
    text: "刷新试题", // 按钮文本  
    cls: "add_button",  
}); 

  // 添加按钮点击事件  
  button_add.addEventListener("click", async () => {  
      const numberValue = numberInputBox.value;  
      let req = [selectBox.value,mode_select_Box.value,numberValue]
      let req_test = await this.fetch(req)
      let selet_test_list = await this.getRandomElements(req_test,req[2])
      this.test_list.push([selectBox.value,mode_select_Box.value,numberValue,selet_test_list])
      this.parse_table(this.tbody,this.test_list)
  });  

  button_generate.addEventListener("click", async () => {  
    await this.fetch_test()
    await this.parse_table(this.tbody,this.test_list)
}); 

    const tableDiv = container.createDiv({cls:"brushti_table_div"});
    const table = tableDiv.createEl("table", { cls: "my-table" });  
    
    // 添加表头  
    const thead = table.createEl("thead");  
    const headerRow = thead.createEl("tr");  
    headerRow.createEl("th", { text: "科目" }); // 第一列的标题  
    headerRow.createEl("th", { text: "题型" }); // 第二列的标题  
    headerRow.createEl("th", { text: "题数" }); // 第三列的标题  
    headerRow.createEl("th", { text: "题目" });
    // 添加表格主体  
    this.tbody = table.createEl("tbody");  

    const button_reset = buttonDiv.createEl("button", {  
      text: "重置预设", // 按钮文本  
      cls: "add_button",  
  });  

  button_reset.addEventListener("click", () => {  
    new Notice("重置题目预设",1000)
    this.reset_table(this.tbody)
    this.test_list = []
});  
  const create_test_div = container.createDiv({cls:"setting_div"});  
  const create_test_button = create_test_div.createEl("button",{
    text:"生成试卷"
  });  

  create_test_button.addEventListener("click", () => {  
    this.create_test_page(quiz_div)
});  

  const quiz_div = container.createDiv({cls:"quiz_div"});  

  }



  async parse_table(tbody: HTMLTableElement | HTMLTableSectionElement,table_data: any[][]){
    this.reset_table(tbody)
    table_data.forEach((data: any[])=>{
      const row = tbody.createEl("tr");  
      row.createEl("td", { text: data[0] });  
      row.createEl("td", { text: data[1] });  
      row.createEl("td", { text: data[2]});  
      const c3 = row.createEl("td");
      const u3 = c3.createEl("ul")
      let r3 = '';
      data[3].forEach((s: any) => {
        let link_name = s.replace(/\.md$/, "");
        // link_name = "[["+link_name+"]]"
        u3.createEl("li",{text:link_name})
      });
    });

  }

  async reset_table(tbody:HTMLTableElement){
    this.tbody.innerHTML = ''
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
      return uniqueArray
  }}

  async create_test_page(quiz_div){
    let test_concat = [];
    const tl = [];
    this.test_list.forEach(e=>{
      test_concat = test_concat.concat(e[3])
    });
    // console.log(test_concat);

    test_concat.forEach(async ts=>{
      const test = {id:ts,
        tf: this.app.vault.getFileByPath(this.path+"/"+ts),
        cls: read_property(this.path+"/"+ts,"class"),
        mode: read_property(this.path+"/"+ts,"mode"),
        q:"",
        a:"",
        div:HTMLElement
      }

       tl.push(test)
    });

    tl.forEach(async t=>{
      // console.log(t)
      let text =  await this.test_parse(t.tf)
      t.q = text["Q"]
      t.a = text["A"]
      t.div = quiz_div.createDiv({
        cls:"quiz",
        id:t.id
      })
      //

      t.des_div = t.div.createDiv({
        cls:"q_des"
      })

      t.des_div.createEl('p',{
        text:t.cls+" · "+t.mode,
        cls:"des_text"
      })

      //
      t.q_div = t.div.createDiv({
        cls:"q_div"
      })
      let pt = t.q.split("\n")
      pt.forEach(p=>{
        t.q_div.createEl("p",{text:p})
        t.q_div.createEl('br')
      })

      //
      t.answer_select_div = t.div.createDiv({
        cls:'answer_select'
      })

      if (t.mode=='A1'||t.mode =='A2'){
        const options = [  
          { value: 'A', label: 'A' },  
          { value: 'B', label: 'B' },  
          { value: 'C', label: 'C' },
          { value: 'D', label: 'D' },
          { value: 'E', label: 'E' } 
      ];  
      options.forEach(option => {  
        // 创建一个单选框元素  
        t.answer_bow = t.answer_select_div.createEl('input');  
        t.answer_bow.type = 'radio';  
        t.answer_bow.name = t.id; // 同组单选框名称  
        t.answer_bow.value = option.value; // 设置单选框的值  

        // 创建标签元素  
        const radioLabel = t.answer_select_div.createEl('label');  
        radioLabel.textContent = option.label; // 设置标签文本  
   });
      t.toggle_input = t.answer_select_div.createEl('button',{
        text:"切换为手动输入"
      })
      t.toggle_input.addEventListener("click", () => {  
        t.answer_select_div.innerHTML = ''
        t.answer_input = t.answer_select_div.createEl('input',{
          text:"输入选项",
          value:0
        })
    });  
      }
    })


  }

  parseMarkdownHeadings(mdString) {  
    // Split the string into lines  
    const lines = mdString.split('\n');  
    // Initialize an object to hold the markdown sections  
    let sections = {};  
    // Temporary variable to hold the current section heading  
    let currentHeading = '';  
    // Temporary variable to hold the current section content  
    let currentContent = [];  

    lines.forEach(line => {  
        // Check if line is a H1 heading  
        if (line.startsWith('# ')) {  
            // If a current section exists, save it before starting a new one  
            if (currentHeading) {  
                sections[currentHeading] = currentContent.join('\n').trim();  
            }  
            // Update the current heading  
            currentHeading = line.substring(2).trim();  
            // Reset current content  
            currentContent = [];  
        } else {  
            // If not a heading, add line to current section content  
            if (currentHeading) {  
                currentContent.push(line);  
            }  
        }  
    });  

    // Add the last section to the sections object  
    if (currentHeading) {  
        sections[currentHeading] = currentContent.join('\n').trim();  
    }  

    return sections;  
}  

  async fetch(req){
    const folder = this.app.vault.getAbstractFileByPath(this.path); 
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
    return(suject_req)
  }

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
    // console.log(this.test_list)
  } 

  async getRandomElements(arr: string | any[], count: number) {  
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


  async test_parse(tf:TFile){
    let plain_text = await this.app.vault.read(tf)
    // const test = {q:"",a:""}

    let md_parse = this.parseMarkdownHeadings(plain_text)
    // console.log(md_parse)

    // //console.log(plain_text)
    // const regex_1 = /Q\s*==\s*([\s\S]*?)\s*A\s*==/;  

    // const matches_1 = plain_text.match(regex_1);  

    // if (matches_1 && matches_1[1]) {  
    //     const content = matches_1[1].trim();  
    //     console.log("Q:\n",content); // 输出提取的内容  
    //     test.q = content
    // } else {  
    //     console.log('未找到问题');  
    // } 

    // const regex_2 =/A\s*==\n([\s\S]*?)\n(?=[A-Z] ==|$)/;  

    // const matches_2 = plain_text.match(regex_2);  

    // if (matches_2 && matches_2[1]) {  
    //     const content = matches_2[1].trim();  
    //     console.log("A:\n",content); // 输出提取的内容  
    //     test.a = content
    // } else {  
    //     console.log('未找到答案');  
    // } 
    return(md_parse)
  }

  async onClose() {
    // Nothing to clean up.
  }
}