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
        const cur_md: string = "The md document that currently references the image: </br>" + fistEle + "</br></br>";

        let other_md: string = this.textToView.join("</br>");
        other_md = "List of all documents that reference this image: </br>" + other_md;
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
        const headerEl = headerWrapper.createEl('h1', { text: ' Detection of multiple image reference links - logs ' });
        headerEl.addClass('modal-title');
       

        // 创建一个输入框
        const logs = contentEl.createEl('div');
        logs.addClass('.fast-image-cleaner-log');
        logs.innerHTML = this.getLog();
        

        // 创建两个按钮,确定和取消
        const buttonWrapper = contentEl.createEl('div');
        buttonWrapper.addClass('fast-image-cleaner-center-wrapper');

        const cancelButton = buttonWrapper.createEl('button', { text: 'close' });

        cancelButton.addClass('unused-images-button');
        cancelButton.addEventListener('click', () => {
            myModal.close();
        });
    }
}