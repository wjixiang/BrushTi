import { ItemView, WorkspaceLeaf } from "obsidian";

export const test_generate = "test-view";

export class test_gnerate_view extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType() {
    return test_generate;
  }

  getDisplayText() {
    return "随机抽题";
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.createEl("h4", { text: "main panel" });
  }

  async onClose() {
    // Nothing to clean up.
  }
}