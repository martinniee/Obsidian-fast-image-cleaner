import { TFile, Notice} from 'obsidian';
import NathanDeleteImage from "./main"

const imageExtensions: Set<string> = new Set(['jpeg', 'jpg', 'png', 'gif', 'svg', 'bmp']);
const SUCCESS_NOTICE_TIMEOUT = 1800;

/**
	 * 获取实时预览模式下 内容区的所有图片div (.view-content .markdown-source-view.is-live.preview)
	 * @returns 由实时预览模式下内容区所有图片区域div元素组成的集合
	 */
export const getAllImgDivs = (): HTMLCollection => {
    // 1.得 到当前激活的tab页div leaf_active
    const leaf_active: HTMLCollection = document.getElementsByClassName("workspace-leaf mod-active");
    // 2.得 实时预览模式 下 内容区div preview_content (div markdown-source-view cm-s-obsidian mod-cm6 is-readable-line-width is-folding is-live-preview node-insert-event)
    const preview_content: HTMLCollection = leaf_active[0].getElementsByClassName("markdown-source-view cm-s-obsidian mod-cm6 is-folding is-live-preview node-insert-event");
    // 3.得 内容区下所有图片附件div embed_divs
    const embed_divs: HTMLCollection = preview_content[0].getElementsByClassName("internal-embed image-embed is-loaded");
    return embed_divs;
};
/**
 * 移除元素的dom结构从文档中f
 * @param target 需要被移除的元素（img）
 */
export const removeImgDom = (target: HTMLElement) => {
    // 1、获取图片元素父级img_div
    const img_div: HTMLDivElement = target.parentElement as HTMLDivElement;
    // 2、获取img_div的父级div content_container
    const content_container: HTMLDivElement = target.parentElement
        ?.parentElement as HTMLDivElement;
    // 3、删除img_div元素
    content_container.removeChild(img_div);
};

/**
 * * 为页面中所有图片元素动态地添加删除按钮
 * @param img_list 图片区域div元素集合，文档中图片元素区域div对象集合，img_list中的元素是img标签的父级div标签对象
 */
export const addDelBtn = (img_list: HTMLCollection) => {
    for (let index = 0; index < img_list.length; index++) {
        const btn_del: HTMLButtonElement = document.createElement("button");
        // 1、动态生成删除按钮 btn_del
        btn_del.setAttribute("class", "btn-delete");
        btn_del.setAttribute("aria-label","删除图片");
        // 将svg作为按钮子元素，并作为按钮的图标显示
        btn_del.innerHTML = '<svg fill="#ff0000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="48px" height="48px"><path d="M 28 7 C 25.243 7 23 9.243 23 12 L 23 15 L 13 15 C 11.896 15 11 15.896 11 17 C 11 18.104 11.896 19 13 19 L 15.109375 19 L 16.792969 49.332031 C 16.970969 52.510031 19.600203 55 22.783203 55 L 41.216797 55 C 44.398797 55 47.029031 52.510031 47.207031 49.332031 L 48.890625 19 L 51 19 C 52.104 19 53 18.104 53 17 C 53 15.896 52.104 15 51 15 L 41 15 L 41 12 C 41 9.243 38.757 7 36 7 L 28 7 z M 28 11 L 36 11 C 36.552 11 37 11.449 37 12 L 37 15 L 27 15 L 27 12 C 27 11.449 27.448 11 28 11 z M 19.113281 19 L 44.886719 19 L 43.212891 49.109375 C 43.153891 50.169375 42.277797 51 41.216797 51 L 22.783203 51 C 21.723203 51 20.846109 50.170328 20.787109 49.111328 L 19.113281 19 z M 32 23.25 C 31.033 23.25 30.25 24.034 30.25 25 L 30.25 45 C 30.25 45.966 31.033 46.75 32 46.75 C 32.967 46.75 33.75 45.966 33.75 45 L 33.75 25 C 33.75 24.034 32.967 23.25 32 23.25 z M 24.642578 23.251953 C 23.677578 23.285953 22.922078 24.094547 22.955078 25.060547 L 23.652344 45.146484 C 23.685344 46.091484 24.462391 46.835938 25.400391 46.835938 C 25.421391 46.835938 25.441891 46.835938 25.462891 46.835938 C 26.427891 46.801938 27.183391 45.991391 27.150391 45.025391 L 26.453125 24.939453 C 26.419125 23.974453 25.606578 23.228953 24.642578 23.251953 z M 39.355469 23.251953 C 38.388469 23.224953 37.580875 23.974453 37.546875 24.939453 L 36.849609 45.025391 C 36.815609 45.991391 37.571109 46.801938 38.537109 46.835938 C 38.558109 46.836938 38.578609 46.835938 38.599609 46.835938 C 39.537609 46.835938 40.314656 46.091484 40.347656 45.146484 L 41.044922 25.060547 C 41.078922 24.094547 40.321469 23.285953 39.355469 23.251953 z" /></svg>';
        // 2、依次将按钮渲染到图片区域
        img_list[index].appendChild(btn_del);
    }
};
export const clearAllDelBtns = () => {
    const btn_dels :HTMLCollection = document.getElementsByClassName("btn-delete") as HTMLCollection;
    Array.from(btn_dels).forEach( (btn_del) => {
        btn_del.parentNode?.removeChild(btn_del);
    });
}
/**
 * 获取指定格式的需要被删除的图片文件的文件列表，列表元素为图片文件类型的TFile类型对象
 * @param app
 * @returns  attachments 包含图片文件File类型对象的数组 TFile[]
 */
