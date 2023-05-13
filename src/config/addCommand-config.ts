import { TFile } from "obsidian";
import NathanImageCleaner from "src/main";
import { deleteAllAttachs, removeAllUnusedReferenceLinks } from "src/options/deleleAllAttachsInTheNote";
import { deleteNote } from "src/utils/deleteFile";

export const addCommand = (myPlugin: NathanImageCleaner) => {
    myPlugin.addCommand({
        id: 'delete-file-and-clear-all-attachments-in-current-file',
        name: 'Delete file and clear all attachments in current file',
        callback: async () => {
            // 1.delete all attachment in the note
            deleteAllAttachs(myPlugin);
            // 2.delete current note
            deleteNote(app.workspace.getActiveFile() as TFile)
        }
    });
    myPlugin.addCommand({
        id: 'clear-all-attachments-in-current-file',
        name: 'clear all attachments in current file',
        callback: async () => {
            deleteAllAttachs(myPlugin);
        }
    });
}