import NathanImageCleaner from "src/main";
import { TFile, Notice } from "obsidian";
import { imageReferencedState } from "./enum/imageReferencedState";
import { resultDetermineImageDeletion as deletionResult } from "./interface/resultDetermineImageDeletion";
import { LogsModal } from "./modals";
const SUCCESS_NOTICE_TIMEOUT = 1800;
export interface metaData {
	[propName: string]: {
		value: any;
	};
}
export interface processFunc {
	(
		line: string,
		metaData: metaData,
		plugin: NathanImageCleaner,
		params: params,
		index?: number
	): Promise<string | void>;
}
export interface params {
	[param: string]: any;
}
/**
 * File contents processing class
 */
export class fileContentsProcess {
	#processFunc: processFunc;
	#delay: number = 1000;
	#metaData: metaData;
	#line: string;
	constructor(
		callback: processFunc, // function for core-logic for  text processsing
		metaData: metaData = {},
		delay: number = 1000 // if no value is passed, set 1000 as default
	) {
		this.#processFunc = callback;
		this.#delay = delay;
		this.#metaData = metaData as metaData;
	}

	async process(params: params, plugin?: NathanImageCleaner): Promise<any> {
		const activeFile: TFile = app.workspace.getActiveFile() as TFile;
		const fileContents = (await app.vault.read(activeFile)).split("\n");
		let newFileContents: string[] = [];
		this.resetMetaData();
		for (let index = 0; index < fileContents.length; index++) {
			this.#line = fileContents[index];
			let result = (await this.#processFunc(
				this.#line,
				this.#metaData,
				plugin as NathanImageCleaner,
				params as params,
				index as number
			)) as any;
			newFileContents.push(result);
		}
		newFileContents = newFileContents.filter(
			(item) => item != "DELETE_LINE"
		);
		app.vault.adapter.write(activeFile.path, newFileContents.join("\n"));
		setTimeout(() => {
			return "";
		}, this.#delay);
	}
	resetMetaData(): void {
		for (const prop in this.#metaData) {
			if (this.#metaData[prop].value instanceof Array) {
				// Reset all values in prop.value preventing heading number increment
				this.#metaData[prop].value = this.#metaData[prop].value.map(
					(item: any) => {
						if (typeof item === "number") {
							return 0;
						} else if (typeof item === "string") {
							return "";
						}
						return item;
					}
				);
			}
			if (typeof this.#metaData[prop].value === "number") {
				this.#metaData[prop].value = 0;
			}
			if (typeof this.#metaData[prop].value === "string") {
				this.#metaData[prop].value = "0";
			}
			if (typeof this.#metaData[prop].value === "boolean") {
				this.#metaData[prop].value = false;
			}
		}
	}
}
/**
 * 文章中单行图片链接数量
 * 1. 一行中仅有一个图片引用链接 (解决)
 * 2. 一行中由多个图片引用链接 （未解决）
 */
export const delImgRefLink = new fileContentsProcess(
	async (line, metaData, Plugin, params) => {
		let imgBasePath = params.FileBaseName as string;
		const mdLinkRegex = /!\[.*?\]\((?<imgPath>.*?)\.(?:[a-zA-Z]+)\)/;
		const wikiLinkRegex = /!\[\[.+\.(?:[a-zA-Z]+)(?: *\| *.*?)*\]\]/;

		if (mdLinkRegex.test(line)) {
			let match = line.match(mdLinkRegex) as RegExpExecArray;
			if (match[0].includes("%20")) {
				if (line.replace(/%20/g, " ").includes(imgBasePath)) {
					return "DELETE_LINE";
				} else {
					return line;
				}
			} else if (line.includes(imgBasePath)) {
				return "DELETE_LINE";
			} else {
				return line;
			}
		} else if (line.includes(imgBasePath) && wikiLinkRegex.test(line)) {
			return "DELETE_LINE";
		}
		return line;
	}
);
/**
 *
 * @param FileBaseName format is as name.extension
 * @returns
 */
