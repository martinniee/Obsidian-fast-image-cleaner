import NathanImageCleaner from 'src/main';
import { TFile, Notice } from "obsidian";
import { imageReferencedState } from "./enum/imageReferencedState";
import { resultDetermineImageDeletion as deletionResult } from "./interface/resultDetermineImageDeletion";
import { LogsModal } from "./modals";
const SUCCESS_NOTICE_TIMEOUT = 1800;
/**
 * Remove reference link
 *
 * @param imagePath  the path of the current deleted image without subpath,format as  name.extension
 * @param mdFile  the markdown file containing the deleted image
 */
export const removeReferenceLink = async (imagePath: string, mdFile: TFile) => {
	// Escape . to \. for regular expresion
	const origin_filecontents = await app.vault.read(mdFile);
	const new_filecontents: string[] = [];
	const fileContents_array = origin_filecontents.split("\n");
	for (const fileContent of fileContents_array) {
		const regMdRefLink = new RegExp(
			"!\\[(.*)?\\]\\(((.*\\/)+)?" + imagePath + "\\)",
			"gm"
		);
		const regWikiRefLink2 = new RegExp(
			"!\\[\\[.*?" + imagePath + "(\\|\\d*)?\\]\\]",
			"gm"
		);
		// Decode  when current line contains cleared image reference in markdown style with %20(space) or chinese characters
		const fileContent_decode = decodeURI(fileContent);
		const isIncludeImage = fileContent_decode.includes(imagePath);
		const isMarkdownStyle = fileContent_decode.match(regMdRefLink) != null;
		const isWikiStyle = fileContent_decode.match(regWikiRefLink2) != null;
		if (isIncludeImage && isMarkdownStyle) {
			new_filecontents.push(fileContent_decode.replace(regMdRefLink, ""));
		} else if (isIncludeImage && isWikiStyle) {
			new_filecontents.push(
				fileContent_decode.replace(regWikiRefLink2, "")
			);
		} else {
			new_filecontents.push(fileContent);
		}
	}
	app.vault.adapter.write(mdFile.path, new_filecontents.join("\n"));
};
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
						return undefined;
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
	removeReferenceLink(FileBaseName, app.workspace.getActiveFile() as TFile);
	try {
		if (deleteOption === ".trash") {
			await app.vault.trash(file, false);
			new Notice("Image moved to Obsidian Trash !", SUCCESS_NOTICE_TIMEOUT);
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
