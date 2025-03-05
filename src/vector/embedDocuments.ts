import { MongoClient } from 'mongodb';
import { CustomEmbeddings } from './embeddings';
import pLimit from 'p-limit';

interface EmbedDocumentsParams {
  mongoUri: string;
  dbName: string;
  collectionName: string;
  // 需要嵌入文本的字段列表
  fields: string[];
  // CustomEmbeddings 的配置信息
  embeddingConfig: { apiKey: string; baseURL: string; model?: string };
}

/**
 * 将指定collection内的所有documents全部 embed，并支持并发处理
 * @param params 
 */
export async function embedDocumentsInCollection(params: EmbedDocumentsParams): Promise<void> {
  const { mongoUri, dbName, collectionName, fields, embeddingConfig } = params;
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    console.log('已连接到 MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // 实例化嵌入服务
    const embeddingService = new CustomEmbeddings(embeddingConfig);

    // 使用 p-limit 控制并发数
    const limit = pLimit(100);
    const tasks: Promise<void>[] = [];

    // 使用 for await 遍历游标
    for await (const doc of collection.find({})) {
      if (!doc) continue;

      tasks.push(limit(async () => {
        // 如果当前记录已有向量数据，则跳过
        if (doc.embedding) {
          console.log(`记录 _id ${doc._id} 已存在 embedding，跳过。`);
          return;
        }

        // 从指定字段中提取用于嵌入的文本
        const texts: string[] = [];
        for (const field of fields) {
          if (doc[field]) {
            texts.push(String(doc[field]));
          }
        }
        if (texts.length === 0) {
          console.warn(`记录 _id ${doc._id} 不包含需要嵌入的字段，跳过。`);
          return;
        }
        const textToEmbed = texts.join(' ');

        try {
          // 调用 CustomEmbeddings 生成嵌入向量
          const embeddingVector = await embeddingService.embedText(textToEmbed);
          // 更新文档，将生成的向量写入 embedding 字段中
          await collection.updateOne({ _id: doc._id }, { $set: { embedding: embeddingVector } });
          console.log(`记录 _id ${doc._id} 更新了 embedding。`);
        } catch (error) {
          console.error(`处理记录 _id ${doc._id} 时出错：`, error);
        }
      }));
    }

    await Promise.all(tasks);
  } catch (error) {
    console.error('连接 MongoDB 或处理记录时出错：', error);
  } finally {
    await client.close();
    console.log('MongoDB 连接已关闭');
  }
}


///////////
const embedA1: EmbedDocumentsParams = {
  mongoUri: 'mongodb://localhost:27017/',
  dbName: 'QuizBank',
  collectionName: 'a1',
  fields: ['question', 'options', 'analysis', 'answer', 'class', 'unit'],
  embeddingConfig: {
    apiKey: 'sk-qEWCkRNZDHKcTf1vCc9846Cf7693404dAc99C5F6F6B178Cd',
    baseURL: 'https://api.gptapi.us/v1',
    model: "text-embedding-3-small"
  }
}

embedDocumentsInCollection(embedA1)