import { ItemView, WorkspaceLeaf,TFile,MetadataCache,Events, Notice ,Plugin,FileManager,App, getAllTags,MarkdownRenderer} from "obsidian";
import { test_info,test } from "./test";


export const test_generate = "test-view";

export function read_property(filepath,property){
  const tf = this.app.vault.getFileByPath(filepath)
  let metadata = this.app.metadataCache.getFileCache(tf);
  let front_matter = metadata.frontmatter
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
    dropdownDiv.createEl("p",{text:"科目"})
    setting.createEl("hr")
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
    const mode_select_div = setting.createDiv({cls:"setting_div"});  
    setting.createEl("hr")

    mode_select_div.createEl("p",{text:"题型"})

    const mode_select_Box = mode_select_div.createEl("select", {  
      cls: "brushti_mode_select", // Optional: Add a custom class for styling  
    }); 

    const tagDiv = setting.createDiv({cls:"setting_div"});
    setting.createEl("hr")
    tagDiv.createEl("p",{text:"标签"})
    const tag_rule_div = tagDiv.createDiv({cls:"tag-rule"})
    const tag_set_div = tag_rule_div.createDiv()
    const tag_input_div = tag_set_div.createDiv()
    const tag_input = tag_input_div.createEl('input',{
      cls:"test-number-input"
    })
    const tag_suggest = tag_input_div.createDiv()
    const tag_in = tag_set_div.createEl('button',{
      text:"包含"
    })
    const tag_out = tag_set_div.createEl('button',{
      text:"排除"
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
    numberDiv.createEl("p",{text:"题数"})

    const numberInputBox = numberDiv.createEl("input", {  
      type: "number", // 设置输入类型为数字  
      cls: "test-number-input",  
      value:1
  }); 

    const max_num = numberDiv.createEl("button",{
      text:"MAX"
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
    text:"生成试卷"
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

        const test_info: test_info = {  
            id: ts,  
            tf: tf,  
            cls: read_property(this.path + "/" + ts, "class"),  
            mode: read_property(this.path + "/" + ts, "mode"),  
            q: q,  
            a: a,  
            div: quiz_div.createDiv({  
                cls: "quiz",  
                id: ts  
            })  
        };  

        const tes = new test(test_info);  
        tl.push(tes);  
    });  

    // 等待所有 Promise 完成  
    await Promise.all(promises);  
    console.log(tl); 
    tl.forEach(async t=>{
      console.log("hello")
      t.create_test_body()
      // console.log(t)
      // let text =  await this.test_parse(t.tf)
      // t.q = text["Q"]
      // t.a = text["A"]
      // t.state = 0 //0:未提交；1：回答正确；2：回答错误
      // t.answer = null
      // t.div = quiz_div.createDiv({
      //   cls:"quiz",
      //   id:t.id
      //})
      //

      // t.des_div = t.div.createDiv({
      //   cls:"q_des"
      // })

      // const t_link = t.des_div.createEl('a',{
      //   text:t.id
      // })

      // t.des_div.createEl('p',{
      //   text:t.cls+" · "+t.mode,
      //   cls:"des_text"
      // }) 

      // t_link.addEventListener("click",()=>{
      //   this.openFileInNewLeaf(app,this.path+"/"+t.id)
      // })

      // //
      // t.q_div = t.div.createDiv({
      //   cls:"q_div"
      // })

      // MarkdownRenderer.render(this.app,t.q,t.q_div,t.path,t.q_div)
      /////////////////////////////////////////////////////////
      //原始html转换
      // let pt = t.q.split("\n")
      // const regex = /!\[\[.*?\]\]/;
      // const reg_extract = /(?<=!\[\[)[^\]]+(?=\]\])/g
      // pt.forEach(p=>{
      //   if(regex.test(p)){//显示图片
      //     let sub_p = p.split(p.match(regex)[0])
      //     const pic_embed_name = p.match(reg_extract)[0]
      //     console.log(pic_embed_name)
          
      //     const file = this.app.vault.getFiles()
      //     const pic_file = file.find(f => f.name === pic_embed_name);
      //     console.log(`File path: ${pic_file.path}`);

      //     t.q_div.createEl("p",{text:sub_p[0]})
      //     t.q_div.createEl('br')

      //     const pic_embed = t.q_div.createEl("img")
      //     pic_embed.src = this.app.vault.getResourcePath(pic_file);  

      //     t.q_div.createEl("p",{text:sub_p[1]})
      //     t.q_div.createEl('br')
      //   }else{
      //   t.q_div.createEl("p",{text:p})
      //   t.q_div.createEl('br')
      //   }
      // })
      /////////////////////////////////////////////////////////////////

      // t.answer_select_div = t.div.createDiv({
      //   cls:'answer_select'
      // })

      //input control zone

      // if (t.mode=='A1'||t.mode =='A2'){
      //   this.A1_control(t)
      // }else if(t.mode == "X"){
      //   this.X_control(t)
      // }else if(t.mode =="B"||t.mode == "A3"){
      //   this.B_control(t)
      // }

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

  async right_change(t){
    // new Notice("回答正确",1000)
    t.state = 1
      //change color
    t.div.setAttribute('style', 'border-color: green;');
  }

  async wrong_change(t){
    // new Notice("回答错误",1000)
    t.state = 2
     //change color
    t.div.setAttribute('style', 'border-color: red;');
  }

  async color_change(t:any){
    if(t.state==1){
      t.div.setAttribute('style', 'border-color: green;');
    }
    if(t.state==2){
      t.div.setAttribute('style', 'border-color: red;');
    }
  }

  async lock_option(t){
    t.answer_select_div.createDiv({
      cls:"locker"
    })
    const checkboxes = t.answer_select_div.querySelectorAll('input[type="checkbox"]'); 
    checkboxes.forEach(box=>{
      box.disabled = true
    })
    for(const opt in t.answer_bow){
      t.answer_bow[opt].disabled = true
    }
    t.toggle_input.disabled = true
    t.answer_input.disabled = true
  }

  async onClose() {
    // Nothing to clean up.
  }

  async reveal_answer(t){
    t.div.createEl("hr")
    t.div.createEl("p",{
      cls:"standard-answer",
      text:t.standard_answer
    })
    //reveal tags
    let tag_display_div = t.div.createDiv({
      cls:"tag-display"
    })
    let file_tag_list = read_property(this.path+"/"+t.id,"tags")
    // console.log(file_tag_list)
    if(file_tag_list!=null){
      file_tag_list.forEach(tag=>{
        this.create_tag(tag_display_div,tag)
      })
    }
  }

  async A1_control(t:any){
    //转化标准答案
      t.standard_answer = t.a.replace(" ","")

    //创建单选栏
    this.create_single_select(t)
    //创建控制栏
    t.quiz_control_div = t.div.createDiv({
      cls:"control_div"
    })

    t.toggle_button_div = t.quiz_control_div.createDiv({
      cls:"toggle-button-div"
    })

    this.create_reveal_button(t)

    t.reveal_button.addEventListener("click",() =>{
      if(t.state==0){
        //get input method
        if(t.toggle_input.innerText=="选择模式"){
          // console.log(t.answer_bow)
          for(const opt in t.answer_bow){
            // console.log(opt)
            if(t.answer_bow[opt].checked){
              console.log(t.answer_bow[opt].value)
              t.answer = t.answer_bow[opt].value
            }                
          }
          if(t.answer==null){
            new Notice("未作答",1000)
          }else{
             const standard_answer = t.a.replace(" ","")
             if(standard_answer == t.answer){
              this.right(t)
             }else{
              this.wrong(t)
             }
              //lock option
          }
          
        }else{
          const answer = t.answer_input.value.replace(" ","")
          console.log("input answer:",answer)
          //judge answer
          if(answer.toUpperCase() == t.a.replace(" ","").toUpperCase()){
            this.right(t)
          }else{
            this.wrong(t)
          }
        }
      }else{
        new Notice("已提交",1000);
      }
    })

    t.toggle_input = t.toggle_button_div.createEl('button',{
      text:"选择模式",
      cls:"toggle-button"
    })
  //   t.input_from_state = t.quiz_control_div.createEl("span", {  
  //     text: "选择模式", // 初始状态  
  //     cls: "toggle-state"  
  // }); 

    t.toggle_input.addEventListener("click", () => {  
      t.toggle_input.classList.toggle("active");  
      const isActive = t.toggle_input.innerText === "选择模式";  
      t.toggle_input.setText(isActive ? "输入模式" : "选择模式");  
      // t.input_from_state.setText(`状态: ${isActive ? "选择模式" : "输入模式"}`);  

      if(isActive){
        t.answer_select_div.empty()
        t.answer_input = t.answer_select_div.createEl('input',{
          text:"输入选项"
        });
      }else{
        t.answer_select_div.empty()
        const options = [  
          { value: 'A', label: 'A' },  
          { value: 'B', label: 'B' },  
          { value: 'C', label: 'C' },
          { value: 'D', label: 'D' },
          { value: 'E', label: 'E' } 
      ];  

      t.answer_bow = {
        A:0,
        B:0,
        C:0,
        D:0,
        E:0
      }
      options.forEach(option => {  
        // 创建一个单选框元素  
        t.answer_bow[option.value] = t.answer_select_div.createEl('input');  
        t.answer_bow[option.value].type = 'radio';  
        t.answer_bow[option.value].name = t.id; // 同组单选框名称  
        t.answer_bow[option.value].value = option.value; // 设置单选框的值  

        // 创建标签元素  
        const radioLabel = t.answer_select_div.createEl('label');  
        radioLabel.textContent = option.label; // 设置标签文本  
   });
      }
  });  
  }
  
  async X_control(t:any){
    t.standard_answer = t.a.replace(" ","")
    t.state = 0
    this.create_multi_select(t)
    t.quiz_control_div = t.div.createDiv({
      cls:"control_div"
    })
    this.create_reveal_button(t)

    t.reveal_button.addEventListener("click",()=>{
      if(t.state==0){
        t.answer = this.getSelectedCheckboxValues(t)
        console.log(t.answer)
        if(this.areLettersInString(t.standard_answer,t.answer)){
          new Notice("回答正确",1000)
          t.state =  1
          this.right(t)
        }else{
          new Notice("回答错误",1000)
          t.state =  2
          this.wrong(t)
        }

      }else{
        new Notice("已提交",1000)
      }
    })
  }

  async B_control(t:any){
    t.standard_answer = t.a.replace(/[^a-zA-Z]/g,"")
    t.standard_answer = t.standard_answer.split("")
    console.log(t.standard_answer)
    t.state = 0  
    t.dx_option = []
    t.answer = []

    //创建选择区
    for(let i=1;i<=t.standard_answer.length;i++){
      t.dx_option.push(this.single_select(t.answer_select_div,i))
    }
    //创建提交按钮
    t.quiz_control_div = t.div.createDiv({
      cls:"control_div"
    })
    this.create_reveal_button(t)

    t.reveal_button.addEventListener("click",()=>{
      if(t.state == 0){
      t.answer=[]
      t.dx_option.forEach(sgroup=>{
        t.answer.push(this.get_single_select_answer(sgroup))
      })
      console.log(t.answer)

      if(t.answer.includes(0)){
        new Notice("当前题目未完成",1000)
      }else{
        console.log(t.answer)
        //判断正误
        if(arraysEqual(t.answer,t.standard_answer)){
          this.right(t)
        }else{
          this.wrong(t)
        }
      }
    }else{
      new Notice("已作答",1000)
    }
      

    })

  }

  async create_single_select(t:any){
    const options = [  
      { value: 'A', label: 'A' },  
      { value: 'B', label: 'B' },  
      { value: 'C', label: 'C' },
      { value: 'D', label: 'D' },
      { value: 'E', label: 'E' } 
  ];  

  t.answer_bow = {
    A:0,
    B:0,
    C:0,
    D:0,
    E:0
  }
  t.answer_select_div.empty()

  options.forEach(option => {  
    // 创建一个单选框元素  
    t.answer_bow[option.value] = t.answer_select_div.createEl('input');  
    t.answer_bow[option.value].type = 'radio';  
    t.answer_bow[option.value].name = t.id; // 同组单选框名称  
    t.answer_bow[option.value].value = option.value; // 设置单选框的值  

    // 创建标签元素  
    const radioLabel = t.answer_select_div.createEl('label');  
    radioLabel.textContent = option.label; // 设置标签文本  
});
  }

  single_select(ssdiv:any,id){
    const options = [  
      { value: 'A', label: 'A' },  
      { value: 'B', label: 'B' },  
      { value: 'C', label: 'C' },
      { value: 'D', label: 'D' },
      { value: 'E', label: 'E' } 
  ]; 
    let answer_bow = {
      A:0,
      B:0,
      C:0,
      D:0,
      E:0
    }
    const dx_div = ssdiv.createDiv({cls:"dx-div"})
    const dx_div_p = dx_div.createDiv()
    dx_div_p.createEl("p",{
      text:id+". "
    })
    const dx_div_s = dx_div.createDiv({cls:"dx-s"})
    options.forEach(option=>{
     answer_bow[option.value] = dx_div_s.createEl('input',{
        type:'radio',
        value:option.value
      });
      answer_bow[option.value].name = id
      const radioLabel = dx_div_s.createEl('label');  
      radioLabel.textContent = option.label; // 设置标签文本  
    })
    return(answer_bow)
  }

  get_single_select_answer(answer_bow){
    console.log(answer_bow)
    for(const opt in answer_bow){
      if(answer_bow[opt].checked){
        // console.log(answer_bow[opt])
        return(answer_bow[opt].value)
      }
    }
    return(0)
  }

  async create_multi_select(t:any){
    t.answer_select_div.empty()
    t.answer_select_div.style.display = 'flex';  
    t.answer_select_div.style.flexDirection = 'row';  
    t.answer_select_div.style.alignItems = 'center'; // 垂直居中对齐  
    t.answer_select_div.style.gap = '10px';

    const options = ['A', 'B', 'C', 'D', 'E'];  

    options.forEach(option => {  
        const checkboxContainer = document.createElement('div');  
        checkboxContainer.className = 'flex items-center';  

        const checkbox = document.createElement('input');  
        checkbox.type = 'checkbox';  
        checkbox.id = t.id;  
        checkbox.value = option;  

        const label = document.createElement('label');  
        label.htmlFor = option;  
        label.innerText = option;  
        label.className = 'ml-2';  

        checkboxContainer.appendChild(checkbox);  
        checkboxContainer.appendChild(label);  
        t.answer_select_div.appendChild(checkboxContainer);  
    });  
  }

  getSelectedCheckboxValues(t:any) {  
    const checkboxes = t.answer_select_div.querySelectorAll('input[type="checkbox"]:checked');  
    const selectedValues = Array.from(checkboxes).map(checkbox => checkbox.value);  
    return selectedValues;  
}  

  create_reveal_button(t:any){
    t.reveal_button_div = t.quiz_control_div.createDiv({
      cls:"reveal-button-div"
    })

    t.reveal_button = t.reveal_button_div.createEl('button',{
      text:"提交",
      cls:"reveal-button"
    })
  }

  async right(t){
    new Notice("回答正确✅",1000)
    this.reveal_answer(t)
    this.lock_option(t)
    this.right_change(t)
    t.state = 1
    this.append_record(t)
  }

  async wrong(t){
    new Notice("回答错误❌",1000)
    this.reveal_answer(t)
    this.lock_option(t)
    this.wrong_change(t)
    t.state = 2
    this.append_record(t)
  }

   async append_record(t){
    // console.log(this.path+"/"+t.id)
    // const content = this.app.vault.getAbstractFileByPath(this.path+"/"+t.id);
    // console.log(content)
    this.app.fileManager.processFrontMatter(t.tf,(frontmatter)=>{
      let record = read_property(this.path+"/"+t.id,"record")
      const timestamps = this.getFormattedTimestamp()
      let score = 1
      if(t.state==1){
        score = 0
      }else{
        score = 1
      }
      if(record==null){
        frontmatter['record'] = [{
          timestamps:timestamps,
          score:score}]
      }else{
        record.push([{
          timestamps:timestamps,
          score:score}])
        frontmatter['record'] = record
      }
    })
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