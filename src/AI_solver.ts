import axios from 'axios';  

export interface OpenAIRequest {  
    model: string;  
    messages: Array<{ role: string; content: string }>;  
}  

export class OpenAIClient {  
    private apiUrl: string;  
    private apiKey: string;  

    constructor(apiUrl: string, apiKey: string) {  
        this.apiUrl = apiUrl;  
        this.apiKey = apiKey;  
    }  

    async callAPI(requestData: OpenAIRequest) {  
        try {  
            const response = await axios.post(this.apiUrl, requestData, {  
                headers: {  
                    'Authorization': `Bearer ${this.apiKey}`,  
                    'Content-Type': 'application/json',  
                },  
            });  
            return response.data;  
        } catch (error) {  
            console.error('Error calling OpenAI API:', error);  
            throw error;  
        }  
    }  

    get_content(response_data:object) {
        const choices = response_data.choices;  
        if (choices && choices.length > 0) {  
            return choices[0].message.content; // 返回第一个 choice 的消息内容  
        } else {  
            throw new Error('No choices found in the response.');  
        }
    }
}  

// 示例用法  
// const apiUrl = 'https://api.openai.com/v1/chat/completions'; // 自定义 API URL  
// const apiKey = 'your-api-key'; // 替换为你的 API 密钥  

// export const openAIClient = new OpenAIClient(apiUrl, apiKey);  
// const requestData: OpenAIRequest = {  
//     model: 'gpt-3.5-turbo',  
//     messages: [  
//         { role: 'user', content: 'Hello, how are you?' },  
//     ],  
// };  

// openAIClient.callAPI(requestData)  
//     .then(response => {  
//         console.log('OpenAI API response:', response);  
//     })  
//     .catch(error => {  
//         console.error('Error:', error);  
//     });