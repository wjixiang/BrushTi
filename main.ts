import { Notice, Plugin, ItemView, WorkspaceLeaf ,Events} from "obsidian";
import {test_gnerate_view, test_generate} from "generate";
import { testdb } from "base";
import { log } from "console";

export default class brushtee extends Plugin {
  async onload() {
    const test1 = new testdb(app,this.manifest)
    alert(test1.testfile.length)

    this.registerView(
      test_generate,
      (leaf) => new test_gnerate_view(leaf)
    );

    this.addRibbonIcon('circle', 'active panel', () => {
      new Notice('active panel');
      this.activateView();
    });
  }



  async activateView() {
    const { workspace } = this.app;

    let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(test_generate);

    if (leaves.length > 0) {
      // A leaf with our view already exists, use that
      leaf = leaves[0];
    } else {
      // Our view could not be found in the workspace, create a new leaf
      // in the right sidebar for it
      leaf = workspace.getRightLeaf(false);
      await leaf.setViewState({ type: test_generate, active: true });
    }

    // "Reveal" the leaf in case it is in a collapsed sidebar
    workspace.revealLeaf(leaf);
  }
}
