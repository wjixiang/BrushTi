import brushtee from "./main";
import { quizData } from "./components/Quiz";
import { FileSystemAdapter } from "obsidian";
import { MongoClient } from "mongodb";
import { btsettings } from "./setting";
import { string } from 'yaml/dist/schema/common/string';

interface mongoDBSettings {

}

export default class quizDB {
    quizes: quizData[] = [];
    client: MongoClient;

    async connectToDatabase(mongodbURL: string) {
        this.client = new MongoClient(mongodbURL)

        try {
            await this.client.connect();
            console.log('成功连接到 MongoDB');
            return ({success: true})
        } catch (error) {
            console.error('连接 MongoDB 失败:', error);
            throw error
        } 
    }

    async closeDatabase(){
        try {
            await this.client.close();
            console.log('成功关闭 MongoDB');
            return ({success: true})
        } catch (error) {
            console.error('关闭 MongoDB 失败:', error);
            throw error
        }
    }
  
}