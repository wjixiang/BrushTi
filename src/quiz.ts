import { ItemView, WorkspaceLeaf,TFile,MetadataCache,Events, Notice } from "obsidian";

export const quiz = "quiz-view";

export class quiz_view extends ItemView {
    path: string;
    test_list: never[];
    constructor(leaf: WorkspaceLeaf,test_list: never[],path:string) {
      super(leaf);
      this.test_list = test_list
      this.path = path
    }
  
    getViewType() {
      return quiz;
    }
  
    getDisplayText() {
      return "试卷";
    }
}