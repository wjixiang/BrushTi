import {App, Plugin,PluginManifest, TFile} from 'obsidian';



export class testdb extends Plugin {
    testfile: TFile[];
    //files = this.app.vault.getMarkdownFiles()
    constructor(app: App, manifest: PluginManifest){
        super(app,manifest)
        var files = app.vault.getMarkdownFiles();
        const targetTag = '#错题';
        // files.forEach(file => {
        //     var fileCache = this.app.metadataCache.getFileCache(file);
        //     var ftags = fileCache.tags
        //     if (ftags.tag.includes(targetTag)) {
        //         this.testfile.push(file);
        //     }
        // });
        this.testfile = this.getFilesByFrontmatterList('tags','#习题')
    }

    getFilesByTag(tag: string): TFile[] {
        const allFiles = this.app.vault.getMarkdownFiles();
        const taggedFiles: TFile[] = [];

        allFiles.forEach(file => {
            const fileCache = this.app.metadataCache.getFileCache(file);
            if (fileCache && fileCache.tags) {
                const tags = fileCache.tags.map(t => t.tag);
                if (tags.includes(tag)) {
                    taggedFiles.push(file);
                }
            }
        });

        return taggedFiles;
    }

    getFilesByFrontmatterList(key: string, value: string): TFile[] {
        const allFiles = this.app.vault.getMarkdownFiles();
        const matchedFiles: TFile[] = [];

        allFiles.forEach(file => {
            const fileCache = this.app.metadataCache.getFileCache(file);
            if (fileCache && fileCache.frontmatter && Array.isArray(fileCache.frontmatter[key])) {
                if (fileCache.frontmatter[key].includes(value)) {
                    matchedFiles.push(file);
                }
            }
        });

        return matchedFiles;
    }

}