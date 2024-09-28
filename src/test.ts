import { TFile,MarkdownRenderer,App,Notice} from "obsidian"
import React from 'react';  
import { read_property } from "./generate";


interface MyComponentProps {  
    title: string;  
    onClick: () => void;  
}  

const MyComponent: React.FC<MyComponentProps> = () => {  
    return ("");  
};  


export default MyComponent;

export interface test_info{
    tf: TFile,
    cls: string,
    mode: string,
    q:string,
    a:string, 
    d:string,
    div:HTMLElement,
    answer:any[],
}

export class test implements test_info{
    tf:TFile;
    cls: string;
    mode: string;
    q:string;
    a:string;
    div:HTMLElement;
    state: number;
    standard_answer: string[]|string;
    answer: any[];
    reveal_button:HTMLElement;
    answer_select_div:HTMLElement;
    d:string;
    constructor(test_info:test_info){
        this.tf = test_info.tf
        this.cls = test_info.cls
        this.mode = test_info.mode
        this.q = test_info.q
        this.a = test_info.a
        this.div = test_info.div.createDiv({  
          cls: "quiz",  
          id:test_info.tf.name
      }) 
        this.d = test_info.d
    }

    create_test_body(){
        const des_div = this.div.createDiv({
            cls:"q_des"
        })
        // console.log(des_div)
    
        const t_link = des_div.createEl('a',{
            text:this.tf.name
        })

        des_div.createEl('p',{
            text:this.cls+" · "+this.mode,
            cls:"des_text"
        }) 

        t_link.addEventListener("click",()=>{
        this.openFileInNewLeaf(app,this.tf.path)
        })

        //
        const q_div = this.div.createDiv({
        cls:"q-div" 
        })

        //MarkdownRenderer.render(app,this.q,q_div,this.tf.path,this.div,MyComponent)
             /////////////////////////////////////////////////////////
      //原始html转换
      let pt = this.q.split("\n")
      const regex = /!\[\[.*?\]\]/;
      const reg_extract = /(?<=!\[\[)[^\]]+(?=\]\])/g
      pt.forEach(p=>{
        if(regex.test(p)){//显示图片 
          let sub_p = p.split(p.match(regex)[0])
          const pic_embed_name = p.match(reg_extract)[0]
          console.log(pic_embed_name)
          
          const file = app.vault.getFiles()
          const pic_file = file.find(f => f.name === pic_embed_name);
          console.log(`File path: ${pic_file.path}`);

          q_div.createEl("p",{text:sub_p[0]})
          q_div.createEl('span',{
            cls:"q-span"
          }) 

          const pic_embed = q_div.createEl("img") 
          pic_embed.src = app.vault.getResourcePath(pic_file);  

          q_div.createEl("p",{text:sub_p[1]})
          q_div.createEl('span',{
            cls:"q-span"
          }) 
        }else{
        // q_div.createEl("p",{text:p})
        MarkdownRenderer.render(app,p,q_div,this.tf.path,this.div,MyComponent)
        q_div.createEl('span',{
          cls:"q-span"
        }) 
        }

        // MarkdownRenderer.render(app,p,q_div,this.tf.path,this.div,MyComponent)
        // console.log(p)
        // q_div.createEl('span',{
        //   cls:"q-span"
        // }) 

      })
      /////////////////////////////////////////////////////////////////
        

