import { Menu, MenuItem, Notice, Plugin, TFile } from "obsidian";
import { NathanDeleteAttactmentSettingsTab } from "./settings";
import { NathanDeleteAttactmentSettings, DEFAULT_SETTINGS } from "./settings";
import * as Util from "./util";
import * as addDelBntHandler from "./handler/addDelBntHandler";
import { LogsModal } from "./modals";
import { TargetName } from "./type/targetType";



interface Listener {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(this: Document, ev: Event): any;
}

export default class NathanDeletefile extends Plugin {
	// 将插件选项作为 插件主类的属性
	settings: NathanDeleteAttactmentSettings;
	// 当插件启用后
	async onload() {
		console.log("Fast file Cleaner plugin loaded...");
		// 添加插件选项
		this.addSettingTab(new NathanDeleteAttactmentSettingsTab(this.app, this));
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
			addDelBntHandler.clearAllDelBtns();			
			addDelBntHandler.addDelBtn(addDelBntHandler.getAllImgDivs());
		});
		app.workspace.on("editor-change", () => {
			addDelBntHandler.clearAllDelBtns();
			addDelBntHandler.addDelBtn(addDelBntHandler.getAllImgDivs());
		});
		app.workspace.on("active-leaf-change", () => {
			addDelBntHandler.clearAllDelBtns();
			addDelBntHandler.addDelBtn(addDelBntHandler.getAllImgDivs());
		});
		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}
	// 当插件禁用后
	onunload() {
		console.log("Fast file Cleaner plugin unloaded...");
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
	// 注册文档，删除附件的按钮点击事件
	registerDocument(document: Document) {
		this.register(
			this.onElement(
				document,
				"click" as keyof HTMLElementEventMap,
				".btn-delete",
				this.onClick.bind(this)
			)
		);
		// 注册文档，给图片添加右键菜单事件
		this.register(
			this.onElement(
				document,
				"contextmenu" as keyof HTMLElementEventMap,
				"img, iframe, video, div.file-embed-title",
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
		// event.target 获取鼠标事件的目标元素
		const target = event.target as HTMLElement;
		const currentMd = app.workspace.getActiveFile() as TFile;

		const nodeType = target.localName;
		const menu = new Menu();
		const RegFileBaseName = new RegExp('\\/?([^\\/\\n]+\\.\\w+)', 'm');
		let FileBaseName: string;

		const delBntTarget = ['button', 'path', 'svg'];
		const delTarget= ['img', 'iframe', 'video','div'];
		const targetName: TargetName = {delBntTarget,delTarget};


		if (nodeType === "img" || nodeType === "iframe" || nodeType === "video" || (nodeType === 'div' && target.className === 'file-embed-title') ) {
			const imgPath = target.parentElement?.getAttribute("src") as string;
			FileBaseName = (imgPath.match(RegFileBaseName) as string[])[1];
			menu.addItem((item: MenuItem) =>
				item
					.setIcon("trash-2")
					.setTitle("clear file and referenced link")
					.setChecked(true)
					.onClick(async () => {
						try {
							if (Util.IsRemove(FileBaseName)[0] as boolean) {
								Util.ClearAttachment(FileBaseName, this);
							} else {
								const logs: string[] = Util.IsRemove(
									FileBaseName
								)[1] as string[];
								const modal = new LogsModal(
									currentMd,
									FileBaseName,
									logs,
									this.app
								);
								modal.open();
							}
						} catch {
							new Notice("Error, could not clear the file!");
						}
					})
			);
		}
		this.registerEscapeButton(menu);
		menu.showAtPosition({ x: event.pageX, y: event.pageY-40 });
		this.app.workspace.trigger("NL-fast-file-cleaner:contextmenu", menu);
	}
}
