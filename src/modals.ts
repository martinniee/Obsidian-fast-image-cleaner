import { Modal, App, TFile } from 'obsidian';
import { removeReferenceLink } from "./util";

export class LogsModal extends Modal {

    
    
    

    textToView: string[]; 
    currentMd: TFile;
    FileBaseName: string;
    
    constructor(currentMd: TFile, FileBaseName: string ,textToView: string[], app: App) {
        super(app);
        this.textToView = textToView;
        this.currentMd = currentMd;
        this.FileBaseName = FileBaseName;
    }

    getLog(): string{
        const CurFirstMd: string = this.textToView.shift() as string;
        const curMd: string = "The md document that currently references the attachment: </br>" + CurFirstMd + "</br></br>";

        let otherMds: string = this.textToView.join("</br>");
        otherMds = "List of all documents that reference this attachment: </br>" + otherMds;
        const log: string = curMd + otherMds;
        return log;
    }
    
    onOpen() {
        const { contentEl } = this;
        const myModal = this;

        
        const headerWrapper = contentEl.createEl('div');
        headerWrapper.addClass('fast-attachment-cleaner-center-wrapper');
       
        
        const headerEl = headerWrapper.createEl('h1', { text: ' Detection of multiple attachment reference links - logs ' });
        headerEl.addClass('modal-title');
       

        
        const logs = contentEl.createEl('div');
        logs.addClass('fast-attachment-cleaner-log');
        logs.innerHTML = this.getLog();
        

        
        const buttonWrapper = contentEl.createEl('div');
        buttonWrapper.addClass('fast-attachment-cleaner-center-wrapper');

        const closeButton = buttonWrapper.createEl('button', { text: 'close' });
        const removeLinkButton = buttonWrapper.createEl('button', { text: 'remove link' });

        closeButton.setAttribute("aria-label","close the window");
        removeLinkButton.setAttribute("aria-label","Continue to remove the reference link to the current attachment in the current document");
        closeButton.addEventListener('click', () => {
            myModal.close();
        });
        removeLinkButton.addEventListener('click', () => {
            removeReferenceLink(this.FileBaseName,this.currentMd)
            myModal.close();
        });
    }
}