export const isRemove = (
	FileBaseName: string
): { state: number; mdPath: string[] } => {
	const currentMd = app.workspace.getActiveFile() as TFile;
	const resolvedLinks = app.metadataCache.resolvedLinks;
	const deletedTargetFile = getFileByBaseName(currentMd, FileBaseName) as
		| TFile
		| undefined;
	let CurMDPath: string;
	// // record the state of image referenced and all paths of markdown referencing to the image
	let result: deletionResult = {
		state: 0,
		mdPath: [],
	};
	let refNum = 0; // record the number of note referencing to the image.
	for (const [mdFile, links] of Object.entries(resolvedLinks)) {
		if (currentMd.path === mdFile) {
			CurMDPath = currentMd.path;
			result.mdPath.unshift(CurMDPath);
		}
		for (const [filePath, nr] of Object.entries(links)) {
			if (deletedTargetFile?.path === filePath) {
				refNum++;
				// if the deleted target image referenced by current note more than once
				if (nr > 1) {
					result.state = imageReferencedState.MORE;
					result.mdPath.push(mdFile);
					return result;
				}
				result.mdPath.push(mdFile);
			}
		}
	}
	if (refNum > 1) {
		result.state = imageReferencedState.MUTIPLE;
	} else {
		result.state = imageReferencedState.ONCE;
	}
	return result;
};
/**
 * 	通过当前md文件和图片名 获取 图片文件对象   ，类型为TFile
 * 
	@param currentMd  当前需要被删除的curMd所在的markdown文件
	@param FileBaseName  当前需要被删除的curMd名 name.extension
 *  @returns  AttachFile
 */
export const getFileByBaseName = (
	currentMd: TFile,
	FileBaseName: string
): TFile | undefined => {
	const resolvedLinks = app.metadataCache.resolvedLinks;
	for (const [mdFile, links] of Object.entries(resolvedLinks)) {
		if (currentMd.path === mdFile) {
			for (const [filePath, nr] of Object.entries(links)) {
				if (filePath.includes(FileBaseName)) {
					try {
						const AttachFile: TFile =
							app.vault.getAbstractFileByPath(filePath) as TFile;
						if (AttachFile instanceof TFile) {
							return AttachFile;
						}
					} catch (error) {
						new Notice(` cannot get the image file`);
						console.error(error);
					}
				}
			}
		}
	}
};
/**
 * 删除curMd文件 （附件引用链接，附件文件）
 *
 * @param FileBaseName  curMd基本名称 name.extension
 * @param plugin 当前插件
 * @returns
 */
export const ClearAttachment = async (
	FileBaseName: string,
	plugin: NathanImageCleaner
) => {
	const deleteOption = plugin.settings.deleteOption;
	const currentMd = app.workspace.getActiveFile() as TFile;
	const file = getFileByBaseName(currentMd, FileBaseName) as TFile;
	// delImgRefLink(FileBaseName, app.workspace.getActiveFile() as TFile).process();
	await delImgRefLink.process({ FileBaseName });
	try {
		if (deleteOption === ".trash") {
			await app.vault.trash(file, false);
			new Notice(
				"Image moved to Obsidian Trash !",
				SUCCESS_NOTICE_TIMEOUT
			);
		} else if (deleteOption === "system-trash") {
			await app.vault.trash(file, true);
			new Notice("Image moved to System Trash !", SUCCESS_NOTICE_TIMEOUT);
		} else if (deleteOption === "permanent") {
			await app.vault.delete(file);
			new Notice("Image deleted Permanently !", SUCCESS_NOTICE_TIMEOUT);
		}
	} catch (error) {
		console.error(error);
		new Notice("Faild to delelte the image !", SUCCESS_NOTICE_TIMEOUT);
	}
};
/**
 * 处理图片删除
 *
 * @param FileBaseName
 * @param currentMd
 */
export const handlerDelFile = (
	FileBaseName: string,
	currentMd: TFile,
	plugin: NathanImageCleaner
) => {
	let logs: string[];
	let modal;
	const state: number = isRemove(FileBaseName).state;
	switch (state) {
		case 0:
			// clear attachment directly
			ClearAttachment(FileBaseName, plugin);
			break;
		case 1:
		case 2:
			// referenced by eithor only note or other mutiple notes more than once
			logs = isRemove(FileBaseName).mdPath as string[];
			modal = new LogsModal(currentMd, state, FileBaseName, logs, app);
			modal.open();
		default:
			break;
	}
};
