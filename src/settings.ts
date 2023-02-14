import NathanDeletefile from './main';
import { PluginSettingTab, Setting, App } from 'obsidian';


// 插件选项的接口
export interface NathanDeleteAttactmentSettings {
    deleteOption: string;
    logsModal: boolean;
}

export const DEFAULT_SETTINGS: NathanDeleteAttactmentSettings = {
    deleteOption: '.trash',
    logsModal: true,

};

// 定义插件选项类
export class NathanDeleteAttactmentSettingsTab extends PluginSettingTab {
    // 将插件类作为插件选项类的属性
    plugin: NathanDeletefile;

    // 插件选项结构体
    constructor(app: App, plugin: NathanDeletefile) {
        super(app, plugin);
        this.plugin = plugin;
    }

    // 重写 PluginSettingTab抽象类的 方法 display用于显示插件选项
    display(): void {
        const {containerEl}  = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Fast Attachment Cleaner Settings' });

        // 创建一个控制删除的附件目的地的选项
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
