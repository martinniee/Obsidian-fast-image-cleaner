import { TFile, Notice} from 'obsidian';
import NathanDeleteImage from "./main"


const SUCCESS_NOTICE_TIMEOUT = 1800;




/**
 * 函数表示从目标字符串origin_str中去除根据正则表达式regex匹配的出来的文本
 * @param origin_str     原始目标字符串
 * @param regex     正则表达式
 */ 
const trimFromRegExp = (origin_str: string,regex: RegExp): string => {
   // 获取所有的匹配内容包含信息的二位数组。第一维储存所有的匹配内容，第二维储存某个匹配内容相关的数据
   // 注意：二维数组的第二维度的第一项表示匹配的内容 Group0（不包括所有可能的匹配组,Group1,2,3...）
   const matching_array = Array.from(origin_str.matchAll(regex));
   // 4.遍历 依次所有的匹配内容matching_array[i][0] 从 目标字符串origin_str 去除
   for (let i = 0; i < matching_array.length; i++) {
       // 将目标字符串中的 匹配字符串用 ''替换,将替换后的结果覆盖 目标字符串
       origin_str = origin_str.replace(matching_array[i][0],'')
   }
   return origin_str;
}


/**
 * 移除图片引用链接
 * 
 * 
 * @param imagePath  图片的链接路径，不包括父级目录，为 图片文件名.后缀 形式
 * @param mdFile  需要删除的图片所在的md文件
 */
export const removeReferenceLink = async (imagePath: string, mdFile: TFile)=> {
        const origin_filecontents = await app.vault.read(mdFile);
        const new_filecontents: string[] = [];

        const fileContents_array = origin_filecontents.split("\n");
        
        for (const fileContent of fileContents_array ) {
            // fileContent 表示遍历的某一行 
            const regRefLink1 = new  RegExp("!\\[(.*)?\\]\\(((.*\\/)+)?"+imagePath+"\\)",'gm'); // markdown
            const regRefLink2 = new  RegExp("!\\[\\[.*?"+imagePath+"\\]\\]",'gm'); // wiki
            
            const isEscaped = fileContent.includes("%20");

            // 如果当前行包含 %20 ,说明路径中含有空格，需要解码为空格
            const fileContent_decode = decodeURI(fileContent);

            const isIncludeImage = fileContent_decode.includes(imagePath);
            const isMarkdownStyle= fileContent_decode.match(regRefLink1) !=null;
            const isWikiStyle= fileContent_decode.match(regRefLink2) !=null;

            if(isEscaped){
                // 判断当前行是否要移除的图片所在的行，并且引用链接是否为markdown格式
                if (isIncludeImage && isMarkdownStyle) {
                    // 获取去除 引用链接后的 内容
                    new_filecontents.push(trimFromRegExp(fileContent_decode,regRefLink1));
                    // 判断当前行是否要移除的图片所在的行，并且引用链接是否为markdown格式
                } else if (isIncludeImage && isWikiStyle ) { 
                    new_filecontents.push(trimFromRegExp(fileContent_decode,regRefLink2))
                }else{
                    // 拼接 每行内容 作为新的文档内容，包括移除引用链接的行
                    new_filecontents.push(fileContent)
                }
            }else{
                // 判断当前行是否要移除的图片所在的行，并且引用链接是否为markdown格式
                if (isIncludeImage && isMarkdownStyle) {
                    // 获取去除 引用链接后的 内容
                    new_filecontents.push(trimFromRegExp(fileContent_decode,regRefLink1));
                    // 判断当前行是否要移除的图片所在的行，并且引用链接是否为markdown格式
                } else if (isIncludeImage && isWikiStyle ) { 
                    new_filecontents.push(trimFromRegExp(fileContent_decode,regRefLink2))
                }else{
                    // 拼接 每行内容 作为新的文档内容，包括移除引用链接的行
                    new_filecontents.push(fileContent)
                }
            }
        }
        // 写入文档
        app.vault.adapter.write(mdFile.path,new_filecontents.join("\n"));
}






   

/**
 * 用于判断是否删除图片，如果同一张图片被多个文档引用，则默认不删除，如果需要删除，则点击确定按钮
    1.遍历获取文档中所有md文档，然后获取文档引用的所有图片
    2.遍历所有图片并于当前的图片对比，如果相等，则记录这个md文档，计数器+1，然后进入下轮遍历（因为可能一个文档存在引用同一个图片多次的情况）对比匹配后只需要记录+1一次。
    3.遍历完后，如果计数器的值>1,说明至少两个文档同时引用相同的图片
 */
