import { TFile } from "obsidian";
import NathanDeletefile from "src/main";

export const deleteAttachmentWhenDeleteNote = (
    file: TFile,
    plugin: NathanDeletefile
) => {
    const deleteOption = plugin.settings.deleteOption;
    if (deleteOption === ".trash") {
        app.vault.trash(file, false);
    } else if (deleteOption === "system-trash") {
        app.vault.trash(file, true);
    } else if (deleteOption === "permanent") {
        app.vault.delete(file);
    }
};