export const getAllImages = (): TFile[] => {
    // 获取库中所有文件
    const allFiles: TFile[] = app.vault.getFiles();
    const attachments: TFile[] = [];
    for (let i = 0; i < allFiles.length; i++) {
        // 排除文件是.md文档的情况，也就是当文件为附件的时候
        if (allFiles[i].extension !== "md") {
            // 判断是否是设定的图片文件，是就将图片放入新的数组attachments
            if (imageExtensions.has(allFiles[i].extension.toLowerCase())) {
                attachments.push(allFiles[i]);
            }
        }
    }
    // 返回 附件数组 attachments
    return attachments;
};

/**
 * 通过图片文件的全路径URL字符串 获取 对应的图片的文件TFile类型对象
 * @param imageURL  图片的全路径字符串
 * @returns imageFile
 */
export const getImgByURL= (imageURL: string): TFile[] => {
    let imageFileFullPath: string;
    const file: TFile[] = [];
    const allImageFiles: TFile[] = getAllImages();
    allImageFiles.forEach((imageFile) => {
        imageFileFullPath = app.vault.getResourcePath(imageFile);
        if (imageURL === imageFileFullPath) {
            // 如果当前图片URL 等于 通过图片文件获取的图片URL,则返回当前图片文件对象
            file.push(imageFile);
        }
    });
        return file;
};

   

/**
 * 用于判断是否删除图片，如果同一张图片被多个文档引用，则默认不删除，如果需要删除，则点击确定按钮
    1.遍历获取文档中所有md文档，然后获取文档引用的所有图片
    2.遍历所有图片并于当前的图片对比，如果相等，则记录这个md文档，计数器+1，然后进入下轮遍历（因为可能一个文档存在引用同一个图片多次的情况）对比匹配后只需要记录+1一次。
    3.遍历完后，如果计数器的值>1,说明至少两个文档同时引用相同的图片
 */
export const isRemoveImage = (img_url: string): [boolean,string[]] => {
    // 获取当前删除图片元素的图片对象TFile类型
    const de_img: TFile[] = getImgByURL(img_url);
    // 定义一个数组保存md文档信息
    const md_path: string[] = [];
    let cur_md_path = '';
    // const md_path: Set<string> = new Set([]);
    // 定义一个计数器用于储存 同一个图片被多个md文档引用的文档个数
    let ref_num = 0;
    const resolvedLinks = app.metadataCache.resolvedLinks;
    const current_md: TFile = app.workspace.getActiveFile() as TFile;
        // 得到 删除图片对应的基于库的绝对路径,也就是imageFile的库的绝对路径
        // const imageFileFullPath: string = app.vault.getResourcePath(imageFile);
        // const img_file = app.vault.getAbstractFileByPath(imageFileFullPath) as TAbstractFile;
        // console.log("de_img path--------" +de_img.path)
        // const path_valt_based = img_file?.path;
        for (const [mdFile, links] of Object.entries(resolvedLinks)) {
            // filePath 是源文件引用的目标文件的链接路径, nr是引用的数量
            if(current_md.path === mdFile){
                // 如果遍历到当前打开的md文档,则将路径path保存在 cur_md_path中
                cur_md_path = current_md.path;
                md_path.unshift(cur_md_path)
            }
            for (const [filePath, nr] of Object.entries(links)) {
            if (de_img[0].path === filePath) {
                ref_num++;
                if (nr > 1) {
                    // 说明当前文档引用同一个图片两次
                    break; //则跳出当前循环
                }
                // 说明此时引用的图片 = 删除的图片，记录md信息
                md_path.push(mdFile)
            }
            }
        //   break; //则跳出当前循环，继续遍历下一个md文档
        }
        console.log("ref_num----" + ref_num);
        console.log("----------222222222222222")
    const result: boolean = ref_num > 1 ? false : true;
    return [result,md_path];
};
    
/**
 * 得到图片url得到
 */
/**
 * 删除图片
 * @param target_img 图片元素对象
 */
export const deleteImg = (target_img: HTMLImageElement, plugin: NathanDeleteImage) => {
    const deleteOption = plugin.settings.deleteOption;
    let file: TFile;
    const imgType = target_img.localName;
    switch (imgType) {
        // 当事件作用的目标元素是img标签时
        case "img": {
            // 获取图片元素的 url 格式为 app://local/D:/路径.../文件名.png?1668149164011
            const img_url = target_img.currentSrc;
            const imageDom = target_img;
            const thisURL = new URL(img_url);
            file = getImgByURL(img_url)[0];
            const Proto = thisURL.protocol;
            switch (Proto) {
                case "app:":
                case "data:":
                case "http:":
                case "https:":
                        // 删除图片的dom结构
                        removeImgDom(imageDom);
                        if (deleteOption === ".trash") {
                            // 删除图片
                            app.vault.trash(file, false);
                            console.log( "--图片--" + thisURL + "被删除了");
                            new Notice("Image moved to Obsidian Trash !",SUCCESS_NOTICE_TIMEOUT);
                        } else if (deleteOption === "system-trash") {
                            // 删除图片
                            app.vault.trash(file, true);
                            console.log("--图片--" + thisURL + "被删除了");
                            new Notice("Image moved to System Trash !",SUCCESS_NOTICE_TIMEOUT);
                        } else if (deleteOption === "permanent") {
                            // 删除图片
                            app.vault.delete(file);
                            console.log("--图片--" + thisURL + "被删除了");new Notice("Image deleted Permanently !",SUCCESS_NOTICE_TIMEOUT);
                        }
                    // 
                    break;
                default:
                    new Notice(`no handler for ${Proto} protocol`);
                    return;
            }
            break;
        }
        default:
            new Notice("No handler for this image type!");
            return;
    }

    
};

