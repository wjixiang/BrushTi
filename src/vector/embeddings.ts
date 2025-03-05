import axios from 'axios';

export interface EmbeddingResponse {
  data: {
    embedding: number[];
    index: number;
    object: string;
  }[];
  model: string;
  object: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

export interface EmbeddingRequest {
  model: string;
  input: string | string[];
}

export class CustomEmbeddings {
  private apiKey: string;
  private baseURL: string;
  private model: string;

  constructor(config: { apiKey: string; baseURL: string; model?: string }) {
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL;
    this.model = config.model || 'text-embedding-ada-002';
  }

  /**
   * 创建文本嵌入
   */
  async create(params: { input: string | string[]; model?: string }): Promise<EmbeddingResponse> {
    const model = params.model || this.model;
    const input = Array.isArray(params.input) ? params.input : [params.input];

    try {
      const response = await axios.post(
        `${this.baseURL}/embeddings`,
        { model, input },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      return response.data as EmbeddingResponse;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`API request failed: ${error.response?.data?.message || error.message}`);
      }
      if (error instanceof Error) {
        throw new Error(`Failed to create embedding: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * 创建单个文本的嵌入向量
   */
  async embedText(text: string): Promise<number[]> {
    const response = await this.create({ input: text })
    return response.data[0].embedding;
  }

  /**
   * 批量创建文本嵌入向量
   */
  async embedBatch(texts: string[]): Promise<number[][]> {
    const response = await this.create({ input: texts });
    return response.data.map(item => item.embedding);
  }
}
