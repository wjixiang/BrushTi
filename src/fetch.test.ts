import axios from "axios";

describe("dd",()=>{

    const API_URL = 'http://localhost:3000/api';  
    const TEST_ID = '67b404695b0f51c620b0ee7d'; // 替换为实际的测试文档ID  
    const TEST_LINK = '67b404615b0f51c620cccc7';  


    it.skip("get data", async()=>{
        const data = await axios.get(`http://localhost:3000/api/quiz?cls=${encodeURIComponent("内科学")}&quizNum=${10}`)
        console.log(data.data)
    },30000)

    it("add link", async()=>{
        console.log('开始测试添加链接...');  

  try {  
    // 发送请求  
    const response = await axios.put(  
      `${API_URL}/addlink/${TEST_ID}`,  
      { link: TEST_LINK },  
      {  
        headers: {  
          'Content-Type': 'application/json',  
        },  
      }  
    );  

    // 检查响应  
    if (response.data.success) {  
      console.log('✅ 测试成功！');  
      console.log('响应数据:', response.data);  
    } else {  
      console.log('❌ 测试失败！');  
    }  

  } catch (error: any) {  
    console.log('❌ 测试出错！');  
    if (error.response) {  
      // 服务器返回错误  
      console.log('错误状态:', error.response.status);  ;  
    } else if (error.request) {  
      // 请求发送失败  
      console.log('请求失败:', error.message);  
    } else {  
      // 其他错误  
      console.log('错误:', error.message);  
    }  
  }  
    },10000)

    it("get link", async()=>{
        const response = await axios.get(`${API_URL}/addlink/${TEST_ID}`)
        console.log(response.data)
    },10000)
})