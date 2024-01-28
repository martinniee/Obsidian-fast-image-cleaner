import NathanImageCleaner from "src/main";
import { TFile, Notice, TFolder } from "obsidian";
import { imageReferencedState } from "../enum/imageReferencedState";
import { resultDetermineImageDeletion as deletionResult } from "../interface/resultDetermineImageDeletion";
import { LogsModal } from "../modals";
import {
	deleteAllFoldersWithoutSibling,
	getAllFoldersWithoutSibling,
} from "./deleteFile";
import { removeReferenceLink } from "./removeReferenceLink";

const SUCCESS_NOTICE_TIMEOUT = 1800;

export const determineRemove = (
	imgPath: string
): { state: number; mdPath: string[] } => {
	const currentMd = app.workspace.getActiveFile() as TFile;
	const resolvedLinks = app.metadataCache.resolvedLinks;
	const deletedTargetFile = getFileByBaseName(currentMd, imgPath) as
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
export const getFileByBaseName = (
	currentMd: TFile,
	imgPath: string
): TFile | undefined => {
	const resolvedLinks = app.metadataCache.resolvedLinks;
	let imgBaseName = imgPath.match(/(?<=\/?)(?<imgBasename>[^\n\/]*)$/m)
		?.groups?.imgBasename as string;

	for (const [mdFile, links] of Object.entries(resolvedLinks)) {
		if (currentMd.path === mdFile) {
			for (const [filePath, nr] of Object.entries(links)) {
				if (filePath.includes(imgBaseName)) {
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

export const ClearAttachment = async (
	imgPath: string,
	plugin: NathanImageCleaner
) => {
	const deleteOption = plugin.settings.deleteOption;
	const currentMd = app.workspace.getActiveFile() as TFile;
	const file = getFileByBaseName(currentMd, imgPath) as TFile;
	await removeReferenceLink.process({ imgPath });
	const delFileFolder = onlyOneFileExists(file);
	const fileFolder = getFileParentFolder(file) as TFolder;
	const folders: TFolder[] = [];
	const aLlFoldersWithoutSibing = getAllFoldersWithoutSibling(
		fileFolder,
		folders
	);

	try {
		if (deleteOption === ".trash") {
			await app.vault.trash(file, false);
			new Notice(
				"Image moved to Obsidian Trash !",
				SUCCESS_NOTICE_TIMEOUT
			);
			if (delFileFolder) {
				await app.vault.trash(fileFolder, false);
				await deleteAllFoldersWithoutSibling(
					aLlFoldersWithoutSibing,
					plugin
				);
				new Notice("Attachment folder has been deleted!", 3000);
			}
		} else if (deleteOption === "system-trash") {
			await app.vault.trash(file, true);
			new Notice("Image moved to System Trash !", SUCCESS_NOTICE_TIMEOUT);
			if (delFileFolder) {
				await app.vault.trash(fileFolder, true);
				await deleteAllFoldersWithoutSibling(
					aLlFoldersWithoutSibing,
					plugin
				);
				new Notice("Attachment folder has been deleted!", 3000);
			}
		} else if (deleteOption === "permanent") {
			await app.vault.delete(file);
			new Notice("Image deleted Permanently !", SUCCESS_NOTICE_TIMEOUT);
			if (delFileFolder) {
				await app.vault.delete(fileFolder);
				await deleteAllFoldersWithoutSibling(
					aLlFoldersWithoutSibing,
					plugin
				);
				new Notice("Attachment folder has been deleted!", 3000);
			}
		}
	} catch (error) {
		console.error(error);
		new Notice("Faild to delelte the image !", SUCCESS_NOTICE_TIMEOUT);
	}
};

export const handlerDelFile = (
	imgPath: string,
	currentMd: TFile,
	plugin: NathanImageCleaner
) => {
	let logs: string[];
	let modal;
	const state: number = determineRemove(imgPath).state;
	switch (state) {
		case 0:
			// clear attachment directly
			ClearAttachment(imgPath, plugin);
			break;
		case 1:
		case 2:
			// referenced by eithor only note or other mutiple notes more than once
			logs = determineRemove(imgPath).mdPath as string[];
			modal = new LogsModal(currentMd, state, imgPath, logs, app);
			modal.open();
		default:
			break;
	}
};
/**
 *
 * @param file target deleted file
 * @returns parent folder or undefiend
 */
export const getFileParentFolder = (file: TFile): TFolder | undefined => {
	if (file instanceof TFile) {
		if (file.parent instanceof TFolder) {
			return file.parent;
		}
	}
	return;
};
/**
 *
 * @param file
 * @returns
 */
const onlyOneFileExists = (file: TFile): boolean => {
	const fileFolder = getFileParentFolder(file) as TFolder;
	return fileFolder.children.length === 1;
};
export const deleteArrayElement = (arr: string[], index: number): string[] => {
	if (index === 0) {
		return [...arr.slice(1)];
	} else if (index === arr.length - 1) {
		return arr.slice(0, index);
	} else {
		return [...arr.slice(0, index), ...arr.slice(index + 1)];
	}
};
export const escapeRegex = (str: string): string => {
	return str.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
};
