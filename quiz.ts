import { ItemView, WorkspaceLeaf,TFile,MetadataCache,Events, Notice } from "obsidian";

export const new_test = "quiz-view";

export class quiz_view extends ItemView {
    path: string;
    constructor(leaf: WorkspaceLeaf,test_list: never[]) {
      super(leaf);
      this.path = 'test_bank'
      this.test_list = []
    }
  
    getViewType() {
      return new_test;
    }
  
    getDisplayText() {
      return "随机抽题";
    }
}