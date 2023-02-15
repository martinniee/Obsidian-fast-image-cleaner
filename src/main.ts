import { Menu, MenuItem, Notice, Plugin, TFile } from "obsidian";
import { NathanDeleteAttactmentSettingsTab } from "./settings";
import { NathanDeleteAttactmentSettings, DEFAULT_SETTINGS } from "./settings";
import * as Util from "./util";
import * as addDelBntHandler from "./handler/addDelBntHandler";
import { TargetName } from "./type/targetType";



interface Listener {
	
	(this: Document, ev: Event): any;
}

export default class NathanDeletefile extends Plugin {
	
	settings: NathanDeleteAttactmentSettings;
	
	async onload() {
		console.log("Fast file Cleaner plugin loaded...");
		
		this.addSettingTab(new NathanDeleteAttactmentSettingsTab(this.app, this));
		
		await this.loadSettings();
		this.registerDocument(document); 

		app.workspace.on(
			"window-open", 
			(workspaceWindow, window) => {
				this.registerDocument(window.document);
			}
		);
		this.registerEvent(app.workspace.on('file-open',()=>{
			this.HoverDeltedButton();
		}))
		this.registerEvent(app.workspace.on("editor-change", () => {
			this.HoverDeltedButton();
		}))
		this.registerEvent(app.workspace.on("active-leaf-change", () => {
			this.HoverDeltedButton();
		}))
		this.HoverDeltedButton();
	}
	
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
	
	registerDocument(document: Document) {
		this.register(
			this.onElement(
				document,
				"click" as keyof HTMLElementEventMap,
				".btn-delete",
				this.onClick.bind(this)
			)
		);
		
		this.register(
			this.onElement(
				document,
				"contextmenu" as keyof HTMLElementEventMap,
				"img, iframe, video, div.file-embed-title",
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
	HoverDeltedButton = ()=>{
		// active hover delete button
		if(this.settings.deleteBnt){
			this.isAddHoverDeltedButton();
		}
	}
	isAddHoverDeltedButton= ()=>{
		addDelBntHandler.clearAllDelBtns();
		addDelBntHandler.addDelBtn(addDelBntHandler.getAllImgDivs());
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
	 * 设置菜单按钮，并设置点击事件
	 * 
	 * @param menu 
	 * @param FileBaseName 
	 * @param currentMd 
	 */
	addMenu = (menu: Menu, FileBaseName: string, currentMd: TFile)=>{
		menu.addItem((item: MenuItem) =>
				item
					.setIcon("trash-2")
					.setTitle("clear file and referenced link")
					.setChecked(true)
					.onClick(async () => {
						try {
							Util.handlerDelFile(FileBaseName, currentMd,this);
						} catch {
							new Notice("Error, could not clear the file!");
						}
					})
		);
	}
	

	

	/**
	 * 鼠标点击事件
	 */
	onClick(event: MouseEvent) {
		event.preventDefault();
		
		const target = event.target as HTMLElement;
		const currentMd = app.workspace.getActiveFile() as TFile;

		const nodeType = target.localName;
		const menu = new Menu();
		const RegFileBaseName = new RegExp('\\/?([^\\/\\n]+\\.\\w+)', 'm');
		
		let imgPath= '';
		
		const delBntTarget = ['button', 'path', 'svg'];
		const delTarget= ['img', 'iframe', 'video','div'];
		const targetName: TargetName = {delBntTarget,delTarget};

		
		if(targetName.delTarget.includes(nodeType)){
			imgPath =  target.parentElement?.getAttribute("src") as string;
			const FileBaseName = (imgPath?.match(RegFileBaseName) as string[])[1];
			if(target.className === 'file-embed-title'){
				
				this.addMenu(menu,FileBaseName,currentMd);
			}
			this.addMenu(menu,FileBaseName,currentMd);
		}else if(targetName.delBntTarget.includes(nodeType)){
			
			addDelBntHandler.clearImgByDelBnt(target,currentMd,this);
		}
		this.registerEscapeButton(menu);
		menu.showAtPosition({ x: event.pageX, y: event.pageY-40 });
		this.app.workspace.trigger("NL-fast-file-cleaner:contextmenu", menu);
	}
}
