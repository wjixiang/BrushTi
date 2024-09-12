import requests  

def chat_with_gpt(api_url, api_key, prompt):  
    headers = {  
        'Content-Type': 'application/json',  
        'Authorization': f'Bearer {api_key}'  
    }  
    
    data = {  
        'model': 'gpt-4o',  # 或者使用其他可用的模型  
        'messages': [  
            {'role': 'system', 'content': 'You are a format converter.'},  
            {'role': 'user', 'content': prompt}  
        ]  
    }  
    
    response = requests.post(api_url, headers=headers, json=data)  
    
    if response.status_code != 200:  
        raise Exception(f"Error: {response.status_code}, {response.text}")  
    
    return response.json()['choices'][0]['message']['content']  

# 使用示例  
api_url = 'https://www.gptapi.us/v1/chat/completions'  # 自定义API地址  
api_key = 'sk-0SghhgFMzyNOoRwG981eDcFbEeCa4aEa9c1b831bDc73360b'  # 替换为您的API密钥  


def ai(input_content):
    try:  
        response = chat_with_gpt(api_url, api_key, input_content)  
        print(response)  
        return response
    except Exception as e:  
        print(e)  

def a1_test_convert():
    test_row = ""
    answer_row = ""
    with open('./tool/test_row.md','r') as f:
        test_row = f.read()

    print(test_row)
    user_input = f"不提供解释，修正格式，题目与题目间由2个换行符分隔:\n{test_row}"

    test = ai(user_input)

    with open("./tool/test.md",'w') as f:
        f.write(test)


def answer_convert():
    test_row = ""
    answer_row = ""
    with open('./tool/answer_row.md','r') as f:
        answer_row = f.read()

    print(answer_row)

    answer = ai(f"不提供解释，转为markdown有序列表:\n{answer_row}")

    print(answer)
    with open("./tool/answer.md",'w') as f:
        f.write(answer)

# answer_convert()