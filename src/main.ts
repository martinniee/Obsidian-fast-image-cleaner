import {  Plugin,TFile} from 'obsidian';
import { NathanDeleteImageSettingsTab } from './settings';
import { NathanDeleteImageSettings, DEFAULT_SETTINGS } from './settings';
import * as Util from './util';
import { LogsModal } from './modals';

let img_target: HTMLImageElement;


interface Listener {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this: Document, ev: Event): any;
}

export default class NathanDeleteImage extends Plugin {
	// 将插件选项作为 插件主类的属性
	settings: NathanDeleteImageSettings;
	// 当插件启用后
	async onload() {
		console.log("Fast Image Cleaner plugin loaded...");
		// 添加插件选项
		this.addSettingTab(new NathanDeleteImageSettingsTab(this.app, this));
		// 加载插件选项
		await this.loadSettings();
		this.registerDocument(document); // 调用注册文档方法

		app.workspace.on(
			"window-open", // 当
			(workspaceWindow, window) => {
				this.registerDocument(window.document);
			}
		);
		app.workspace.on("file-open", () => {
			Util.clearAllDelBtns();
			Util.addDelBtn(Util.getAllImgDivs());
		});
		app.workspace.on("editor-change", () => {
			Util.clearAllDelBtns();
			Util.addDelBtn(Util.getAllImgDivs());
		});
		app.workspace.on("active-leaf-change", () => {
			Util.clearAllDelBtns();
			Util.addDelBtn(Util.getAllImgDivs());
		});
		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}
	// 当插件禁用后
	onunload() {
		console.log("Fast Image Cleaner plugin unloaded...");
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
	 * 鼠标点击事件
	 */
	onClick(event: MouseEvent) {
		event.preventDefault();
		// event.target 获取鼠标事件的目标元素
		const target = event.target as Element;
		const nodeType = target.localName;
		let del_btn: HTMLButtonElement = document.createElement('button') as HTMLButtonElement;
		// 当目标元素（nodeType）为 button, svg 或 path时，调用button绑定的监听事件，删除图片
		if(nodeType === "button" || nodeType === "svg" || nodeType === "path"){
			del_btn = target.closest(".btn-delete") as HTMLButtonElement;
			img_target = del_btn.parentNode?.querySelector("img") as HTMLImageElement;
            const currentMd = app.workspace.getActiveFile() as TFile;
			const imgBaseName = img_target.parentElement?.getAttribute("src") as string;
			
			// console.log("parsed image path:  " +   app.vault.getAbstractFileByPath(imgBaseName as string)?.path );
			// console.log("parsed image path:  " +   parseLinktext( (imgBaseName as string)).path);			
			if(Util.isRemoveImage(imgBaseName as string)[0] as boolean){
				Util.deleteImg(img_target,imgBaseName as string,this);
			}else{
				const logs: string[] = Util.isRemoveImage(imgBaseName as string)[1] as string[];
				const modal = new LogsModal(currentMd,imgBaseName,logs, this.app);
				modal.open();
			}
		}
	}
}

