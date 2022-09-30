import { Menu,MenuItem,TFile, Notice,Plugin } from 'obsidian';
import { NathanDeleteImageSettingsTab } from './settings';
import { NathanDeleteImageSettings, DEFAULT_SETTINGS } from './settings';

// 🚩--------定义全局变量--------
const imageExtensions: Set<string> = new Set(['jpeg', 'jpg', 'png', 'gif', 'svg', 'bmp']);
const SUCCESS_NOTICE_TIMEOUT = 1800;


interface Listener {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this: Document, ev: Event): any;
}

export default class NathanDeleteImage extends Plugin {
	// 将插件选项作为 插件主类的属性
    settings: NathanDeleteImageSettings ;
	// 当插件启用后
	async onload() {
		console.log("Delete Image In Use plugin loaded...") 
		// 添加插件选项
        this.addSettingTab(new NathanDeleteImageSettingsTab(this.app, this));
		// 加载插件选项
        await this.loadSettings();
		this.registerDocument(document); // 调用注册文档方法
		app.workspace.on("window-open", // 当打开编辑器窗口时，触发
		(workspaceWindow, window) => { 
			this.registerDocument(window.document);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}
	// 当插件禁用后
	onunload() {
		console.log("Delete Image In Use plugin unloaded...")
	
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

	// 加载插件选项 设置
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }
	// 保存插件选项 设置
	async saveSettings() {
        await this.saveData(this.settings);
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
    const deleteOption = this.settings.deleteOption;
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
                .setTitle("Delete Image In Use url and file")
                .onClick(async () => {
                  try {
					for (const file of fileList){
						// start 删除图片的dom结构
						// 获取图片元素的父级div的父级div
						const parent_div: HTMLDivElement = imageDom.parentElement?.parentElement as HTMLDivElement;
						// 获取图片元素的父级div
						const parentOfimge: HTMLDivElement = imageDom.parentElement as HTMLDivElement; 
						parent_div.removeChild(parentOfimge);
						console.log("🚩--------parent_dic attributename--------:" + parent_div.getAttributeNames);
						// end 删除图片的dom结构
						if (deleteOption === '.trash') {
							// 删除图片
							await app.vault.trash(file, false);
							console.log("--图片--"+thisURL+"被删除了");
							new Notice("Image moved to Obsidian Trash !", SUCCESS_NOTICE_TIMEOUT);
						} else if (deleteOption === 'system-trash') {
							// 删除图片
							await app.vault.trash(file, true);
							console.log("--图片--"+thisURL+"被删除了");
							new Notice("Image moved to System Trash !", SUCCESS_NOTICE_TIMEOUT);
						} else if (deleteOption === 'permanent') {
							// 删除图片
							await app.vault.delete(file);
							console.log("--图片--"+thisURL+"被删除了");
							new Notice("Image deleted Permanently !", SUCCESS_NOTICE_TIMEOUT);
						}
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
    this.app.workspace.trigger("nn-delete-image-in-use:contextmenu", menu);
  }
}

