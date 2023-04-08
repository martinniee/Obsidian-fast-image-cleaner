import { Notice, TFile } from "obsidian";
import { deleteAllAttachmentsInCurrentFile } from "src/command/delete-all-attachments-in-current-file";
import NathanDeletefile from "src/main";
import { deleteNote } from "src/utils/deleteNote";

export const addCommand = (myPlugin: NathanDeletefile) => {
    myPlugin.addCommand({
        id: 'delete-file-and-clear-all-attachments-in-current-file',
        name: 'Delete file and clear all attachments in current file',
        callback: async () => {
            // 1.delete all attachment in the note
            await deleteAllAttachmentsInCurrentFile(myPlugin);
            new Notice("All attachments have been delelted")
            // 2.delete current note
            await deleteNote(app.workspace.getActiveFile() as TFile, myPlugin)
        }
    });
}