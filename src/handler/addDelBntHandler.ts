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
        btn_del.setAttribute("aria-label", "Delete current image");

        btn_del.innerHTML = '<svg fill="#ff0000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="48px" height="48px"><path d="M 28 7 C 25.243 7 23 9.243 23 12 L 23 15 L 13 15 C 11.896 15 11 15.896 11 17 C 11 18.104 11.896 19 13 19 L 15.109375 19 L 16.792969 49.332031 C 16.970969 52.510031 19.600203 55 22.783203 55 L 41.216797 55 C 44.398797 55 47.029031 52.510031 47.207031 49.332031 L 48.890625 19 L 51 19 C 52.104 19 53 18.104 53 17 C 53 15.896 52.104 15 51 15 L 41 15 L 41 12 C 41 9.243 38.757 7 36 7 L 28 7 z M 28 11 L 36 11 C 36.552 11 37 11.449 37 12 L 37 15 L 27 15 L 27 12 C 27 11.449 27.448 11 28 11 z M 19.113281 19 L 44.886719 19 L 43.212891 49.109375 C 43.153891 50.169375 42.277797 51 41.216797 51 L 22.783203 51 C 21.723203 51 20.846109 50.170328 20.787109 49.111328 L 19.113281 19 z M 32 23.25 C 31.033 23.25 30.25 24.034 30.25 25 L 30.25 45 C 30.25 45.966 31.033 46.75 32 46.75 C 32.967 46.75 33.75 45.966 33.75 45 L 33.75 25 C 33.75 24.034 32.967 23.25 32 23.25 z M 24.642578 23.251953 C 23.677578 23.285953 22.922078 24.094547 22.955078 25.060547 L 23.652344 45.146484 C 23.685344 46.091484 24.462391 46.835938 25.400391 46.835938 C 25.421391 46.835938 25.441891 46.835938 25.462891 46.835938 C 26.427891 46.801938 27.183391 45.991391 27.150391 45.025391 L 26.453125 24.939453 C 26.419125 23.974453 25.606578 23.228953 24.642578 23.251953 z M 39.355469 23.251953 C 38.388469 23.224953 37.580875 23.974453 37.546875 24.939453 L 36.849609 45.025391 C 36.815609 45.991391 37.571109 46.801938 38.537109 46.835938 C 38.558109 46.836938 38.578609 46.835938 38.599609 46.835938 C 39.537609 46.835938 40.314656 46.091484 40.347656 45.146484 L 41.044922 25.060547 C 41.078922 24.094547 40.321469 23.285953 39.355469 23.251953 z" /></svg>';

        img_list[index].appendChild(btn_del);
    }
};

/**
 * 清除创建的所有的删除附件的删除按钮
 * 当文档状态发生变化，如 编辑，粘贴，打开，通过leaf回退的时候，重新添加删除按钮
 */
export const clearAllDelBtns = () => {
    const btn_dels: HTMLCollection = document.getElementsByClassName("btn-delete") as HTMLCollection;
    Array.from(btn_dels).forEach((btn_del) => {
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
export const clearImgByDelBnt = (target: HTMLElement, currentMd: TFile, plugin: NathanDeletefile) => {


    const RegFileBaseName = new RegExp('\\/?([^\\/\\n]+\\.\\w+)', 'm');
    const delBtn = target.closest(".btn-delete") as HTMLButtonElement;
    const imgTarget = delBtn.parentNode?.querySelector("img") as HTMLImageElement;
    const imgSrcPath = imgTarget.parentElement?.getAttribute("src") as string;
    const FileBaseName = (imgSrcPath?.match(RegFileBaseName) as string[])[1];
    Util.handlerDelFile(FileBaseName, currentMd, plugin);
}