import re
from datetime import datetime  
from ai_process import a1_test_convert,answer_convert

class convertor:
    with open("./tool/test.md","r") as f:
        text = f.read()

    with open("./tool/answer.md","r") as f:
        answer = f.read()

    def __init__(self,clas,mode,tag) -> None:
        self.text = text
        self.answer = answer
        self.clas = clas
        self.tag = tag
        

text = ""
answer = ""

clas = "内科学" 
mode = "A1"
tag = ["习题","章节-胃食管反流病","人卫习题集"]

######
a1_test_convert()
answer_convert()
#####
with open("./tool/test.md","r") as f:
    text = f.read()

with open("./tool/answer.md","r") as f:
    answer = f.read()

# 获取当前时间  
now = datetime.now()  

# 格式化为 yyyy-m-d-H-s  
timestamp = now.strftime("%Y-%m-%d-%H-%S")  

def retain_only_letters(input_string):  #提取不连续的答案

    pattern = r'[^a-zA-Z]+'  

    result = re.split(pattern, input_string)  
    # 过滤掉空字符串  
    result = [s for s in result if s]  
    # result = re.sub(r'[^a-zA-Z]', '', input_string)  
    return result  

test_extract = text.split("\n\n")
answer = retain_only_letters(answer)
tag_string = ""
for i in tag:
    tag_string = tag_string+"  - "+i+"\n"

for i in range(len(test_extract)):
    id = timestamp + "-" + str(i)+".md"
    path = "./tool/extract_result/"
    markdown_content = f"""---
class: {clas}
mode: {mode}
tags:
{tag_string}
---

# Q
{test_extract[i]}
# A
{answer[i]}
# D
"""
    with open(path+id,"w",encoding="utf-8") as md:
        md.write(markdown_content) 

    print("id:",id,"\n",test_extract[i],"\n答案：",answer[i],"\n-----------\n")

