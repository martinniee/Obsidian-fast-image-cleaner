import { TFile } from "obsidian";
import NathanImageCleaner from "src/main";

export interface processFunc {
	(
		contentsArr: string[],
		plugin?: NathanImageCleaner,
		params?: params
	): string[];
}
export interface params {
	[param: string]: any;
}
export class fileContentsProcess {
	#processFunc: processFunc;
	#delay: number = 1000;
	constructor(
		callback: processFunc, // function for core-logic for  text processsing
		delay: number = 1000 // if no value is passed, set 1000 as default
	) {
		this.#processFunc = callback;
		this.#delay = delay;
	}
	async process(params: params, plugin?: NathanImageCleaner): Promise<any> {
		const activeFile: TFile = app.workspace.getActiveFile() as TFile;
		const fileContents = (await app.vault.read(activeFile)).split("\n");
		let newFileContents: string[] = [];
		newFileContents = this.#processFunc(
			fileContents as string[],
			plugin as NathanImageCleaner,
			params as params
		);
		app.vault.adapter.write(activeFile.path, newFileContents.join("\n"));
		setTimeout(() => {
			return "OK";
		}, this.#delay);
	}
}
