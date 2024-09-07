import re  

def retain_only_letters(input_string):  
    # 使用正则表达式替换非字母字符  
    result = re.sub(r'[^a-zA-Z]', '', input_string)  
    return result  

# 示例  
input_string ="""1. A 2. C 3. C 4. A 5. C 6. C 7. D 8. B 9. C 10. D

11. D 12. E 13. A 14. C 15. C 16. D 17. A 18. D 19. B 20.B
21. E 22. C 23. C 24. B 25. E 26. E 27. A 28. D 29. A 30. B

31. B 32. A 33. B 34. D 35. E
【A2 型题
36. A 37. D 38. D 39. C 40. E 41. C 42. D 43. E 44. D 45. C

46. D 47. D 48. A 49. B 50. B 51. C 52. D 53. A 54. A 55. E
""" 

answer = """A


C


C


A


C


C


D


B


C


D


D


E


A


C


C


D


A


D


B


B


E


C


C


E


E


A


D


B


B


C


A


C


D


E


A


D


D


C


E


C


C


C


E


D


C


D


E


D


B


E


C


D


B


E"""

answer = answer.replace("\n","")


output_string = retain_only_letters(input_string)  
st_answer = ""
for num,i in enumerate(output_string):
    st_answer = st_answer+str(num)+i+" "

n_answer = ""
for num,i in enumerate(answer):
    n_answer = st_answer+str(num)+i+" "
print(st_answer)  # 输出: HelloWorld

print(n_answer)