import { Modal, App } from 'obsidian';


export class LogsModal extends Modal {

    // open() {
    //     throw new Error('Method not implemented.');
    // }

    textToView: string[];

    constructor(textToView: string[], app: App) {
        super(app);
        this.textToView = textToView;
    }

    getLog(): string{
        const fistEle: string = this.textToView.shift() as string;
        const cur_md: string = "当前引用该图片的md文档( The md document that currently references the image: ) \n" + fistEle + "\n\n";

        let other_md: string = this.textToView.join("\n");
        other_md = "全部引用该图片的文档列表(List of all documents that reference this image: \n" + other_md;
        const log: string = cur_md + other_md;
        return log;
    }
    
    onOpen() {
        const { contentEl } = this;
        const myModal = this;

        // 创建一个窗口
        const headerWrapper = contentEl.createEl('div');
        headerWrapper.addClass('fast-image-cleaner-center-wrapper');
       
        // 创建一个h1用于显示标题
        const headerEl = headerWrapper.createEl('h1', { text: '检测到该图片被多个文档同时引用,引用该图片的markdown文档列表如下 :' });
        headerEl.addClass('modal-title');
       
        const desc = contentEl.createEl("span", {text: 'Should the image be deleted, as it has been detected that it is being concurrently referenced by multiple documents? , The list of markdown documents that reference this image is as follows:'});
        desc.addClass("image-log-desc");

        // 创建一个输入框
        const logs = contentEl.createEl('textarea');
        logs.addClass('image-state-logs');
        logs.innerHTML = this.getLog();

        // 创建两个按钮,确定和取消
        const buttonWrapper = contentEl.createEl('div');
        buttonWrapper.addClass('fast-image-cleaner-center-wrapper');

        const cancelButton = buttonWrapper.createEl('button', { text: 'Cancel' });

        cancelButton.addClass('unused-images-button');
        cancelButton.addEventListener('click', () => {
            myModal.close();
        });
    }
}