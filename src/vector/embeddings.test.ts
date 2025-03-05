import { CustomEmbeddings } from "./embeddings";
import * as dotenv from 'dotenv';
dotenv.config();

describe('CustomEmbeddings 集成测试', () => {
  let embeddings: CustomEmbeddings;

  beforeAll(() => {
    const apiKey = process.env.API_KEY;
    const baseURL = process.env.BASE_URL;
    if (!apiKey || !baseURL) {
      throw new Error('请设置 API_KEY 和 BASE_URL 环境变量，用于真实请求！');
    }
    embeddings = new CustomEmbeddings({ apiKey, baseURL });
  });

  test('embedText 应返回有效的嵌入向量', async () => {
    const text = 'Hello, OpenAI!';
    const embedding = await embeddings.embedText(text);
    expect(Array.isArray(embedding)).toBe(true);
    expect(embedding.length).toBeGreaterThan(0);
  });

  test('embedBatch 应返回与输入文本数量相对应的嵌入向量数组', async () => {
    const texts = ['Hello, world!', '这是一个测试。'];
    const embeddingsBatch = await embeddings.embedBatch(texts);
    expect(Array.isArray(embeddingsBatch)).toBe(true);
    expect(embeddingsBatch.length).toBe(texts.length);
    for (const emb of embeddingsBatch) {
      expect(Array.isArray(emb)).toBe(true);
      expect(emb.length).toBeGreaterThan(0);
    }
  });

  test('create 方法应返回正确的响应结构', async () => {
    const response = await embeddings.create({ input: '测试文本' });
    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('model');
    expect(response).toHaveProperty('object');
    expect(response).toHaveProperty('usage');
    expect(Array.isArray(response.data)).toBe(true);
  });
});
