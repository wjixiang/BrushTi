import { ItemView, MarkdownRenderer, WorkspaceLeaf, App, Modal, Setting } from "obsidian";
import { Plugin,FileManager} from "obsidian";

var answer = "NONE"
var filesWithTag = tag();
var select_t = getRandomElements(filesWithTag,1)
var timu = select_t[0]
var clas_t = []
var select_class = "病生"
var select_number = 3
var flag = 0

function getRandomElements(arr,n) {
    let result = [];
    let len = arr.length;
    let taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandomElements: more elements taken than available");
    while (n--) {
        let x = Math.floor(Math.random() * len);
        result.push(arr[x in taken ? taken[x] : x]);
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

function weight(filelist){ //返回安权重抽取的索引值
	let weight_list = [];
	let totalWeight = 0
	for(var i=0;i<filelist.length;i++){
		let wei_a = this.app.metadataCache.getFileCache(filelist[i]).frontmatter.times;
		let wei_b = this.app.metadataCache.getFileCache(filelist[i]).frontmatter.link;
		totalWeight = totalWeight + wei_b/wei_a
		weight_list.push(wei_b/wei_a)
	}

	let randomNum = Math.random() * totalWeight;
	let weightSum = 0;

	for (let i = 0; i < weight_list.length; i++) {
		weightSum += weight_list[i];
		if (randomNum <= weightSum) {
		  return i;
		}
	  }
}

function tag(){
	const tagName = '错题'; // 你指定的标签
	const markdownFiles = this.app.vault.getMarkdownFiles(); // 获取所有 Markdown 文件
	const filesWithTag = [];

	for (let file of markdownFiles) {
		const cache = this.app.metadataCache.getFileCache(file); // 获取文件缓存
		if (cache && cache.tags) { // 检查文件是否有标签
			for (let tag of cache.tags) {
				if (tag.tag.includes(`#${tagName}`)) { // 检查标签是否包含你指定的标签
					filesWithTag.push(file);
					break;
				}
			}
		}
	}
	return filesWithTag	
}

function classify(flist,clas){
	clas_t = []
	flist.forEach(note => {
		let properties = this.app.metadataCache.getFileCache(note).frontmatter; // 获取笔记的元数据
		if (properties && properties.class === clas) {
			// 这里是找到了一个符合条件的笔记，你可以根据需要进行操作
			//console.log(note.basename);
			clas_t.push(note)
		}
	});
	return clas_t;
}

export const VIEW_TYPE_EXAMPLE = "example-view";

export class ExampleView extends ItemView { //此处为创建一个view
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType() {
    return VIEW_TYPE_EXAMPLE;
  }

  getDisplayText() {
    return "BrushTi";
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.createEl("h1", { text: "wjx" });

	// 创建一个输入框和一个显示区域
	container.innerHTML = `
	<head>
		<style>
			button {
				font-size: 16px;
				border: none;
				border-radius: 5px;
				color: white;
			}
			#tn {
				background-color: #4CAF50;
			}
			#dn {
				background-color: #008CBA;
			}
			#tz {
				background-color: #f44336;
			}
			#t, #f {
				background-color: #555555;
			}
			#note-content {
				padding: 15px;
				color: #87CEEB;
				border-radius: 5px;
				box-shadow: 0 2px 5px rgba(0,0,0,0.3);
			}
			#note-answer {
				padding: 15px;
				color: #87CEEB;
				border-radius: 5px;
				box-shadow: 0 2px 5px rgba(0,0,0,0.3);
			}
			.button-container {
				display: flex;
				justify-content: space-between;
				width: 100%;
			  }
		</style>
	</head>
	<body>
		<input type="text" id="class">
        <input type="text" id="number">
		<button id="tn">抽题</button>
		</br>
		<br/>
		<p id="note-content"></p>
		<p id="note-answer"></p>
		<div class="button-container">
		<button id="dd">✅</button>
		<button id="dn">答案</button>
		<button id="tz">跳转</button>
		<button id="cc">❌</button>
	  </div>
		<div id="markdown-output"></div>
	</body>
	
	`;

	// 添加事件监听器来处理按钮点击
	// const button = container.querySelector("#load-note");
	// button.addEventListener("click", async () => {
	// 	const noteName = container.querySelector("#note-path").value;
	// 	const note = this.app.vault.getAbstractFileByPath(noteName);//注意需要根据路径来打开笔记
	// 	const content = this.app.vault.read(note);
	// 	//const markdownRendered = await this.app.markdownRenderer.render(content);
	// 	//container.querySelector("#markdown-output").innerHTML = markdownRendered;

	// 	this.app.vault.read(note).then(content => {
	// 		container.querySelector("#note-content").textContent = content;//这段代码可以获得笔记的内容后，将其输出到note-content框中
	// 		console.log(content)
	// 		var text = content.replace(/(\n|\r|\r\n|\u21b5)/g, '<br/>');
	// 		container.querySelector("#note-content").innerHTML = text
	// 	});
	// 	this.app.workspace.openLinkText(note.basename, note.path, true);
	// });

	const button2 = container.querySelector("#tn");
	button2.addEventListener("click", async () => {
		select_class = container.querySelector("#class").value;
        select_number = container.querySelector("#number").value;
		filesWithTag = classify(tag(),select_class); //获得指定科目的所有题目
		//select_t = getRandomElements(filesWithTag,1)

		timu = filesWithTag[weight(filesWithTag)]
        timu = timu.slice(0,select_number);

        flag = 0
		//timu = select_t[0] //根据权重进行抽选

		var content = this.app.vault.read(timu).then(content => {
			// 假设 markdown 是你的 Markdown 字符串
			let markdown = content;
			// 使用正则表达式匹配 ad-question 代码块
			let match = markdown.match(/```ad-question([^`]+)```/);
			let codeBlock = match[1];
			// 分割代码块为行
			let lines = codeBlock.split('\n');
			// 移除 "title" 行
			lines = lines.filter(line => !line.startsWith('title:'));
			// 合并剩余的行
			var result = lines.join('\n');
			//console.log(result); // 输出结果
			var text = result.replace(/(\n|\r|\r\n|\u21b5)/g, '<br/>');
			container.querySelector("#note-content").innerHTML = text
		});
		// console.log(select_t[0])
		var answe = this.app.vault.read(timu).then(content => {
			// 假设 markdown 是你的 Markdown 字符串
			let markdown = content;
			// 使用正则表达式匹配 ad-question 代码块
			let match = markdown.match(/```ad-note([^`]+)```/);
			let codeBlock = match[1];
			// 分割代码块为行
			let lines = codeBlock.split('\n');
			// 移除 "title" 行
			lines = lines.filter(line => !line.startsWith('collapse:'));
			lines = lines.filter(line => !line.startsWith('title:'));
			// 合并剩余的行
			var result = lines.join('\n');
			//console.log(result); // 输出结果
			answer = result.replace(/(\n|\r|\r\n|\u21b5)/g, '<br/>');
			// container.querySelector("#note-content").innerHTML = text
		});
		container.querySelector("#note-answer").innerHTML = ""
	});

	const button3 = container.querySelector("#dn");
	button3.addEventListener("click", async () => {
		container.querySelector("#note-answer").innerHTML = answer
	});

	const button4 = container.querySelector("#tz");
	button4.addEventListener("click", async () => {
		this.app.workspace.openLinkText(timu.basename,timu.path, true);
	});

	const button5 = container.querySelector("#dd");
	button5.addEventListener("click", async () => {
		let cache = this.app.metadataCache.getFileCache(timu)
		let wrong_times = cache.frontmatter.link
		let sum_times = cache.frontmatter.times
		console.log(wrong_times)
		//cache.frontmatter.times = String(2)
		//timu.vault.modify(timu,cache.frontmatter);
		//timu.file.saveFrontmatter(cache.frontmatter)
		this.app.fileManager.processFrontMatter(timu, (frontmatter) => {
			frontmatter.times = sum_times+1; // 修改元数据
			return frontmatter;
		});
		select_class = container.querySelector("#class").value;
		filesWithTag = classify(tag(),select_class); //获得指定科目的所有题目
		//select_t = getRandomElements(filesWithTag,1)

		timu = filesWithTag[weight(filesWithTag)]

		//timu = select_t[0] //根据权重进行抽选

		var content = this.app.vault.read(timu).then(content => {
			// 假设 markdown 是你的 Markdown 字符串
			let markdown = content;
			// 使用正则表达式匹配 ad-question 代码块
			let match = markdown.match(/```ad-question([^`]+)```/);
			let codeBlock = match[1];
			// 分割代码块为行
			let lines = codeBlock.split('\n');
			// 移除 "title" 行
			lines = lines.filter(line => !line.startsWith('title:'));
			// 合并剩余的行
			var result = lines.join('\n');
			//console.log(result); // 输出结果
			var text = result.replace(/(\n|\r|\r\n|\u21b5)/g, '<br/>');
			container.querySelector("#note-content").innerHTML = text
		});
		// console.log(select_t[0])
		var answe = this.app.vault.read(timu).then(content => {
			// 假设 markdown 是你的 Markdown 字符串
			let markdown = content;
			// 使用正则表达式匹配 ad-question 代码块
			let match = markdown.match(/```ad-note([^`]+)```/);
			let codeBlock = match[1];
			// 分割代码块为行
			let lines = codeBlock.split('\n');
			// 移除 "title" 行
			lines = lines.filter(line => !line.startsWith('collapse:'));
			lines = lines.filter(line => !line.startsWith('title:'));
			// 合并剩余的行
			var result = lines.join('\n');
			//console.log(result); // 输出结果
			answer = result.replace(/(\n|\r|\r\n|\u21b5)/g, '<br/>');
			// container.querySelector("#note-content").innerHTML = text
		});
		container.querySelector("#note-answer").innerHTML = ""
	});

	const button6 = container.querySelector("#cc");
	button6.addEventListener("click", async () => {
		let cache = this.app.metadataCache.getFileCache(timu)
		let wrong_times = cache.frontmatter.link
		let sum_times = cache.frontmatter.times
		console.log(wrong_times)
		//cache.frontmatter.times = String(2)
		//timu.vault.modify(timu,cache.frontmatter);
		//timu.file.saveFrontmatter(cache.frontmatter)
		this.app.fileManager.processFrontMatter(timu, (frontmatter) => { // 修改元数据
			frontmatter.link = wrong_times+1;
			return frontmatter;
		});
		select_class = container.querySelector("#class").value;
		filesWithTag = classify(tag(),select_class); //获得指定科目的所有题目
		//select_t = getRandomElements(filesWithTag,1)

		timu = filesWithTag[weight(filesWithTag)]

		//timu = select_t[0] //根据权重进行抽选

		var content = this.app.vault.read(timu).then(content => {
			// 假设 markdown 是你的 Markdown 字符串
			let markdown = content;
			// 使用正则表达式匹配 ad-question 代码块
			let match = markdown.match(/```ad-question([^`]+)```/);
			let codeBlock = match[1];
			// 分割代码块为行
			let lines = codeBlock.split('\n');
			// 移除 "title" 行
			lines = lines.filter(line => !line.startsWith('title:'));
			// 合并剩余的行
			var result = lines.join('\n');
			//console.log(result); // 输出结果
			var text = result.replace(/(\n|\r|\r\n|\u21b5)/g, '<br/>');
			container.querySelector("#note-content").innerHTML = text
		});
		// console.log(select_t[0])
		var answe = this.app.vault.read(timu).then(content => {
			// 假设 markdown 是你的 Markdown 字符串
			let markdown = content;
			// 使用正则表达式匹配 ad-question 代码块
			let match = markdown.match(/```ad-note([^`]+)```/);
			let codeBlock = match[1];
			// 分割代码块为行
			let lines = codeBlock.split('\n');
			// 移除 "title" 行
			lines = lines.filter(line => !line.startsWith('collapse:'));
			lines = lines.filter(line => !line.startsWith('title:'));
			// 合并剩余的行
			var result = lines.join('\n');
			//console.log(result); // 输出结果
			answer = result.replace(/(\n|\r|\r\n|\u21b5)/g, '<br/>');
			// container.querySelector("#note-content").innerHTML = text
		});
		container.querySelector("#note-answer").innerHTML = ""
	});
  }

  async onClose() {
    // Nothing to clean up.
  }
}

export default class ExamplePlugin extends Plugin { //此处为启动设置
  async onload() {
	//this.app.emulateMobile(false);
    this.registerView(//注册视图
      VIEW_TYPE_EXAMPLE,
      (leaf) => new ExampleView(leaf)
    );

    this.addRibbonIcon("dice", "Activate view", () => {
      this.activateView();
	  console.log("start")

	//   this.app.workspace.getLeaf().setViewState({
	// 	type: VIEW_TYPE_EXAMPLE,
	// 	active: true,
	//   });
    });

    this.addCommand({
        id: 'exam',
        name: 'exam',
        callback: async() => {
            new chouti(this.app).open();
        }
        })

  }

  async onunload() {
  }

  async activateView() {
	let { workspace }  = this.app;

	let leaf: WorkspaceLeaf | null = null;
	let leaves = workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE);

	if (leaves.length > 0) {
		// A leaf with our view already exists, use that
		leaf = leaves[0];
	} else {
		// Our view could not be found in the workspace, create a new leaf
		// in the right sidebar for it
		let leaf = workspace.getRightLeaf(false);
		await leaf.setViewState({ type: VIEW_TYPE_EXAMPLE, active: true });
	}

	// "Reveal" the leaf in case it is in a collapsed sidebar
    workspace.revealLeaf(leaf);
  }
}

export class chouti extends Modal {
    kemu: string;
    tishu: string;
    onSubmit: (result: string) => void;
  
    constructor(app: App, onSubmit: (result: string) => void) {
      super(app);
      this.onSubmit = onSubmit;
    }
  
    onOpen() {
      const {contentEl}  = this;
  
      contentEl.createEl("h1", { text: "组卷:" });

      new Setting(contentEl)
      .setName("科目")
      .addText((text) =>
        text.onChange((value) => {
          this.kemu = value
        }));

        new Setting(contentEl)
        .setName("题数")
        .addText((text) =>
          text.onChange((value) => {
            this.tishu = value
          }));

        new Setting(contentEl)
        .addButton((btn) =>
        btn
            .setButtonText("Submit")
            .setCta()
            .onClick(() => {
            this.close();
            this.onSubmit(this.kemu);
            }));
    

    }
  
    onClose() {
      let { contentEl } = this;
      contentEl.empty();
    }
  }