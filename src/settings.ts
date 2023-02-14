import NathanDeletefile from './main';
import { PluginSettingTab, Setting, App } from 'obsidian';



export interface NathanDeleteAttactmentSettings {
    deleteOption: string;
    logsModal: boolean;
}

export const DEFAULT_SETTINGS: NathanDeleteAttactmentSettings = {
    deleteOption: '.trash',
    logsModal: true,

};


export class NathanDeleteAttactmentSettingsTab extends PluginSettingTab {
    
    plugin: NathanDeletefile;

    
    constructor(app: App, plugin: NathanDeletefile) {
        super(app, plugin);
        this.plugin = plugin;
    }

    
    display(): void {
        const {containerEl}  = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Fast Attachment Cleaner Settings' });

        
        new Setting(containerEl)
            .setName('Deleted Attachment Destination')
            .setDesc('Select where you want Attachments to be moved once they are deleted')
            .addDropdown((dropdown) => {
                dropdown.addOption('permanent', 'Delete Permanently');
                dropdown.addOption('.trash', 'Move to Obsidian Trash');
                dropdown.addOption('system-trash', 'Move to System Trash');
                dropdown.setValue(this.plugin.settings.deleteOption);
                dropdown.onChange((option) => {
                    this.plugin.settings.deleteOption = option;
                    this.plugin.saveSettings();
                });
            });
    }
}
