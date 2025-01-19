import brushtee from "./main";
import { quizData } from "./components/Quiz";
import { FileSystemAdapter } from "obsidian";

export default class quizDB {
    plugin: brushtee;
    quizes: quizData[] = [];
    dbPath: string;
    
    constructor(plugin: brushtee){
        this.plugin = plugin
        this.dbPath = this.plugin.settings.bank_path
    }

    async load(){
        const quizFolder = this.plugin.app.vault.getFolderByPath(this.dbPath)
        console.log(quizFolder)
        if(quizFolder?.children){
            for(const quiz of quizFolder.children){
                try{
                    
                    const strData = await this.plugin.app.vault.adapter.read(quiz.path)
                    const cleanedJson = strData  
                        .replace(/^\uFEFF/, '')     // 移除BOM  
                        .replace(/\r\n/g, '')       // 移除所有换行  
                        .replace(/\s+/g, ' ')       // 标准化空格
                        .replace(/型题/g, '')  
                        .trim();  
                    const objData = JSON.parse(cleanedJson) as quizData
                    this.quizes.push(objData)
                    console.log(`loading ${this.quizes.length}/${quizFolder.children.length}`)
                }catch(err){
                    console.log(err)
                    continue;
                }
            }

        }
    }
}