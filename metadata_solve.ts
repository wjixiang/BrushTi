import * as YAML from 'yaml';  
import { TFile } from 'obsidian';  

export async function parseYamlMetadata(file) {  
  if (!(file instanceof TFile)) {  
    throw new Error("Invalid input: expected a TFile instance");  
  }  

  const fileContent = await app.vault.read(file);  
  
  // 使用正则表达式提取 YAML metadata  
  const yamlMatch = fileContent.match(/^-{3}\r?\n([\s\S]*?)\r?\n-{3}/);  
    
  if (!yamlMatch || yamlMatch.length < 2) {  
    console.log("No YAML metadata found.");  
    return null;  
  }  

  // 获取 YAML 部分并解析  
  const yamlContent = yamlMatch[1];  
  
  try {  
    const metadata = YAML.parse(yamlContent); 
    //console.log("normal parsing YAML:", file.name);  
    return metadata; // 返回解析后的对象  
  } catch (e) {  
    console.error("Error parsing YAML:", file.name,e);  
    return null;  
  }  
}  

// 示例用法（在插件中调用）  
export async function processFile(file) {  
  const metadata = await parseYamlMetadata(file);  
  if (metadata) {  
    //console.log("Parsed Metadata:", metadata['class']);  
    return metadata
  }else{
    console.error("parse_error,void yaml:",file.name)
    return null
  }
}

// export async function get_suject_class(folderPath = 'test_bank') {  
//     let class_list = []
//     // 获取文件夹下的所有文件  
//     const folder = this.app.vault.getAbstractFileByPath(folderPath); 
//     if (folder && folder.children) {  
//       for (const file of folder.children) {  
//         if (file instanceof TFile) {  
//           let metadata = processFile(file)
//           // console.log(typeof(metadata))
//           console.log(metadata)
//           if ('class' in metadata && metadata['class']!=null){
//             console.log(metadata['class'])
//           }
//         }  
//       }  
//     }
// }