import { App,Menu,MenuItem,TFile, Notice,Plugin } from 'obsidian';

// 🚩--------定义全局变量--------
const imageExtensions: Set<string> = new Set(['jpeg', 'jpg', 'png', 'gif', 'svg', 'bmp']);
const SUCCESS_NOTICE_TIMEOUT = 1800;


interface Listener {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this: Document, ev: Event): any;
}

export default class MyPlugin extends Plugin {
// 当插件启用后
	async onload() {
		this.registerDocument(document); // 调用注册文档方法
		app.workspace.on("window-open", // 当打开编辑器窗口时，触发
		(workspaceWindow, window) => { 
			this.registerDocument(window.document);
		});
		// 🚩--------创建一个按钮--------
		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a settings tab so the user can configure various aspects of the plugin
		// this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log("页面被点击了");
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}
	onElement(
		el: Document,
		event: keyof HTMLElementEventMap,
		selector: string,
		listener: Listener,
		options?: { capture?: boolean; }
	) {
		el.on(event, selector, listener, options);
		return () => el.off(event, selector, listener, options);
	}
	// 注册文档，在图片上右键事件
	registerDocument(document: Document) {
		this.register(
        this.onElement(
          document,
          "contextmenu" as keyof HTMLElementEventMap,
          "img",
          this.onClick.bind(this)
        )
      )
	}
	onunload() {

	}

	

/**
 * 获取所有的图片文件TFile类型对象的数组
 * @param app 
 * @returns  attachments 包含图片文件File类型对象的数组 TFile[]
 */
getAllImageFilesList = (): TFile[] => {
	// 获取库中所有文件
	const allFiles: TFile[] = app.vault.getFiles();
	const attachments: TFile[] = [];
	for (let i = 0; i < allFiles.length; i++) {
		// 排除文件是.md文档的情况
		if (allFiles[i].extension !== "md") {
			// 判断是否是设定的图片文件，是就将图片放入新的数组attachments
			if (imageExtensions.has(allFiles[i].extension.toLowerCase())) {
				attachments.push(allFiles[i]);
			}
		}
	}
	// 返回 附件数组 attachments
	return attachments;
};

/**
 * 通过图片文件的全路径URL字符串 获取 图片的文件TFile类型对象
 * @param imageURL  图片的全路径字符串
 * @returns imageFile
 */
getFileViaFullURLOfImage = (imageURL: string): TFile[] =>{
	let imageFileFullPath: string;
	const fileList: TFile[] = [];
	const allImageFiles: TFile[] = this.getAllImageFilesList();
	allImageFiles.forEach((imageFile)=>{
		imageFileFullPath =  app.vault.getResourcePath(imageFile);
		if(imageURL===imageFileFullPath){
			// 如果当前图片URL 等于 通过图片文件获取的图片URL,则返回当前图片文件对象
			fileList.push(imageFile);
		}
	});
	return fileList;
}
/**
 * 用于获取图片文件附件的全路径 
 * 格式：app://local/D:/Projects/obsidian-plugin-dev/obsidian-plugin-dev/img/Pasted%20image%2020220924074354.png?1663976634713
 * @param imageFile 图片的TFile类型对象
 */
// getImageFileFullPath = (imageFile: TFile): string =>{
// 	const allImageFiles: TFile[] = this.getAllImageFilesList();
// 	// let imageFullPath: string;
// 	// const imagePath: string = imageFile.basename +"."+imageFile.extension;
// 	const filePath: string = app.vault.getResourcePath(imageFile);
// 	return filePath;
// }

getCurrentFileOfImage = (app: App) => {
	// 初始化TFile对象
	// const currentImageFile: TFile = new TFile();
	// 获取所有图片的文件的TFile类型数组
	const allImageFiles = this.getAllImageFilesList();
	allImageFiles.forEach((imageFile)=>{
		console.log("--------basename+extension--------");
		console.log(imageFile.basename+imageFile.extension);
	})
	// return currentImageFile;
}

/**
 * 注册按钮移出
 * @param menu 
 * @param document 
 */
registerEscapeButton(menu: Menu, document: Document = activeDocument) {
    menu.register(
      this.onElement(
        document,
        "keydown" as keyof HTMLElementEventMap,
        "*",
        (e: KeyboardEvent) => {
          if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            menu.hide();
          }
        }
      )
    );
  }

	/**
 * 鼠标点击事件
 */
onClick(event: MouseEvent) {
    event.preventDefault();
    // event.target 获取鼠标事件的目标（图片元素）
    const target = (event.target as Element);
    const imgType = target.localName;
    const menu = new Menu();
	let fileList: TFile[];
    switch (imgType) {
		// 当事件作用的目标元素是img标签时
      case "img": {
        const image = (target as HTMLImageElement).currentSrc;
		const imageDom = (target as HTMLImageElement);
		// console.log("imgType:" + imgType); // img
        const thisURL = new URL(image);
		fileList = this.getFileViaFullURLOfImage(image);
        const Proto = thisURL.protocol;
		// 当图片元素的协议是以下几种，则开始执行删除操作
        switch (Proto) {
          case "app:":
          case "data:":
          case "http:":
          case "https:":
            menu.addItem((item: MenuItem) =>
			// 设置一个图标 垃圾箱
              item.setIcon("trash")
                .setTitle("Delete image url and file")
                .onClick(async () => {
                  try {
					for (const file of fileList){
						// 删除图片的dom结构
						// 获取图片元素的父级div的父级div
						const parent_div: HTMLDivElement = imageDom.parentElement?.parentElement as HTMLDivElement;
						// 获取图片元素的父级div
						const parentOfimge: HTMLDivElement = imageDom.parentElement as HTMLDivElement; 
						parent_div.removeChild(parentOfimge);
						console.log("🚩--------parent_dic attributename--------:" + parent_div.getAttributeNames);
						// 删除图片
						await app.vault.trash(file, false);
						console.log("--图片--"+thisURL+"被删除了");
						new Notice("Image deleted from the file navigator !", SUCCESS_NOTICE_TIMEOUT);
					}
                  } catch {
                    new Notice("Error, could not deleye the image!");
                  }
                })
            )
            break;
          default:
            new Notice(`no handler for ${Proto} protocol`);
            return;
        }
        break;
      }
      default:
        new Notice("No handler for this image type!");
        return;
    }
	// 注册菜单按钮
    this.registerEscapeButton(menu);
    menu.showAtPosition({ x: event.pageX, y: event.pageY });
    this.app.workspace.trigger("obsidian-delete-image-via-context-menu:contextmenu", menu);
  }
}

