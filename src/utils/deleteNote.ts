import { TFile } from "obsidian";
import NathanDeletefile from "src/main";

export const deleteNote = (
    file: TFile,
) => {
    // @ts-ignore
    app.fileManager.promptForDeletion(file)
};