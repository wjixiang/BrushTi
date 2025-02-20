import { request } from "obsidian";

const apiReqest = (requestURL:string, reqestData: object) => {
    return request({  
      url:requestURL,  
      contentType: "application/x-www-form-urlencoded",
      body: JSON.stringify({reqestData}),
      method: "POST",
      headers: {  
          'Content-Type': 'application/json',  
      },  
      }  
    ); 
}

export default apiReqest