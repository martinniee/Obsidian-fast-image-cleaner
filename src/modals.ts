import { Modal, App, TFile } from "obsidian";
import { delImgRefLink } from "./util";

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
		// if the deleted image referenced by mutilp notes
		if (this.state === 1) this.showLogs();
		const buttonWrapper = this.contentEl.createEl("div") as HTMLDivElement;
		buttonWrapper.addClass("fast-image-cleaner-center-wrapper");
		// if the deleted image referenced by mutilp notes
		if (this.state === 1) {
			this.showCloseBtn(buttonWrapper, this);
			this.showRemoveLinkBtn(buttonWrapper, this);
		}
		// the numbe of referencing the same image in current note  more than once
		if (this.state === 2) {
			this.showPrompt(this);
		}
	}
	showLogs() {
		const logs = this.contentEl.createEl("div");
		logs.addClass("fast-image-cleaner-log");
		logs.setText(this.getLog());
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
		removeLinkButton.addClass("mod-warning");
		removeLinkButton.addEventListener("click", async () => {
			await delImgRefLink.process({ FileBaseName: this.FileBaseName });
			myModal.close();
		});
	}
	showPrompt(myModal: Modal) {
		const prompt = this.contentEl.createEl("span", {
			text: "Detected that the image you are attempting to delete is being referenced multiple times within the current document. \n As a result. We kindly ask that you manually remove the link.",
		});
		prompt.addClass("fast-image-cleaner-prompt");
		const buttonWrapper = this.contentEl.createEl("div") as HTMLDivElement;
		const closeButton = buttonWrapper.createEl("button", {
			text: "close",
		});
		closeButton.setAttribute("aria-label", "close the window");
		closeButton.addEventListener("click", () => {
			myModal.close();
		});
	}
}
