import { Menu, MenuItem, TFile, Notice, Plugin } from "obsidian";
import { NathanDeleteImageSettingsTab } from "./settings";
import { NathanDeleteImageSettings, DEFAULT_SETTINGS } from "./settings";

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
	(this: Document, ev: Event): any;
}

export default class NathanDeleteImage extends Plugin {
	settings: NathanDeleteImageSettings;
	async onload() {
		console.log("Delete Image In Use plugin loaded...");
		this.addSettingTab(new NathanDeleteImageSettingsTab(this.app, this));
		await this.loadSettings();
		this.registerDocument(document); // 调用注册文档方法
		app.workspace.on(
			"window-open", // 当打开编辑器窗口时，触发
			(workspaceWindow, window) => {
				this.registerDocument(window.document);
			}
		);

		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}
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
	registerDocument(document: Document) {
		this.register(
			this.onElement(
				document,
				"contextmenu" as keyof HTMLElementEventMap,
				"img",
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

	getAllImageFilesList = (): TFile[] => {
		const allFiles: TFile[] = app.vault.getFiles();
		const attachments: TFile[] = [];
		for (let i = 0; i < allFiles.length; i++) {
			if (allFiles[i].extension !== "md") {
				if (imageExtensions.has(allFiles[i].extension.toLowerCase())) {
					attachments.push(allFiles[i]);
				}
			}
		}
		return attachments;
	};

	getFileViaFullURLOfImage = (imageURL: string): TFile[] => {
		let imageFileFullPath: string;
		const fileList: TFile[] = [];
		const allImageFiles: TFile[] = this.getAllImageFilesList();
		allImageFiles.forEach((imageFile) => {
			imageFileFullPath = app.vault.getResourcePath(imageFile);
			if (imageURL === imageFileFullPath) {
				fileList.push(imageFile);
			}
		});
		return fileList;
	};
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

	onClick(event: MouseEvent) {
		event.preventDefault();
		const target = event.target as Element;
		const imgType = target.localName;
		const menu = new Menu();
		const deleteOption = this.settings.deleteOption;
		let fileList: TFile[];
		switch (imgType) {
			case "img": {
				const image = (target as HTMLImageElement).currentSrc;
				const imageDom = target as HTMLImageElement;
				const thisURL = new URL(image);
				fileList = this.getFileViaFullURLOfImage(image);
				const Proto = thisURL.protocol;
				switch (Proto) {
					case "app:":
					case "data:":
					case "http:":
					case "https:":
						menu.addItem((item: MenuItem) =>
							item
								.setIcon("trash")
								.setTitle("Delete Image In Use url and file")
								.onClick(async () => {
									try {
										for (const file of fileList) {
											const parent_div: HTMLDivElement =
												imageDom.parentElement
													?.parentElement as HTMLDivElement;
											const parentOfimge: HTMLDivElement =
												imageDom.parentElement as HTMLDivElement;
											parent_div.removeChild(
												parentOfimge
											);
											console.log(
												"🚩--------parent_dic attributename--------:" +
													parent_div.getAttributeNames
											);
											if (deleteOption === ".trash") {
												await app.vault.trash(
													file,
													false
												);
												console.log(
													"--图片--" +
														thisURL +
														"被删除了"
												);
												new Notice(
													"Image moved to Obsidian Trash !",
													SUCCESS_NOTICE_TIMEOUT
												);
											} else if (
												deleteOption === "system-trash"
											) {
												await app.vault.trash(
													file,
													true
												);
												console.log(
													"--图片--" +
														thisURL +
														"被删除了"
												);
												new Notice(
													"Image moved to System Trash !",
													SUCCESS_NOTICE_TIMEOUT
												);
											} else if (
												deleteOption === "permanent"
											) {
												await app.vault.delete(file);
												console.log(
													"--图片--" +
														thisURL +
														"被删除了"
												);
												new Notice(
													"Image deleted Permanently !",
													SUCCESS_NOTICE_TIMEOUT
												);
											}
										}
									} catch {
										new Notice(
											"Error, could not deleye the image!"
										);
									}
								})
						);
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
		this.registerEscapeButton(menu);
		menu.showAtPosition({ x: event.pageX, y: event.pageY });
		this.app.workspace.trigger("nn-delete-image-in-use:contextmenu", menu);
	}
}
