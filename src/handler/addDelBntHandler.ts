import { TFile } from "obsidian";
import NathanDeletefile from "src/main";
import * as Util from "../util";

/**
 * 获取实时预览模式下 内容区的所有图片div (.view-content .markdown-source-view.is-live.preview)
 * 通过这个div结合 addDelBtn( getAllImgDivs )来确定要添加的按钮的位置实现删除按钮的添加
 * 
 * @returns 由实时预览模式下内容区所有图片区域div元素组成的集合
 */
export const getAllImgDivs = (): HTMLCollection => {
    
    const leaf_active: HTMLCollection = document.getElementsByClassName("workspace-leaf mod-active");
    
    const preview_content: HTMLCollection = leaf_active[0].getElementsByClassName("markdown-source-view cm-s-obsidian mod-cm6 is-folding is-live-preview node-insert-event");
    
    const embed_divs: HTMLCollection = preview_content[0]?.getElementsByClassName("internal-embed media-embed image-embed is-loaded");
    return embed_divs;
};
/**
 * * 为页面中所有图片元素动态地添加删除按钮
 * 
 * @param img_list 图片区域div元素集合，文档中图片元素区域div对象集合，img_list中的元素是img标签的父级div标签对象
 */
export const addDelBtn = (img_list: HTMLCollection) => {
    for (let index = 0; index < img_list?.length; index++) {
        const btn_del: HTMLButtonElement = document.createElement("button");
        
        btn_del.setAttribute("class", "btn-delete");
        btn_del.setAttribute("aria-label","Delete current image");
        
        btn_del.innerHTML = '<svg fill="#ff0000" xmlns="http:
        
        img_list[index].appendChild(btn_del);
    }
};

/**
 * 清除创建的所有的删除附件的删除按钮
 * 当文档状态发生变化，如 编辑，粘贴，打开，通过leaf回退的时候，重新添加删除按钮
 */
export const clearAllDelBtns = () => {
    const btn_dels :HTMLCollection = document.getElementsByClassName("btn-delete") as HTMLCollection;
    Array.from(btn_dels).forEach( (btn_del) => {
        btn_del.parentNode?.removeChild(btn_del);
    });
}
/**
     * 当点击删除按钮时，处理删除图片事件
     * 
     * @param target  鼠标事件的目标元素
     * @param plugin  NathanDeletefile
     * 
     * @returns 
     */
export const clearImgByDelBnt = (target: HTMLElement, currentMd: TFile,plugin: NathanDeletefile) => {
		
		
        const RegFileBaseName = new RegExp('\\/?([^\\/\\n]+\\.\\w+)', 'm');
        const  delBtn = target.closest(".btn-delete") as HTMLButtonElement;
        const imgTarget = delBtn.parentNode?.querySelector("img") as HTMLImageElement;
        const imgSrcPath = imgTarget.parentElement?.getAttribute("src") as string;
        const FileBaseName = (imgSrcPath?.match(RegFileBaseName) as string[])[1];
        Util.handlerDelFile(FileBaseName,currentMd,plugin);
}