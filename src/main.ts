import { TFile, Notice,Plugin } from 'obsidian';
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
	settings: NathanDeleteImageSettings;
	// 当插件启用后
	async onload() {
		console.log("Delete Image In Use plugin loaded...");
		// 添加插件选项
		this.addSettingTab(new NathanDeleteImageSettingsTab(this.app, this));
		// 加载插件选项
		await this.loadSettings();
		this.registerDocument(document); // 调用注册文档方法
		this.registerDocument2(document); // 调用注册文档方法
		this.registerDocument3(document); // 调用注册文档方法

		app.workspace.on(
			"window-open", // 当
			(workspaceWindow, window) => {
				this.registerDocument(window.document);
				this.registerDocument2(window.document);
				this.registerDocument3(window.document);
			}
		);
		app.workspace.on("file-open", () => {
			console.log("------file-open-------------");
			this.addDelBtnToAllImage(this.getAllImgDiv());
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}
	// 当插件禁用后
	onunload() {
		console.log("Delete Image In Use plugin unloaded...");
	}

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
	// 注册文档，删除图片的按钮点击事件
	registerDocument(document: Document) {
		this.register(
			this.onElement(
				document,
				"click" as keyof HTMLElementEventMap,
				".btn-delete",
				this.onClick.bind(this)
			)
		);
	}
	registerDocument2(document: Document) {
		this.register(
			this.onElement(
				document,
				"click" as keyof HTMLElementEventMap,
				".btn-delete svg path",
				this.onClick.bind(this)
			)
		);
	}
	registerDocument3(document: Document) {
		this.register(
			this.onElement(
				document,
				"click" as keyof HTMLElementEventMap,
				".btn-delete svg",
				this.onClick.bind(this)
				
			)
		);
	}

	// 加载插件选项 设置
	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}
	// 保存插件选项 设置
	async saveSettings() {
		await this.saveData(this.settings);
	}
	/**
	 * 获取实时预览模式下 内容区的所有图片div (.view-content .markdown-source-view.is-live.preview)
	 * @returns 由实时预览模式下内容区所有图片区域div元素组成的集合
	 */
	getAllImgDiv = (): HTMLCollection => {
		// 1.获取实时预览模式下内容区 div markdown-source-view cm-s-obsidian mod-cm6 is-folding is-line-wrap node-insert-event is-live-preview
		const view_content = document.getElementsByClassName(
			"markdown-source-view cm-s-obsidian mod-cm6  is-live-preview"
		);
		// 2.获取 view-content下的所有的图片区域元素div
		return view_content[0].getElementsByClassName(
			"internal-embed image-embed is-loaded"
		);
	};
	/**
	 * 移除元素的dom结构从文档中
	 * @param target 需要被移除的元素（img）
	 */
	removeImgDom = (target: HTMLElement) => {
		// 1、获取图片元素父级img_div
		const img_div: HTMLDivElement = target.parentElement as HTMLDivElement;
		// 2、获取img_div的父级div content_container
		const content_container: HTMLDivElement = target.parentElement
			?.parentElement as HTMLDivElement;
		// 3、删除img_div元素
		content_container.removeChild(img_div);
	};

	/**
	 * * 为页面中所有图片元素动态地添加删除按钮
	 * @param img_list 图片区域div元素集合，文档中图片元素区域div对象集合，img_list中的元素是img标签的父级div标签对象
	 */
	addDelBtnToAllImage = (img_list: HTMLCollection) => {
		// console.log("img_list:    " + img_list.length);
		for (let index = 0; index < img_list.length; index++) {
			// 1、动态生成删除按钮 btn_del
			const btn_del: HTMLElement = document.createElement("button");
			btn_del.setAttribute("class", "btn-delete");
			// 将svg作为按钮子元素，并作为按钮的图标显示
			btn_del.innerHTML = '<svg fill="#ff0000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="48px" height="48px"><path d="M 28 7 C 25.243 7 23 9.243 23 12 L 23 15 L 13 15 C 11.896 15 11 15.896 11 17 C 11 18.104 11.896 19 13 19 L 15.109375 19 L 16.792969 49.332031 C 16.970969 52.510031 19.600203 55 22.783203 55 L 41.216797 55 C 44.398797 55 47.029031 52.510031 47.207031 49.332031 L 48.890625 19 L 51 19 C 52.104 19 53 18.104 53 17 C 53 15.896 52.104 15 51 15 L 41 15 L 41 12 C 41 9.243 38.757 7 36 7 L 28 7 z M 28 11 L 36 11 C 36.552 11 37 11.449 37 12 L 37 15 L 27 15 L 27 12 C 27 11.449 27.448 11 28 11 z M 19.113281 19 L 44.886719 19 L 43.212891 49.109375 C 43.153891 50.169375 42.277797 51 41.216797 51 L 22.783203 51 C 21.723203 51 20.846109 50.170328 20.787109 49.111328 L 19.113281 19 z M 32 23.25 C 31.033 23.25 30.25 24.034 30.25 25 L 30.25 45 C 30.25 45.966 31.033 46.75 32 46.75 C 32.967 46.75 33.75 45.966 33.75 45 L 33.75 25 C 33.75 24.034 32.967 23.25 32 23.25 z M 24.642578 23.251953 C 23.677578 23.285953 22.922078 24.094547 22.955078 25.060547 L 23.652344 45.146484 C 23.685344 46.091484 24.462391 46.835938 25.400391 46.835938 C 25.421391 46.835938 25.441891 46.835938 25.462891 46.835938 C 26.427891 46.801938 27.183391 45.991391 27.150391 45.025391 L 26.453125 24.939453 C 26.419125 23.974453 25.606578 23.228953 24.642578 23.251953 z M 39.355469 23.251953 C 38.388469 23.224953 37.580875 23.974453 37.546875 24.939453 L 36.849609 45.025391 C 36.815609 45.991391 37.571109 46.801938 38.537109 46.835938 C 38.558109 46.836938 38.578609 46.835938 38.599609 46.835938 C 39.537609 46.835938 40.314656 46.091484 40.347656 45.146484 L 41.044922 25.060547 C 41.078922 24.094547 40.321469 23.285953 39.355469 23.251953 z" /></svg>';
			// 2、依次将按钮渲染到图片区域
			img_list[index].appendChild(btn_del);
			console.log("img_div.innerHTML \n"+ img_list[index].innerHTML);
		}
	};
	/**
	 * 获取指定格式的需要被删除的图片文件的文件列表，列表元素为图片文件类型的TFile类型对象
	 * @param app
	 * @returns  attachments 包含图片文件File类型对象的数组 TFile[]
	 */
	getAllImageFilesList = (): TFile[] => {
		// 获取库中所有文件
		const allFiles: TFile[] = app.vault.getFiles();
		const attachments: TFile[] = [];
		for (let i = 0; i < allFiles.length; i++) {
			// 排除文件是.md文档的情况，也就是当文件为附件的时候
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
	 * 通过图片文件的全路径URL字符串 获取 对应的图片的文件TFile类型对象
	 * @param imageURL  图片的全路径字符串
	 * @returns imageFile
	 */
	getFileViaFullURLOfImage = (imageURL: string): TFile[] => {
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
	 * 删除图片
	 * @param target_img 图片元素对象
	 */

	deleteImg = (target_img: HTMLImageElement) => {
		const deleteOption = this.settings.deleteOption;
		let fileList: TFile[];
		const imgType = target_img.localName;

		switch (imgType) {
			// 当事件作用的目标元素是img标签时
			case "img": {
				// 获取图片元素的 url 格式为 app://local/D:/路径.../文件名.png?1668149164011
				const img_url = target_img.currentSrc;
				const imageDom = target_img;
				const thisURL = new URL(img_url);
				fileList = this.getFileViaFullURLOfImage(img_url);
				console.log("---------fileList--------------"+ fileList.length);

				const Proto = thisURL.protocol;
				// 当图片元素的协议是以下几种，则开始执行删除操作
				// console.log("---------执行了1--------------");
				// console.log("---------Proto--------------" + Proto);
				
				switch (Proto) {
					case "app:":
					case "data:":
					case "http:":
					case "https:":
						console.log("---------执行了2--------------");
						// async () => {
						// 	try {
						console.log("---------执行了3--------------");
								
								for (const file of fileList) {
									// 删除图片的dom结构
									this.removeImgDom(imageDom);
									if (deleteOption === ".trash") {
										// 删除图片
										app.vault.trash(file, false);
										console.log( "--图片--" + thisURL + "被删除了");
										new Notice("Image moved to Obsidian Trash !",SUCCESS_NOTICE_TIMEOUT);
									} else if (deleteOption === "system-trash") {
										// 删除图片
										app.vault.trash(file, true);
										console.log("--图片--" + thisURL + "被删除了");
										new Notice("Image moved to System Trash !",SUCCESS_NOTICE_TIMEOUT);
									} else if (deleteOption === "permanent") {
										// 删除图片
										app.vault.delete(file);
										console.log("--图片--" + thisURL + "被删除了");new Notice("Image deleted Permanently !",SUCCESS_NOTICE_TIMEOUT);
									}
								}
							// } catch {
							// 	new Notice(
							// 		"Error, could not deleye the image!"
							// 	);
							// }
						// };
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

		
	};
	/**
	 * 鼠标点击事件
	 */
	onClick(event: MouseEvent) {
		event.preventDefault();
		// event.target 获取鼠标事件的目标元素
		const target = event.target as Element;
		const nodeType = target.localName;
		// 当节点类型是 按钮元素 并且 是 删除图片的按钮
		console.log("nodeType======" + nodeType);

		switch (nodeType) {
			case "path": { // 如果target是  btn-delete 下的 path
				// 获取img元素
				const img: HTMLImageElement = target.parentNode?.parentNode?.parentNode?.querySelector("img") as HTMLImageElement;
				this.deleteImg(img);
				break;
			}
			case "svg": { // 如果target是 bnt-delete下的svg
				// 获取img元素
				const img: HTMLImageElement = target.parentNode?.parentNode?.querySelector("img") as HTMLImageElement;
				this.deleteImg(img);
				break;
			}
			case "button": { // 如果target是 bnt-delete
				// 获取img元素
				const img: HTMLImageElement = target.parentNode?.querySelector("img") as HTMLImageElement;
				this.deleteImg(img);
				break;
			}
			default:
				break;
		}
	}
}

