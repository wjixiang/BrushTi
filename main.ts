import { Notice, Plugin, ItemView, WorkspaceLeaf ,Events} from "obsidian";
import {ExampleView, VIEW_TYPE_EXAMPLE} from "./randomtest";
import { testdb } from "base";
import { log } from "console";

export default class brushtee extends Plugin {
  async onload() {
    const test1 = new testdb(app,this.manifest)
    alert(test1.testfile)

    this.registerView(
      VIEW_TYPE_EXAMPLE,
      (leaf) => new ExampleView(leaf)
    );

    this.addRibbonIcon('circle', 'active panel', () => {
      new Notice('active panel');
      this.activateView();
    });
  }



  async activateView() {
    const { workspace } = this.app;

    let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE);

    if (leaves.length > 0) {
      // A leaf with our view already exists, use that
      leaf = leaves[0];
    } else {
      // Our view could not be found in the workspace, create a new leaf
      // in the right sidebar for it
      leaf = workspace.getRightLeaf(false);
      await leaf.setViewState({ type: VIEW_TYPE_EXAMPLE, active: true });
    }

    // "Reveal" the leaf in case it is in a collapsed sidebar
    workspace.revealLeaf(leaf);
  }
}
