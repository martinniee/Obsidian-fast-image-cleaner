import NathanDeleteImage from './main';
import { PluginSettingTab, Setting, App } from 'obsidian';


// 插件选项的接口
export interface NathanDeleteImageSettings {
    deleteOption: string;
}

export const DEFAULT_SETTINGS: NathanDeleteImageSettings = {
    deleteOption: '.trash',
};

// 定义插件选项类
export class NathanDeleteImageSettingsTab extends PluginSettingTab {
    // 将插件类作为插件选项类的属性
    plugin: NathanDeleteImage;

    // 插件选项结构体
    constructor(app: App, plugin: NathanDeleteImage) {
        super(app, plugin);
        this.plugin = plugin;
    }

    // 重写 PluginSettingTab抽象类的 方法 display用于显示插件选项
    display(): void {
        const {containerEl}  = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Delete Image By Context-menu Settings' });

        // 创建一个控制删除的图片目的地的选项
        new Setting(containerEl)
            .setName('Deleted Image Destination')
            .setDesc('Select where you want images to be moved once they are deleted')
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
