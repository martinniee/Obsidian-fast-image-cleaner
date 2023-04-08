import { Notice, TFile } from "obsidian";
import NathanDeletefile from "src/main";
import { deleteAttachmentWhenDeleteNote } from "src/utils/deleteAttachmentWhenDeleteNote";
const SUCCESS_NOTICE_TIMEOUT = 10000;

/**
 * Delete all attachments referenced by the deleted note
 * 
 * 1. get current file
 * 2. get TFile of the attachment referenced by file
 */
export const deleteAllAttachmentsInCurrentFile = async (plugin: NathanDeletefile): Promise<TFile | undefined> => {
    // 1. get current file
    const activeMd: TFile = app.workspace.getActiveFile() as TFile;
    const resolvedLinks = app.metadataCache.resolvedLinks;
    for (const [mdFile, links] of Object.entries(resolvedLinks)) {
        if (activeMd?.path === mdFile) {
            for (const [filePath, nr] of Object.entries(links)) {
                // if the attachment in the note has been referenced by other notes  simultaneously
                //  ,skip it.
                if (isReferencedByOtherNotes(filePath, activeMd)) continue;
                try {
                    // 2. get TFile of the attachment referenced by file
                    const AttachFile: TFile = app.vault.getAbstractFileByPath(filePath) as TFile;
                    if (AttachFile instanceof TFile) {
                        await deleteAttachmentWhenDeleteNote(AttachFile, plugin);
                    }
                } catch (error) {
                    console.error(error);
                    return undefined;
                }
            }
        }
    }
}
/**
 * 
 * @param attachPath 
 * @param currentMd 
 * @returns 
 */
const isReferencedByOtherNotes = (attachPath: string, currentMd: TFile): boolean => {
    const resolvedLinks = app.metadataCache.resolvedLinks;
    let flag: boolean = false;

    for (const [mdFile, links] of Object.entries(resolvedLinks)) {
        if (mdFile !== currentMd.path) {
            for (const [filePath, nr] of Object.entries(links)) {
                if (filePath === attachPath) {
                    return flag = true;
                }
            }
        }
    }
    return flag;
}