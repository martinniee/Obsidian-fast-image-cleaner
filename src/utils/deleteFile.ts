import { Notice, TFile, TFolder } from "obsidian";
import NathanImageCleaner from "src/main";
const SUCCESS_NOTICE_TIMEOUT = 1800;
/**
 * Delete attachment
 * @param file
 */
export const deleteFile = async (
	file: TFile | TFolder,
	plugin: NathanImageCleaner
) => {
	const deleteOption = plugin.settings.deleteOption;
	try {
		if (deleteOption === ".trash") {
			await app.vault.trash(file, false);
		} else if (deleteOption === "system-trash") {
			await app.vault.trash(file, true);
		} else if (deleteOption === "permanent") {
			await app.vault.delete(file);
		}
	} catch (error) {
		console.error(error);
		new Notice(
			"Failed to delete the file/folder !",
			SUCCESS_NOTICE_TIMEOUT
		);
	}
};
/**
 * Delete note
 * @param file
 */
/* export const deleteNote = (file: TFile) => {
	// @ts-ignore
	app.fileManager.promptForDeletion(file);
}; */

export const getAllFoldersWithoutSibling = (
	fileFolder: TFolder,
	folders: TFolder[]
): TFolder[] => {
	const parentFolder = fileFolder.parent;
	if (parentFolder instanceof TFolder && parentFolder.children.length === 1) {
		folders.push(parentFolder);
		return getAllFoldersWithoutSibling(parentFolder, folders);
	}
	return folders;
};

export const deleteAllFoldersWithoutSibling = async (
	allFoldersWithoutSibing: TFolder[],
	plugin: NathanImageCleaner
) => {
	if (allFoldersWithoutSibing.length != 0) {
		for (const folder of allFoldersWithoutSibing) {
			await deleteFile(folder, plugin);
		}
	}
};
