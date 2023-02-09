import { Modal, App, TFile } from 'obsidian';
import { removeReferenceLink } from "./util";

export class LogsModal extends Modal {

    // open() {
    //     throw new Error('Method not implemented.');
    // }

    textToView: string[]; 
    currentMd: TFile;
    imgBaseName: string;
    
    constructor(currentMd: TFile, imgBaseName: string ,textToView: string[], app: App) {
        super(app);
        this.textToView = textToView;
        this.currentMd = currentMd;
        this.imgBaseName = imgBaseName;
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

        // --------创建一个窗口--------
        const headerWrapper = contentEl.createEl('div');
        headerWrapper.addClass('fast-image-cleaner-center-wrapper');
       
        // --------创建一个h1用于显示标题--------
        const headerEl = headerWrapper.createEl('h1', { text: ' Detection of multiple image reference links - logs ' });
        headerEl.addClass('modal-title');
       

        // --------创建一个日志内容框--------
        const logs = contentEl.createEl('div');
        logs.addClass('fast-image-cleaner-log');
        logs.innerHTML = this.getLog();
        

        // ----------创建两个按钮,确定和取消---------------
        const buttonWrapper = contentEl.createEl('div');
        buttonWrapper.addClass('fast-image-cleaner-center-wrapper');

        const closeButton = buttonWrapper.createEl('button', { text: 'close' });
        const removeLinkButton = buttonWrapper.createEl('button', { text: 'remove link' });


        closeButton.addClass('unused-images-button');
        closeButton.setAttribute("aria-label","close the window");
        removeLinkButton.addClass('unused-images-button');
        removeLinkButton.setAttribute("aria-label","Continue to remove the reference link to the current image in the current document");
        closeButton.addEventListener('click', () => {
            myModal.close();
        });
        removeLinkButton.addEventListener('click', () => {
            removeReferenceLink(this.imgBaseName,this.currentMd)
        });
    }
}