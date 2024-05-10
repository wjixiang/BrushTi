import {App, Plugin,PluginManifest, TFile} from 'obsidian';



export class testdb extends Plugin {
    testfile: TFile[];
    //files = this.app.vault.getMarkdownFiles()
    constructor(app: App, manifest: PluginManifest){
        super(app,manifest)
        var files = app.vault.getMarkdownFiles();
        const targetTag = '#错题';

        this.testfile = files.filter(async (file) => {
            const content = await app.vault.read(file);
            return content.includes(targetTag);
        });
    }
}