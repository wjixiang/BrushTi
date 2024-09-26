import { ItemView, WorkspaceLeaf,TFile,MetadataCache,Events, Notice ,Plugin,FileManager,App, getAllTags,MarkdownRenderer} from "obsidian";
import { test_info,test } from "./test";
import { quiz } from "./quiz";
import { string } from "yaml/dist/schema/common/string";


export const test_generate = "test-view";

export function read_property(filepath,property){
  const tf = this.app.vault.getFileByPath(filepath)
  let metadata = this.app.metadataCache.getFileCache(tf);
  let front_matter = metadata.frontmatter
  if(front_matter==null){
    console.log(tf.name)
  }
  return(front_matter[property])
}

function allElementsExist(list1, list2) {  
  return list1.every(element => list2.includes(element));  
} 

function arraysEqual(arr1, arr2) {  
  // 首先检查长度是否相等  
  if (arr1.length !== arr2.length) {  
      return false;  
  }  

  // 检查每个元素是否相等  
  for (let i = 0; i < arr1.length; i++) {  
      // 如果元素是数组，递归比较  
      if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {  
          if (!arraysEqual(arr1[i], arr2[i])) {  
              return false;  
          }  
      } else if (arr1[i] !== arr2[i]) {  
          return false;  
      }  
  }  

  return true; // 如果所有检查都通过，返回 true  
}  

