import { Notice, Plugin, ItemView, WorkspaceLeaf } from "obsidian";

export default class ExamplePlugin extends Plugin {
  async onload() {
    this.addRibbonIcon('circle', 'Greet', () => {
      new Notice('Hello, world!');
    });
  }
}
