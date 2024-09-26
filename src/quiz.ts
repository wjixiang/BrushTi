import { ItemView, WorkspaceLeaf,TFile,MetadataCache,Events, Notice } from "obsidian";
import { test } from "./test";

export const quiz = "quiz-view";

export class quiz_view extends ItemView {
    path: string;
    test_list: never[];
    up_control_div:HTMLElement;
    quiz_div:HTMLElement;
    down_control_div:HTMLElement;
    constructor(leaf: WorkspaceLeaf,test_list: never[],path:string) {
      super(leaf);
      this.test_list = test_list
      this.path = path
      this.up_control_div = this.containerEl.children[1].createDiv({cls:"quiz-control-div"})
      this.quiz_div=this.containerEl.children[1].createDiv({cls:"quiz-div"})
      this.up_control_div = this.containerEl.children[1].createDiv({cls:"quiz-control-div"})
    }
  
    getViewType() {
      return quiz;
    }
  
    getDisplayText() {
      return "试卷";
    }

    protected async onOpen(): Promise<void> {
      // const container = this.containerEl.children[1];
      // container.empty();
      // const quiz_div = container.createDiv({cls:"quiz-div"})
      const reset_button = this.up_control_div.createEl("button",{
        text:"重置"
      })

      reset_button.addEventListener('click',()=>{
        this.quiz_div.empty()
      })
    }

    async generate_quiz(tl:any[],quiz_div:HTMLElement){

      tl.forEach(async t=>{
        t.div = this.quiz_div
        const tes = new test(t);  
        tes.create_test_body()
    })
    }
}