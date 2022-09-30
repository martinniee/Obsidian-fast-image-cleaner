import NathanDeleteImage from "./main";
import { PluginSettingTab, Setting, App } from "obsidian";

export interface NathanDeleteImageSettings {
	deleteOption: string;
}

export const DEFAULT_SETTINGS: NathanDeleteImageSettings = {
	deleteOption: ".trash",
};

export class NathanDeleteImageSettingsTab extends PluginSettingTab {
	plugin: NathanDeleteImage;

	constructor(app: App, plugin: NathanDeleteImage) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl("h2", { text: "Delete Image In Use Settings" });

		new Setting(containerEl)
			.setName("Deleted Image Destination")
			.setDesc(
				"Select where you want images to be moved once they are deleted"
			)
			.addDropdown((dropdown) => {
				dropdown.addOption("permanent", "Delete Permanently");
				dropdown.addOption(".trash", "Move to Obsidian Trash");
				dropdown.addOption("system-trash", "Move to System Trash");
				dropdown.setValue(this.plugin.settings.deleteOption);
				dropdown.onChange((option) => {
					this.plugin.settings.deleteOption = option;
					this.plugin.saveSettings();
				});
			});
	}
}
import NathanDeleteImage from "./main";
import { PluginSettingTab, Setting, App } from "obsidian";

export interface NathanDeleteImageSettings {
	deleteOption: string;
}

export const DEFAULT_SETTINGS: NathanDeleteImageSettings = {
	deleteOption: ".trash",
};

export class NathanDeleteImageSettingsTab extends PluginSettingTab {
	plugin: NathanDeleteImage;

	constructor(app: App, plugin: NathanDeleteImage) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl("h2", { text: "Delete Image In Use Settings" });

		new Setting(containerEl)
			.setName("Deleted Image Destination")
			.setDesc(
				"Select where you want images to be moved once they are deleted"
			)
			.addDropdown((dropdown) => {
				dropdown.addOption("permanent", "Delete Permanently");
				dropdown.addOption(".trash", "Move to Obsidian Trash");
				dropdown.addOption("system-trash", "Move to System Trash");
				dropdown.setValue(this.plugin.settings.deleteOption);
				dropdown.onChange((option) => {
					this.plugin.settings.deleteOption = option;
					this.plugin.saveSettings();
				});
			});
	}
}
