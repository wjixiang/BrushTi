import { request } from "obsidian";

const POST = (requestURL:string, reqestData: object):Promise<string> => {
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

const GET = (requestURL:string):Promise<string> => {
    return request({  
      url:requestURL,  
      contentType: "application/x-www-form-urlencoded",
      method: "GET",
      headers: {  
          'Content-Type': 'application/json',  
      },  
      }  
    ); 
}

interface ReqestInf {
    POST: (requestURL:string, reqestData: object)=>Promise<string>;
    GET: (url:string)=>Promise<string>
}

const apiReqest:ReqestInf = {
    POST: POST,
    GET: GET
}


export default apiReqest