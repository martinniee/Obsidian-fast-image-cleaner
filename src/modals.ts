import { Modal, App, TFile } from "obsidian";
import { removeReferenceLink } from "./util";

export class LogsModal extends Modal {
    textToView: string[];
    currentMd: TFile;
    state: number;
    FileBaseName: string;

    constructor(
        currentMd: TFile,
        state: number,
        FileBaseName: string,
        textToView: string[],
        app: App
    ) {
        super(app);
        this.textToView = textToView;
        this.currentMd = currentMd;
        this.state = state;
        this.FileBaseName = FileBaseName;
    }

    getLog(): string {
        console.log("@this.textToView: ", this.textToView);

        // current note
        const CurFirstMd: string = this.textToView.shift() as string;
        const curMdLog: string =
            "The md document that currently references the attachment: \n" +
            CurFirstMd +
            "\n\n";

        let otherMds: string = this.textToView.join("\n");
        const otherMdsLog =
            "List of all documents that reference this attachment: \n" +
            otherMds;
        const log: string = curMdLog + otherMdsLog;
        return log;
    }

    onOpen() {
        const { contentEl } = this;
        const myModal = this;
        const headerWrapper = contentEl.createEl("div");
        headerWrapper.addClass("fast-image-cleaner-center-wrapper");

        const headerEl = headerWrapper.createEl("h1", {
            text: " Detection of multiple attachment reference links - logs ",
        });
        headerEl.addClass("modal-title");

        // the numbe of referencing the same image in current note  more than once
        if (this.state > 1) {
            this.showPrompt();
            this.showCloseBtn(this.getButtonWrapper(), this);
        } else {
            this.showLogs();
            this.showCloseBtn(this.getButtonWrapper(), this);
            this.showRemoveLinkBtn(this.getButtonWrapper(), this);
        }
    }
    showLogs() {
        const logs = this.contentEl.createEl("div");
        logs.addClass("fast-image-cleaner-log");
        logs.setText(this.getLog());
    }
    getButtonWrapper(): HTMLDivElement {
        const buttonWrapper = this.contentEl.createEl("div") as HTMLDivElement;
        buttonWrapper.addClass("fast-image-cleaner-center-wrapper");
        return buttonWrapper;
    }
    showCloseBtn(buttonWrapper: HTMLDivElement, myModal: Modal) {
        // --------closeButton--------
        const closeButton = buttonWrapper.createEl("button", {
            text: "close",
        });
        closeButton.setAttribute("aria-label", "close the window");
        closeButton.addEventListener("click", () => {
            myModal.close();
        });
    }
    showRemoveLinkBtn(buttonWrapper: HTMLDivElement, myModal: Modal) {
        const removeLinkButton = buttonWrapper.createEl("button", {
            text: "remove link",
        });
        removeLinkButton.setAttribute(
            "aria-label",
            "Continue to remove the reference link to the current attachment in the current document"
        );
        removeLinkButton.addEventListener("click", () => {
            removeReferenceLink(this.FileBaseName, this.currentMd);
            myModal.close();
        });
    }
    showPrompt() {
        const prompt = this.contentEl.createEl("span", {
            text: "Detected that the image you are attempting to delete is being referenced multiple times within the current document. \n As a result. We kindly ask that you manually remove the link.",
        });
        prompt.addClass("fast-image-cleaner-prompt");
        this.showLogs();
    }
}
