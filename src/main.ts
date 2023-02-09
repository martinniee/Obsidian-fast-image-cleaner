import {  Plugin,TFile} from 'obsidian';
import { NathanDeleteImageSettingsTab } from './settings';
import { NathanDeleteImageSettings, DEFAULT_SETTINGS } from './settings';
import * as Util from './util';
import { LogsModal } from './modals';

let img_target: HTMLImageElement;


interface Listener {
    (this: Document, ev: Event): any;
}

export default class NathanDeleteImage extends Plugin {
	settings: NathanDeleteImageSettings;
	async onload() {
		console.log("Fast Image Cleaner plugin loaded...");
		this.addSettingTab(new NathanDeleteImageSettingsTab(this.app, this));
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
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}
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
	
	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}
	async saveSettings() {
		await this.saveData(this.settings);
	}
	
	/**
	 * 鼠标点击事件
	 */
	onClick(event: MouseEvent) {
		event.preventDefault();
		const target = event.target as Element;
		const nodeType = target.localName;
		let del_btn: HTMLButtonElement = document.createElement('button') as HTMLButtonElement;
		if(nodeType === "button" || nodeType === "svg" || nodeType === "path"){
			del_btn = target.closest(".btn-delete") as HTMLButtonElement;
			img_target = del_btn.parentNode?.querySelector("img") as HTMLImageElement;
            const currentMd = app.workspace.getActiveFile() as TFile;
			const imgBaseName = img_target.parentElement?.getAttribute("src") as string;
			
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

