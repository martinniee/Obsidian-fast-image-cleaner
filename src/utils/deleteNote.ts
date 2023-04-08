import { Notice, TFile } from "obsidian";
import NathanDeletefile from "src/main";
const SUCCESS_NOTICE_TIMEOUT = 1800;

export const deleteNote = async (
    file: TFile,
    plugin: NathanDeletefile
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
        new Notice("Faild to delelte the note !", SUCCESS_NOTICE_TIMEOUT);

    }
};