async function getAttributeValuesFromFolder(folderPath = 'test_bank') {  
  let class_list = []
  // 获取文件夹下的所有文件  
  const folder = this.app.vault.getAbstractFileByPath(folderPath); 
  if (folder && folder.children) {  
    for (const file of folder.children) {  
      if (file instanceof TFile) {  
        let metadata = await this.app.metadataCache.getFileCache(file);
        console.log(metadata,file.name)
        let front_matter = metadata.frontmatter
        // console.log(front_matter.frontmatter)
        // let metadata = await processFile(file)
        if(front_matter.hasOwnProperty("class")){
        if (front_matter['class'] != null){
          //console.log(metadata['class'])
          class_list.push(front_matter.class)
        }
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
    return "刷题";
  }
   
  async onOpen() {
    let class_list = await getAttributeValuesFromFolder()
    const container = this.containerEl.children[1];
    container.empty();
    // container.createEl("h4", { text: "随机抽题" });

    const config_div = container.createDiv({cls:"config-div"})
    const setting = config_div.createDiv({cls:"setting-set"})
    // Create a div for the dropdown  
    const dropdownDiv = setting.createDiv({cls:"setting_div"});  

    // Create a dropdown select box  
    const dropdonwDiv_h = dropdownDiv.createDiv({cls:"horizon-div"});  
    dropdonwDiv_h.createEl("p",{text:"科目"})
    
    const selectBox = dropdonwDiv_h.createEl("select", {  
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
    const mode_select_div = setting.createDiv({cls:"setting_div"});  
    const msd = mode_select_div.createDiv({
      cls:"horizon-div"
    })

    msd.createEl("p",{text:"题型"})

    const mode_select_Box = msd.createEl("select", {  
      cls: "brushti_mode_select", // Optional: Add a custom class for styling  
    }); 

    const tagDiv = setting.createDiv({cls:"setting_div"});
    // tagDiv.createEl("p",{text:"标签"}) 
    const tag_rule_div = tagDiv.createDiv({cls:"tag-rule"})
    const tag_set_div = tag_rule_div.createDiv({
      cls:"container"
    }
    )
    const tag_input_div = tag_set_div.createDiv({
      cls:"input-container"
    })
    const tag_input = tag_input_div.createEl('input',{ 
      cls:"test-number-input"
    })

    tag_input.placeholder = "要包含/排除的标签"

    const tag_suggest = tag_input_div.createDiv()
    const tag_button_div = tag_set_div.createDiv({
      cls:"tag-button-div"
    })
    const tag_in = tag_button_div.createEl('button',{
      text:"包含",
      cls:"tag_button"
    })
    const tag_out = tag_button_div.createEl('button',{
      text:"排除",
      cls:"tag_button"
    })

    tag_in.addEventListener('click',()=>{
      if(tag_input.value != "" && !this.check_tag(tag_in_display_div,tag_out_display_div,tag_input.value)){
      this.create_in_tag(tag_in_display_div,tag_input.value)
      console.log(this.get_in_tag(tag_in_display_div))
      }
    })

    tag_out.addEventListener('click',()=>{
      if(tag_input.value != "" && !this.check_tag(tag_in_display_div,tag_out_display_div,tag_input.value)){
      this.create_out_tag(tag_out_display_div,tag_input.value)
      console.log(this.get_in_tag(tag_out_display_div))
      }
    })

    const tag_display_div = tag_rule_div.createDiv({
      cls:"tag-display"
    })
    const tag_in_display_div = tag_display_div.createDiv()
    tag_display_div.createEl("hr")
    const tag_out_display_div = tag_display_div.createDiv()

    tag_in_display_div.createEl("p",{
      text:"包含"
    })


    tag_out_display_div.createEl("p",{
      text:"排除"
    })

    const suggestions = this.getalltags();  
    const input = document.getElementById('autocomplete-input');  
    const suggestionsBox = document.getElementById('suggestions');  
    const maxSuggestions = 5

    // const all_tag_list = this.getalltags()

    tag_input.addEventListener('input', function() {  
      const value = this.value.toLowerCase();  
      tag_suggest.innerHTML = '';  
      if (value) {  
          const filteredSuggestions = suggestions.filter(suggestion => suggestion.toLowerCase().startsWith(value)); 
          const limitedSuggestions = filteredSuggestions.slice(0, maxSuggestions);
          limitedSuggestions.forEach(suggestion => {  
              const div = document.createElement('div');  
              div.classList.add('suggestion');  
              div.textContent = suggestion;  
              div.addEventListener('click', function() {  
                tag_input.value = suggestion;  
                tag_suggest.empty();  
              });  
              tag_suggest.appendChild(div);  
          });  
      }  
  }); 


    const numberDiv = setting.createDiv({cls:"setting_div"});
    // numberDiv.createEl("p",{text:"题数"})

    const numberInputBox = numberDiv.createEl("input",  {  
      type: "number", // 设置输入类型为数字  
      cls: "test-number-input",  
      value:1
  }); 

  const horizon_div = numberDiv.createDiv({
    cls:"horizon-div"
  })

    const plus =  horizon_div.createEl("button",{
      text:"+1",
      cls:"number-button"
    })

    const minus =  horizon_div.createEl("button",{
      text:"-1",
      cls:"number-button"
    })

    plus.addEventListener('click',()=>{
      if(numberInputBox.value!=""){
        numberInputBox.value=String(Number(numberInputBox.value) + 1)
      }else{
        numberInputBox.value=String(1)
      }
    })

    minus.addEventListener('click',()=>{
      if(numberInputBox.value!=""){
        if(Number(numberInputBox.value)>0)
        numberInputBox.value=String(Number(numberInputBox.value) - 1)
      }else{
        
      }
    })

    const max_num = horizon_div.createEl("button",{
      text:"MAX",
      cls:"number-button"
    })

    max_num.addEventListener("click",async ()=>{
      let in_tag_list = this.get_in_tag(tag_in_display_div)
      let out_tag_list = this.get_in_tag(tag_out_display_div)
      const numberValue = numberInputBox.value;  
      let req = [selectBox.value,mode_select_Box.value,numberValue]
      let req_test = await this.fetch(req)//获取满足科目和体型要求的题目
      console.log(req_test)
      console.log(in_tag_list)
      req_test = await this.tag_filter(req_test,in_tag_list,out_tag_list)
      numberInputBox.value = req_test.length
    })

  const buttonDiv = config_div.createDiv({ cls: "button_div" });  
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
    let in_tag_list = this.get_in_tag(tag_in_display_div)
    let out_tag_list = this.get_in_tag(tag_out_display_div)
      const numberValue = numberInputBox.value;  
      if(numberValue==""){
        new Notice("未输入题数",1000)
      }else{
        let req = [selectBox.value,mode_select_Box.value,numberValue]
        let req_test = await this.fetch(req)//获取满足科目和体型要求的题目
        // console.log(req_test)
        // console.log(in_tag_list)
        req_test = await this.tag_filter(req_test,in_tag_list,out_tag_list)
        console.log(req_test)
        console.log(req[2])
        let selet_test_list = await this.getRandomElements(req_test,req[2])
        this.test_list.push([selectBox.value,mode_select_Box.value,numberValue,selet_test_list])
        this.parse_table(this.tbody,this.test_list)
        new Notice("题目添加成功",1000)
      }
  });  

  button_generate.addEventListener("click", async () => {  
    const in_tag_list = []
    const out_tag_list = []
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
  // const create_test_div = container.createDiv({cls:"setting_div"});  
  const create_test_button = buttonDiv.createEl("button",{
    text:"生成试卷",
    cls:"add_button",
  });  

  create_test_button.addEventListener("click", () => {  
    quiz_div.empty()
    this.create_test_page(quiz_div)
});  

  const quiz_div = container.createDiv({cls:"quiz_div"});  

  }

  check_tag(in_tag_div,out_tag_div,input_value){
    const in_tag_list = this.get_in_tag(in_tag_div)
    const out_tag_list = this.get_in_tag(out_tag_div)
    return(in_tag_list.includes(input_value)||out_tag_list.includes(input_value))
  }

  async create_in_tag(tag_div,tag){
    const td = tag_div.createDiv({
      cls:"in-tag",
      name : tag
    })
    const display_div = td.createDiv({
      cls:"tag-content"
    })
    display_div.createEl("span",{
      text:tag,
      cls:"tag-text"
    })
    td.addEventListener("click",()=>{
      td.remove()
    })
  }

  async create_tag(tag_div,tag){
    const td = tag_div.createDiv({
      cls:"in-tag",
      name : tag
    })
    const display_div = td.createDiv({
      cls:"tag-content"
    })
    display_div.createEl("span",{
      text:tag,
      cls:"tag-text"
    })
  }

  async create_out_tag(tag_div,tag){
    const td = tag_div.createDiv({
      cls:"out-tag",
      name : tag
    })
    const display_div = td.createDiv({
      cls:"tag-content"
    })
    display_div.createEl("span",{
      text:tag,
      cls:"tag-text"
    })
    td.addEventListener("click",()=>{
      td.remove()
    })
  }

  get_in_tag(in_tag_div){
    let in_list = []
    in_tag_div.querySelectorAll(".tag-text").forEach(tag=>{
      in_list.push(tag.innerText)
    })
    return(in_list)
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
        let li = u3.createEl("li")
        let a = li.createEl("a",{
          text:link_name,
          cls:"internal-link",
          href:"#",
        })
        a.addEventListener("click",()=>{
          this.openFileInNewLeaf(app,this.path+"/"+s)
        })
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
    let tl = [];  
    const test_list = [];  
    this.test_list.forEach(e => {  
        test_concat = test_concat.concat(e[3]);  
    });  

    // 收集所有的 Promise  
    const promises = test_concat.map(async ts => {  
        const tf = this.app.vault.getFileByPath(this.path + "/" + ts);  
        const text = await this.test_parse(tf);  
        const q = text["Q"];  
        const a = text["A"];  
        const d = text["D"];

        const test_info: test_info = {  
            id: ts,  
            tf: tf,  
            cls: read_property(this.path + "/" + ts, "class"),  
            mode: read_property(this.path + "/" + ts, "mode"),  
            q: q,  
            a: a,  
            d: d,
            // div: quiz_div 
        };  

      //   const test_info: test_info = {  
      //     id: ts,  
      //     tf: tf,  
      //     cls: read_property(this.path + "/" + ts, "class"),  
      //     mode: read_property(this.path + "/" + ts, "mode"),  
      //     q: q,  
      //     a: a,  
      //     d: d,
      //     div: quiz_div.createDiv({  
      //         cls: "quiz",  
      //         id: ts  
      //     })  
      // };  

        // const tes = new test(test_info);  
        tl.push(test_info);  
    });  

    // 等待所有 Promise 完成  
    await Promise.all(promises);  
    const leaves = this.app.workspace.getLeavesOfType(quiz);  

    const { workspace } = this.app;

    let leaf: WorkspaceLeaf | null = null;
    // const leaves = workspace.getLeavesOfType(test_generate);

    if (leaves.length > 0) {
      // A leaf with our view already exists, use that
      leaf = leaves[0];
    } else {
      // Our view could not be found in the workspace, create a new leaf
      // in the right sidebar for it
      leaf = workspace.getRightLeaf(false); // 修改这一行  
      await leaf.setViewState({ type: quiz, active: true });
    } 

    // "Reveal" the leaf in case it is in a collapsed sidebar
    workspace.revealLeaf(leaf);

    if (leaves.length > 0) {  
        const quizViewInstance = leaves[0].view; // 获取第一个实例  
        quizViewInstance.generate_quiz(tl) 
    }

    // console.log(tl); 
    // tl.forEach(async t=>{
    //   //console.log("hello")
    //   t.create_test_body()
    // })


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

  async tag_filter(testlist,include_tag_list,exclude_tag_lsit){
    let filter_list = []
    // console.log(filter_list,include_tag_list,exclude_tag_lsit)
    if(include_tag_list.length<1 && exclude_tag_lsit.length<1){
      filter_list = testlist
      return(filter_list)
    }
    if(include_tag_list.length>=1){
      testlist.forEach(id =>{
        // console.log(id)
        let file_tag_list = read_property(this.path+"/"+id,"tags")
        // console.log(file_tag_list)
        if(file_tag_list!=null){
        if(allElementsExist(include_tag_list, file_tag_list)){
          filter_list.push(id)
        }}
      })
    }
    if(exclude_tag_lsit.length>=1){
      testlist.forEach(id =>{
        // console.log(id)
        let file_tag_list = read_property(this.path+"/"+id,"tags")
        // console.log(file_tag_list)
        if(file_tag_list!=null){
        if(!allElementsExist(exclude_tag_lsit, file_tag_list)){
          filter_list.push(id)
        }}
      })
    }
    return(filter_list)
  }

  async fetch(req){ //废用
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
    let md_parse = this.parseMarkdownHeadings(plain_text)
    return(md_parse)
  }




  async onClose() {
    // Nothing to clean up.
  }



  areLettersInString(str:string, letters:any) {  
    // 将字符串转换为小写并分割成数组  
    const lowerStr = str.toLowerCase();  
    const strArray = lowerStr.split('');  

    // 将字母列表转换为小写  
    const lowerLetters = letters.map(letter => letter.toLowerCase());  

    // 检查字母个数是否相等  
    if (lowerLetters.length !== strArray.length) {  
        return false;  
    }  

    // 检查每个字母是否存在于字符串中  
    return lowerLetters.every(letter => strArray.includes(letter));  
  
} 

getFormattedTimestamp() {  
  const now = new Date();  
  const year = now.getFullYear();  
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始  
  const day = String(now.getDate()).padStart(2, '0');  
  const hours = String(now.getHours()).padStart(2, '0');  
  const minutes = String(now.getMinutes()).padStart(2, '0');  
  const seconds = String(now.getSeconds()).padStart(2, '0');  

  return `${year}-${month}-${day}-${hours}:${minutes}:${seconds}`;  
}    

openFileInNewLeaf(app: App, filePath: string) {  
  const file = app.vault.getAbstractFileByPath(filePath);  
  if (file instanceof TFile) {  
      app.workspace.openLinkText(file.basename, file.path, false);  
  } else {  
      console.error("File not found: ", filePath);  
  }  
}  

getalltags(){ //获取试题库文件夹下所有的tag
  const filelist = this.app.vault.getAbstractFileByPath(this.path); 
  // console.log(filelist)
  let all_tag_list = []
  filelist.children.forEach(tf=>{
    // console.log(tf.name)
    let metadata = this.app.metadataCache.getFileCache(tf);
    // console.log(tf.name)
    if(metadata?.frontmatter==null){
      // console.log(tf.name)
    }else{ 
    let front_matter = metadata.frontmatter
    if(front_matter.hasOwnProperty("tags") && front_matter.tags != null){
      front_matter.tags.forEach(tag =>{
        if(!all_tag_list.includes(tag)){
          all_tag_list.push(tag)
        }
      })
    }
  }})
  console.log(all_tag_list)
  return(all_tag_list)
}
}