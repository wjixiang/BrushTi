import { TFile } from "obsidian"

class fliter{
    // upper_tests_tf_set:TFile[]
    constructor(public upper_tests_tf_set:TFile[]){
        upper_tests_tf_set = upper_tests_tf_set
    }
}

export class times_fliter extends fliter{
    constructor(upper_tf_set:TFile[],private upper_times:Number,private lower_times:Number){
        super(upper_tf_set)
    }

    filter(){
        var filtered_tf_set: any[] = []
        let front_matter:object|null|undefined
        let times:Number
        this.upper_tests_tf_set.forEach(file=>{
            if (file instanceof TFile) {  
                front_matter = app.metadataCache.getFileCache(file).frontmatter["record"]
                if(front_matter!=null && front_matter!=undefined){
                    times = Number(Object.keys(front_matter).length)
                }else{
                    times = 0
                }
                
                if(this.lower_times<=times && times<=this.upper_times){
                    // console.log(file.name)
                    filtered_tf_set.push(file)
                }

                // console.log(times)

                times = 0
            }  
        })

        console.log(filtered_tf_set)
        return filtered_tf_set
    }
}