        if (this.mode=='A1'||this.mode =='A2'){
            this.B_control()
          }else if(this.mode == "X"){
            this.X_control(this)
          }else if(this.mode =="B"||this.mode == "A3"){
            this.B_control()
          }
    
    }

    openFileInNewLeaf(app: App, filePath: string) {  
        const file = app.vault.getAbstractFileByPath(filePath);  
        if (file instanceof TFile) {  
            app.workspace.openLinkText(file.basename, file.path, false);  
        } else {  
            console.error("File not found: ", filePath);  
        }  
      }  

    async A1_control(t:any){
        //转化标准答案
          this.standard_answer = this.a.replace(" ","")
    
        //创建单选栏
        this.create_single_select(t)
        //创建控制栏
        const quiz_control_div = t.div.createDiv({
          cls:"control_div"
        }) 
    
        const toggle_button_div = quiz_control_div.createDiv({
          cls:"toggle-button-div"
        })
    
        this.create_reveal_button(quiz_control_div)
    
        this.reveal_button.addEventListener("click",() =>{
          if(this.state==0){
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

        t.toggle_input.addEventListener("click", () => {  
          t.toggle_input.classList.toggle("active");  
          const isActive = t.toggle_input.innerText === "选择模式";  
          t.toggle_input.setText(isActive ? "输入模式" : "选择模式");  
          // t.input_from_state.setText(`状态: ${isActive ? "选择模式" : "输入模式"}`);  
    
          if(isActive){
            this.answer_select_div.empty()
            t.answer_input = this.answer_select_div.createEl('input',{
              text:"输入选项"
            });
          }else{
            this.answer_select_div.empty()
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
            t.answer_bow[option.value] = this.answer_select_div.createEl('input');  
            t.answer_bow[option.value].type = 'radio';  
            t.answer_bow[option.value].name = t.id; // 同组单选框名称  
            t.answer_bow[option.value].value = option.value; // 设置单选框的值  
    
            // 创建标签元素  
            const radioLabel = this.answer_select_div.createEl('label');  
            radioLabel.textContent = option.label; // 设置标签文本  
       });
          }
      });  
      }
      
    async X_control(t:any){
        this.standard_answer = this.a.replace(" ","")
        this.state = 0
        this.answer_select_div = this.div.createDiv({
            cls:'answer_select'
        })
        this.create_multi_select()
        const quiz_control_div = t.div.createDiv({
          cls:"control_div"
        })
        this.create_reveal_button(quiz_control_div)
    
        this.reveal_button.addEventListener("click",()=>{
          if(this.state==0){
            this.answer = this.getSelectedCheckboxValues()
            console.log(this.answer)
            if(this.areLettersInString(this.standard_answer,this.answer)){
              this.state =  1
              this.right()
            }else{
              this.state =  2
              this.wrong()
            }
    
          }else{
            new Notice("已提交",1000)
          }
        })
      }

    async B_control(){
        const standard_answer = this.a.replace(/[^a-zA-Z]/g,"")
        this.standard_answer = standard_answer.split("")
        console.log(this.standard_answer)
        this.state = 0  
        const dx_option: { A: number; B: number; C: number; D: number; E: number; }[] = []
        
        
        this.answer_select_div = this.div.createDiv({
            cls:'answer_select'
        })

        //创建选择区
        for(let i=1;i<=this.standard_answer.length;i++){
          dx_option.push(this.single_select(this.answer_select_div,i))
        }
        //创建提交按钮
        const quiz_control_div = this.div.createDiv({
          cls:"control_div"
        })
        this.create_reveal_button(quiz_control_div)
    
        this.reveal_button.addEventListener("click",()=>{
          let ans:  any[]
          ans = []
          dx_option.forEach(sgroup=>{
            ans.push(this.get_single_select_answer(sgroup))
          })
      
          console.log(ans)
          if(ans.includes(0)){
            new Notice("当前题目未完成",1000)
            
          }else{
            if(this.state == 0){
              this.answer = ans
              //判断正误
              if(this.arraysEqual(this.answer,this.standard_answer)){
                this.right()
              }else{
                this.wrong()
              }
          }else{
            new Notice("已作答",1000)
          }
          }
                
        })
    
      }

    arraysEqual(arr1: string | any[], arr2: string | any[]) {  
        // 首先检查长度是否相等  
        if (arr1.length !== arr2.length) {  
            return false;  
        }  
      
        // 检查每个元素是否相等  
        for (let i = 0; i < arr1.length; i++) {  
            // 如果元素是数组，递归比较  
            if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {  
                if (!this.arraysEqual(arr1[i], arr2[i])) {  
                    return false;  
                }  
            } else if (arr1[i] !== arr2[i]) {  
                return false;  
            }  
        }  
      
        return true; // 如果所有检查都通过，返回 true  
      }

    async create_multi_select(){
        this.answer_select_div.empty()
        this.answer_select_div.style.display = 'flex';  
        this.answer_select_div.style.flexDirection = 'row';  
        this.answer_select_div.style.alignItems = 'center'; // 垂直居中对齐  
        this.answer_select_div.style.gap = '10px';
    
        const options = ['A', 'B', 'C', 'D', 'E'];  
    
        options.forEach(option => {  
            const checkboxContainer = document.createElement('div');  
            checkboxContainer.className = 'flex items-center';  
    
            const checkbox = document.createElement('input');  
            checkbox.type = 'checkbox';  
            checkbox.id = this.tf.name;  
            checkbox.value = option;  
    
            const label = document.createElement('label');  
            label.htmlFor = option;  
            label.innerText = option;  
            label.className = 'ml-2';  
    
            checkboxContainer.appendChild(checkbox);  
            checkboxContainer.appendChild(label);  
            this.answer_select_div.appendChild(checkboxContainer);  
        });  
      }
    
    getSelectedCheckboxValues() {  
        const checkboxes = this.answer_select_div.querySelectorAll('input[type="checkbox"]:checked');  
        const selectedValues = Array.from(checkboxes).map(checkbox => checkbox.value);  
        return selectedValues;  
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
      this.answer_select_div.empty()
    
      options.forEach(option => {  
        // 创建一个单选框元素  
        t.answer_bow[option.value] = this.answer_select_div.createEl('input');  
        t.answer_bow[option.value].type = 'radio';  
        t.answer_bow[option.value].name = t.id; // 同组单选框名称  
        t.answer_bow[option.value].value = option.value; // 设置单选框的值  
    
        // 创建标签元素  
        const radioLabel = this.answer_select_div.createEl('label');  
        radioLabel.textContent = option.label; // 设置标签文本  
    });
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

    create_reveal_button(quiz_control_div){
        const reveal_button_div = quiz_control_div.createDiv({
          cls:"reveal-button-div"
        })
    
        this.reveal_button = reveal_button_div.createEl('button',{
          text:"提交",
          cls:"reveal-button"
        })
      }

      async right(){
        new Notice("回答正确✅",1000)
        this.reveal_answer()
        this.lock_option()
        this.right_change()
        this.state = 1
        this.append_record()
      }
    
      async wrong(){
        new Notice("回答错误❌",1000)
        this.reveal_answer()
        this.lock_option()
        this.wrong_change()
        this.state = 2
        this.append_record()
      }

      async reveal_answer(){ 
        this.div.createEl("hr")
        this.div.createEl("p",{
          cls:"standard-answer",
          text:this.standard_answer  
        })
        //reveal tags
        let tag_display_div = this.div.createDiv({
          cls:"tag-display" 
        })
        let file_tag_list = read_property(this.tf.path,"tags")
        // console.log(file_tag_list)
        if(file_tag_list!=null){
          file_tag_list.forEach(tag=>{
            this.create_tag(tag_display_div,tag) 
          })
        }
        // this.div.createEl("hr")
        // const discus = this.div.createDiv()
        // console.log(this.d)
        // MarkdownRenderer.render(app,this.d,discus,this.tf.path,this.div,MyComponent)

      }
    
      async lock_option(){
        this.answer_select_div.createDiv({ 
          cls:"locker"
        })
        // const checkboxes = this.answer_select_div.querySelectorAll('input[type="checkbox"]'); 
        // checkboxes.forEach(box=>{
        //   box.disabled = true
        // })
        // for(const opt in t.answer_bow){
        //   t.answer_bow[opt].disabled = true
        // }
        // t.toggle_input.disabled = true
        // t.answer_input.disabled = true
      }

      async right_change(){
        // new Notice("回答正确",1000)
        this.state = 1
          //change color
        this.div.setAttribute('style', 'border-color: green;');
      }
    
      async wrong_change(){
        // new Notice("回答错误",1000)
        this.state = 2
         //change color
        this.div.setAttribute('style', 'border-color: red;');
      }
    
      async color_change(){
        if(this.state==1){
          this.div.setAttribute('style', 'border-color: green;');
        }
        if(this.state==2){
          this.div.setAttribute('style', 'border-color: red;');
        }
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

    async append_record(){
        // console.log(this.path+"/"+t.id)
        // const content = this.app.vault.getAbstractFileByPath(this.path+"/"+t.id);
        // console.log(content)
        app.fileManager.processFrontMatter(this.tf,(frontmatter)=>{
          let record = read_property(this.tf.path,"record")
          const timestamps = this.getFormattedTimestamp()
          let score = 1
          if(this.state==1){
            score = 0
          }else{
            score = 1
          }
          if(record==null){
            frontmatter['record'] = [{
              timestamps:timestamps,
              score:score}]
          }else{
            record.push({
              timestamps:timestamps,
              score:score})
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

} 