export const isRemoveImage = (imageName: string): [boolean,string[]] => {
    const currentMd = app.workspace.getActiveFile() as TFile;
    const de_img = getImageFileByName(currentMd,imageName) as TFile | undefined;
    // 定义一个数组保存md文档信息
    const md_path: string[] = [];
    let cur_md_path = '';
    // const md_path: Set<string> = new Set([]);
    // 定义一个计数器用于储存 同一个图片被多个md文档引用的文档个数
    let ref_num = 0;
    const resolvedLinks = app.metadataCache.resolvedLinks;
        // 得到 删除图片对应的基于库的绝对路径,也就是imageFile的库的绝对路径
        // const imageFileFullPath: string = app.vault.getResourcePath(imageFile);
        // const img_file = app.vault.getAbstractFileByPath(imageFileFullPath) as TAbstractFile;
        // console.log("de_img path--------" +de_img.path)
        // const path_valt_based = img_file?.path;
        for (const [mdFile, links] of Object.entries(resolvedLinks)) {
            // filePath 是源文件引用的目标文件的链接路径, nr是引用的数量
            if(currentMd.path === mdFile){
                // 如果遍历到当前打开的md文档,则将路径path保存在 cur_md_path中
                cur_md_path = currentMd.path;
                md_path.unshift(cur_md_path)
            }
            for (const [filePath, nr] of Object.entries(links)) {
                if (de_img?.path === filePath) {
                    ref_num++;
                    if (nr > 1) {
                        // 说明当前文档引用同一个图片两次
                        ref_num+=1;
                        // break; //则跳出当前循环
                    }
                    // 说明此时引用的图片 = 删除的图片，记录md信息
                    md_path.push(mdFile)
                }
            }
        }
        // console.log("ref_num----" + ref_num);
    const result: boolean = ref_num > 1 ? false : true;
    return [result,md_path];
};


/**
 * 	通过当前md文件和图片名 获取 图片文件对象   ，类型为TFile
 * 
  	@param currentMd  当前需要被删除的图片所在的markdown文件
  	@param imageName  当前需要被删除的图片名 name.extension
 *  @returns  imageFile
 */

export const getImageFileByName = (currentMd: TFile, imageName: string): TFile | undefined => {
	const resolvedLinks = app.metadataCache.resolvedLinks;
	for (const [mdFile, links] of Object.entries(resolvedLinks)) {
		if (currentMd.path === mdFile) {
			for (const [filePath, nr] of Object.entries(links)) {
				if (filePath.includes(imageName)) {
					try {
                        const imageFile: TFile = app.vault.getAbstractFileByPath(filePath) as TFile;
                        if (imageFile instanceof TFile) {
                            return imageFile;
                        }
                    } catch (error) {
                        new Notice(` cannot get the image file`);
                        return undefined;
                    }
				}
			}
		}
	}  
};

/**
 * 删除图片文件 （附件引用链接，附件文件）
 * 
 * @param targetImg 图片html元素对象
 * @param imageName  图片基本名称 name.extension 
 * @param plugin 当前插件
 * @returns 
 */
export const deleteImg = (targetImg: HTMLImageElement, imageName: string, plugin: NathanDeleteImage) => {
    const deleteOption = plugin.settings.deleteOption;
    let file: TFile;
    const imgType = targetImg.localName;
    switch (imgType) {
        // 当事件作用的目标元素是img标签时
        case "img": {
            // 获取图片元素的 url 格式为 app://local/D:/路径.../文件名.png?1668149164011
            const imageUrl = targetImg.currentSrc;
            const thisURL = new URL(imageUrl);
            const currentMd = app.workspace.getActiveFile() as TFile;
            file =  getImageFileByName(currentMd,imageName) as TFile;
            const Proto = thisURL.protocol;
            switch (Proto) {
                case "app:":
                case "data:":
                case "http:":
                case "https:":
                        // 删除图片的dom结构
                        // removeImgDom(imageDom);
                        removeReferenceLink(imageName,app.workspace.getActiveFile() as TFile);
                        if (deleteOption === ".trash") {
                            // 删除图片
                            app.vault.trash(file, false);
                            // console.log( "--图片--" + thisURL + "被删除了");
                            new Notice("Image moved to Obsidian Trash !",SUCCESS_NOTICE_TIMEOUT);
                        } else if (deleteOption === "system-trash") {
                            // 删除图片
                            app.vault.trash(file, true);
                            // console.log("--图片--" + thisURL + "被删除了");
                            new Notice("Image moved to System Trash !",SUCCESS_NOTICE_TIMEOUT);
                        } else if (deleteOption === "permanent") {
                            // 删除图片
                            app.vault.delete(file);
                            // console.log("--图片--" + thisURL + "被删除了");
                            new Notice("Image deleted Permanently !",SUCCESS_NOTICE_TIMEOUT);
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

