import { Notice, TFile, TFolder } from "obsidian";
import {
	deleteFile,
	getFileParentFolder,
	getTopFolderOnlyOneChild,
} from "src/utils/util";
import NathanImageCleaner from "../main";

interface attachInfoArrType {
	folder: TFolder;
	initialLength: number;
	attachCount: number;
	attachFiles: TFile[];
}
export const deleteAllAttachs = async (plugin: NathanImageCleaner) => {
	const activeMd: TFile = app.workspace.getActiveFile() as TFile;
	const resolvedLinks = app.metadataCache.resolvedLinks;
	const attachInfoArr: attachInfoArrType[] = [];

	for (const [mdFile, links] of Object.entries(resolvedLinks)) {
		if (activeMd?.path !== mdFile) continue;
		if (Object.keys(links).length == 0) break;

		for (const [filePath, nr] of Object.entries(links)) {
			if (filePath.match(/.*\.md$/m)) continue;
			if (isReferencedByOtherNotes(filePath, activeMd)) continue;
			try {
				const AttachFile: TFile = app.vault.getAbstractFileByPath(
					filePath
				) as TFile;
				const parentFolder = getFileParentFolder(AttachFile) as TFolder;

				if (!(AttachFile instanceof TFile)) continue;

				if (
					attachInfoArr.length !== 0 &&
					attachInfoArr.some((item) => item.folder === parentFolder)
				) {
					for (let i = 0; i < attachInfoArr.length; i++) {
						const element = attachInfoArr[i];
						if (element.folder === parentFolder) {
							attachInfoArr[i].attachCount += 1;
							attachInfoArr[i].attachFiles.push(AttachFile);
						}
					}
				} else {
					attachInfoArr.push({
						folder: parentFolder,
						initialLength: parentFolder.children.length,
						attachCount: 1,
						attachFiles: [AttachFile],
					});
				}
			} catch (error) {
				console.warn(error);
			}
		}
	}
	const shouldDeleteAllAttachsAndFolder = attachInfoArr.every(
		(item) => item.initialLength === item.attachCount
	);

	if (shouldDeleteAllAttachsAndFolder) {
		for (const item of attachInfoArr) {
			const deletedFolder = getTopFolderOnlyOneChild(item.folder);
			await deleteFile(deletedFolder, plugin);
		}
	} else {
		const deletedFolders = attachInfoArr.filter(
			(item) => item.initialLength === item.attachCount
		);
		const deletedAttachs = attachInfoArr.filter(
			(item) => item.initialLength !== item.attachCount
		);
		if (deletedFolders.length > 0) {
			for (const item of deletedFolders) {
				const deletedFolder = getTopFolderOnlyOneChild(item.folder);
				await deleteFile(deletedFolder, plugin);
			}
		}
		for (const item of deletedAttachs) {
			for (const attachFile of item.attachFiles) {
				await deleteFile(attachFile, plugin);
			}
		}
	}

	new Notice(
		"All attachments and its parent folder have been deleted!",
		3000
	);

	// removeAllUnusedReferenceLinks(activeMd, attachsPaths);
};
/**
 *
 * @param attachPath
 * @param currentMd
 * @returns
 */
const isReferencedByOtherNotes = (
	attachPath: string,
	currentMd: TFile
): boolean => {
	const resolvedLinks = app.metadataCache.resolvedLinks;
	let flag: boolean = false;

	for (const [mdFile, links] of Object.entries(resolvedLinks)) {
		if (mdFile !== currentMd.path) {
			for (const [filePath, nr] of Object.entries(links)) {
				if (filePath === attachPath) {
					flag = true;
				}
			}
		}
	}
	return flag;
};

/**
 * Remove all reference links
 *
 * @param imagePaths  path  list  of the current deleted image without subpath,format as  name.extension
 * @param mdFile  the markdown file containing the deleted image
 */
/* export const removeAllUnusedReferenceLinks = async (
	activeMd: TFile,
	attachsPaths: string[]
) => {
	// 1.get path list of all unused attachments
	const originContents = await app.vault.read(activeMd);
	const lines = originContents.split("\n");
	const newContents: string[] = [];
	let isNotTargetLine: boolean = true;

	// 2. clear all unused attachments links in the note
	// Escape . to \. for regular expresion
	for (const line of lines) {
		for (const index in attachsPaths) {
			const regMdRefLink = new RegExp(
				"!\\[(.*)?\\]\\(((.*\\/)+)?" + attachsPaths[index] + "\\)",
				"gm"
			);
			const regWikiRefLink2 = new RegExp(
				"!\\[\\[.*?" + attachsPaths[index] + "(\\|\\d*)?\\]\\]",
				"gm"
			);
			const decodeLine = decodeURI(line);
			const isIncludeImage = decodeLine.includes(attachsPaths[index]);
			const isMarkdownStyle = decodeLine.match(regMdRefLink) != null;
			const isWikiStyle = decodeLine.match(regWikiRefLink2) != null;
			if (isIncludeImage && isMarkdownStyle) {
				isNotTargetLine = false;
				newContents.push(decodeLine.replace(regMdRefLink, ""));
				break;
			} else if (isIncludeImage && isWikiStyle) {
				isNotTargetLine = false;
				newContents.push(decodeLine.replace(regWikiRefLink2, ""));
				break;
			} else {
				continue;
			}
		}
		if (isNotTargetLine) newContents.push(line);
	}
	app.vault.adapter.write(activeMd.path, newContents.join("\n"));
}; */
export const getRefencedLinkCount = (): number => {
	const activeMd: TFile = app.workspace.getActiveFile() as TFile;
	const resolvedLinks = app.metadataCache.resolvedLinks;
	let count = 0;
	for (const [mdFile, links] of Object.entries(resolvedLinks)) {
		if (activeMd?.path !== mdFile) continue;
		if (Object.keys(links).length == 0) break;

		for (const [filePath, nr] of Object.entries(links)) {
			if (filePath.match(/.*\.md$/m)) continue;
			if (isReferencedByOtherNotes(filePath, activeMd)) continue;
			count++;
		}
	}
	return count;
};
