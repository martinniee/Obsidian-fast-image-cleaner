import { App, TFile, Notice, Plugin} from "obsidian";

// 🚩--------定义全局变量--------
const imageExtensions: Set<string> = new Set([
	"jpeg",
	"jpg",
	"png",
	"gif",
	"svg",
	"bmp",
]);
const SUCCESS_NOTICE_TIMEOUT = 1800;

interface Listener {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(this: Document, ev: Event): any;
}

export default class MyPlugin extends Plugin {
	// 当插件启用后
	async onload() {
		this.registerDocument(document); // 调用注册文档方法
		app.workspace.on(
			"window-open", // 当打开编辑器窗口时，触发
			(workspaceWindow, window) => {
				this.registerDocument(window.document);
			}
		);
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			console.log("delete image on hover 插件 被启用了 ");
		});
		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}
	// 定义一个在元素上的函数
	onElement(
		el: Document,
		event: keyof HTMLElementEventMap,
		selector: string,
		listener: Listener,
		options?: { capture?: boolean }
	) {
		el.on(event, selector, listener, options);
		return () => el.off(event, selector, listener, options);
	}

	// 注册文档
	registerDocument(document: Document) {
		this.register(
			this.onElement(
				document,
				"mouseover" as keyof HTMLElementEventMap,
				"img",
				this.onMouseover.bind(this)
			)
		);
	}
	onunload() {}

	/**
	 * 
	 * @param parentNode 目标元素（被删除的元素）的父级元素
	 * @param targetNode 目标元素（被删除的元素）
	 */
	removeImageDOM = (parentNode: HTMLElement, targetNode: HTMLElement) => {
		parentNode.removeChild(targetNode);
	};
	/**
	 * 删除 “删除图片按钮”
	 */
	deleteButton = ()=>{
		const btn_delete: HTMLButtonElement = document.querySelector(".btn-delete") as HTMLButtonElement;
		btn_delete.parentElement?.removeChild(btn_delete);
	}
	/**
	 * 用于获取动态生成的删除按钮 btn_delete
	 * @returns 删除按钮元素的对象
	 */
	getDynamicDeleteButton = (): HTMLElement => {
		const btn_delete: HTMLElement = document.createElement("button");
		btn_delete.setAttribute("class","btn-delete");
		// 将svg作为按钮子元素，并作为按钮的图标显示
		btn_delete.innerHTML ='<svg fill="#ff0000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="48px" height="48px"><path d="M 28 7 C 25.243 7 23 9.243 23 12 L 23 15 L 13 15 C 11.896 15 11 15.896 11 17 C 11 18.104 11.896 19 13 19 L 15.109375 19 L 16.792969 49.332031 C 16.970969 52.510031 19.600203 55 22.783203 55 L 41.216797 55 C 44.398797 55 47.029031 52.510031 47.207031 49.332031 L 48.890625 19 L 51 19 C 52.104 19 53 18.104 53 17 C 53 15.896 52.104 15 51 15 L 41 15 L 41 12 C 41 9.243 38.757 7 36 7 L 28 7 z M 28 11 L 36 11 C 36.552 11 37 11.449 37 12 L 37 15 L 27 15 L 27 12 C 27 11.449 27.448 11 28 11 z M 19.113281 19 L 44.886719 19 L 43.212891 49.109375 C 43.153891 50.169375 42.277797 51 41.216797 51 L 22.783203 51 C 21.723203 51 20.846109 50.170328 20.787109 49.111328 L 19.113281 19 z M 32 23.25 C 31.033 23.25 30.25 24.034 30.25 25 L 30.25 45 C 30.25 45.966 31.033 46.75 32 46.75 C 32.967 46.75 33.75 45.966 33.75 45 L 33.75 25 C 33.75 24.034 32.967 23.25 32 23.25 z M 24.642578 23.251953 C 23.677578 23.285953 22.922078 24.094547 22.955078 25.060547 L 23.652344 45.146484 C 23.685344 46.091484 24.462391 46.835938 25.400391 46.835938 C 25.421391 46.835938 25.441891 46.835938 25.462891 46.835938 C 26.427891 46.801938 27.183391 45.991391 27.150391 45.025391 L 26.453125 24.939453 C 26.419125 23.974453 25.606578 23.228953 24.642578 23.251953 z M 39.355469 23.251953 C 38.388469 23.224953 37.580875 23.974453 37.546875 24.939453 L 36.849609 45.025391 C 36.815609 45.991391 37.571109 46.801938 38.537109 46.835938 C 38.558109 46.836938 38.578609 46.835938 38.599609 46.835938 C 39.537609 46.835938 40.314656 46.091484 40.347656 45.146484 L 41.044922 25.060547 C 41.078922 24.094547 40.321469 23.285953 39.355469 23.251953 z" /></svg>';
		return btn_delete;
	};
	
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
	getFileObjectViaFullURLOfCurrentImage = (imageURL: string): TFile[] => {
		let imageFileFullPath: string;
		const fileList: TFile[] = [];
		const allImageFiles: TFile[] = this.getAllImageFilesList();
		allImageFiles.forEach((imageFile) => {
			imageFileFullPath = app.vault.getResourcePath(imageFile);
			if (imageURL === imageFileFullPath) {
				// 如果当前图片URL 等于 通过图片文件获取的图片URL,则返回当前图片文件对象
				fileList.push(imageFile);
			}
		});
		return fileList;
	};
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
		allImageFiles.forEach((imageFile) => {
			console.log("--------basename+extension--------");
			console.log(imageFile.basename + imageFile.extension);
		});
		// return currentImageFile;
	};

	/**
	 * 注册鼠标移出
	 * @param img
	 * @param document
	 */
	registerMouseout(img: HTMLImageElement, document: Document = activeDocument) {
		this.register(
			this.onElement(
				document,
				"mouseout" as keyof HTMLElementEventMap,
				"img",
				(e: MouseEvent) => {
					console.log("鼠标移出去到图片:");
					this.deleteButton();
				}
			)
		);
	}

	/**
	 * 鼠标移入
	 * @param event 事件
	 * @returns 
	 */
	onMouseover(event: MouseEvent) {
		event.preventDefault();
		// event.target 获取鼠标事件的目标（图片元素）
		const target = event.target as Element;
		const imgType = target.localName;
		let fileList: TFile[];
		switch (imgType) {
			// 当事件作用的目标元素是img标签时
			case "img": {
				const image = (target as HTMLImageElement).currentSrc;
				const imageDOM = target as HTMLImageElement;
				const thisURL = new URL(image);
				console.log("鼠标移入到图片:" + thisURL);
				fileList = this.getFileObjectViaFullURLOfCurrentImage(image);
				const Proto = thisURL.protocol;
				// 🚩--------获取动态的图片删除按钮--------
				const btn_delete: HTMLElement = this.getDynamicDeleteButton();
				console.log("btn_delete:  " + btn_delete);
				// 将动态生成的按钮添加到img元素的父级div元素下作为第一个子元素
				imageDOM.parentElement?.insertBefore(btn_delete,imageDOM);
				// 当图片元素的协议是以下几种，则开始执行删除操作
				switch (Proto) {
					case "app:":
					case "data:":
					case "http:":
					case "https:":
						// 给当前图片删除按钮添加点击监听事件
						btn_delete.addEventListener("click", 
						async ()=>{
							try {
							// 获取图片元素的父级div的父级div
							const parent_div: HTMLDivElement = imageDOM.parentElement?.parentElement as HTMLDivElement;
							// 获取图片元素的父级div
							const parentOfImge: HTMLDivElement = imageDOM.parentElement as HTMLDivElement;
							this.removeImageDOM(parent_div, parentOfImge);
							// 删除图片文件
							for (const file of fileList) await app.vault.trash(file, false);
							new Notice(
								"Image deleted from the file navigator !",SUCCESS_NOTICE_TIMEOUT);
							} catch {
								new Notice("Error, could not deleye the image!");
							}
							
						});
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

	}
}
