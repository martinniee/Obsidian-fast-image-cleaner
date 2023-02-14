import { TFile, Notice,} from "obsidian";
import NathanDeletefile from './main';
import { LogsModal } from "./modals";

const SUCCESS_NOTICE_TIMEOUT = 1800;


/**
 * 移除元素的dom结构从文档中
 * @param target 需要被移除的元素（img）
 */
export const removeImgDom = (target: HTMLElement) => {
    
    const img_div: HTMLDivElement = target.parentElement as HTMLDivElement;
    
    const content_container: HTMLDivElement = target.parentElement
        ?.parentElement as HTMLDivElement;
    
    content_container.removeChild(img_div);
};


/**
 * 从目标字符串origin_str中去除根据正则表达式regex匹配的出来的文本
 * @param origin_str     原始目标字符串
 * @param regex     正则表达式
 */
const trimFromRegExp = (origin_str: string, regex: RegExp): string => {
	
	
	const matching_array = Array.from(origin_str.matchAll(regex));
	
	for (let i = 0; i < matching_array.length; i++) {
		
		origin_str = origin_str.replace(matching_array[i][0], "");
	}
	return origin_str;
};

/**
 * 移除图片引用链接
 * 
 * 
 * @param imagePath  图片的链接路径，不包括父级目录，为 图片文件名.后缀 形式
 * @param mdFile  需要删除的图片所在的md文件
 */
export const removeReferenceLink = async (imagePath: string, mdFile: TFile) => {
	const origin_filecontents = await app.vault.read(mdFile);
	const new_filecontents: string[] = [];

	const fileContents_array = origin_filecontents.split("\n");

	for (const fileContent of fileContents_array) {
		
		const regRefLink1 = new RegExp(
			"!\\[(.*)?\\]\\(((.*\\/)+)?" + imagePath + "\\)",
			"gm"
		); 
		const regRefLink2 = new RegExp(
			"!\\[\\[.*?" + imagePath + "\\]\\]",
			"gm"
		); 

		const isEscaped = fileContent.includes("%20");

		
		const fileContent_decode = decodeURI(fileContent);

		const isIncludeImage = fileContent_decode.includes(imagePath);
		const isMarkdownStyle = fileContent_decode.match(regRefLink1) != null;
		const isWikiStyle = fileContent_decode.match(regRefLink2) != null;

		if (isEscaped) {
			
			if (isIncludeImage && isMarkdownStyle) {
				
				new_filecontents.push(
					trimFromRegExp(fileContent_decode, regRefLink1)
				);
				
			} else if (isIncludeImage && isWikiStyle) {
				new_filecontents.push(
					trimFromRegExp(fileContent_decode, regRefLink2)
				);
			} else {
				
				new_filecontents.push(fileContent);
			}
		} else {
			
			if (isIncludeImage && isMarkdownStyle) {
				
				new_filecontents.push(
					trimFromRegExp(fileContent_decode, regRefLink1)
				);
				
			} else if (isIncludeImage && isWikiStyle) {
				new_filecontents.push(
					trimFromRegExp(fileContent_decode, regRefLink2)
				);
			} else {
				
				new_filecontents.push(fileContent);
			}
		}
	}
	
	app.vault.adapter.write(mdFile.path, new_filecontents.join("\n"));
};

/**
 * 用于判断是否删除图片
 */
export const IsRemove = (FileBaseName: string): [boolean, string[]] => {
	const currentMd = app.workspace.getActiveFile() as TFile;
	const deletedTargetFile = getFileByBaseName(currentMd, FileBaseName) as
		| TFile
		| undefined;
	
	const mdPath: string[] = [];
	let CurMDPath = "";
	
	
	let refNum = 0;
	const resolvedLinks = app.metadataCache.resolvedLinks;
	
	
	
	
	
	for (const [mdFile, links] of Object.entries(resolvedLinks)) {
		
		if (currentMd.path === mdFile) {
			
			CurMDPath = currentMd.path;
			mdPath.unshift(CurMDPath);
		}
		for (const [filePath, nr] of Object.entries(links)) {
			if (deletedTargetFile?.path === filePath) {
				refNum++;
				if (nr > 1) {
					
					refNum += 1;
					
				}
				
				mdPath.push(mdFile);
			}
		}
	}
	
	const result: boolean = refNum > 1 ? false : true;
	return [result, mdPath];
};

/**
 * 	通过当前md文件和图片名 获取 图片文件对象   ，类型为TFile
 * 
  	@param currentMd  当前需要被删除的curMd所在的markdown文件
  	@param FileBaseName  当前需要被删除的curMd名 name.extension
 *  @returns  AttachFile
 */

export const getFileByBaseName = (
	currentMd: TFile,
	FileBaseName: string
): TFile | undefined => {
	const resolvedLinks = app.metadataCache.resolvedLinks;
	for (const [mdFile, links] of Object.entries(resolvedLinks)) {
		if (currentMd.path === mdFile) {
			for (const [filePath, nr] of Object.entries(links)) {
				if (filePath.includes(FileBaseName)) {
					try {
						const AttachFile: TFile =
							app.vault.getAbstractFileByPath(filePath) as TFile;
						if (AttachFile instanceof TFile) {
							return AttachFile;
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
 * 删除curMd文件 （附件引用链接，附件文件）
 *
 * @param FileBaseName  curMd基本名称 name.extension
 * @param plugin 当前插件
 * @returns
 */
export const ClearAttachment = (
	FileBaseName: string,
	plugin: NathanDeletefile
) => {
	const deleteOption = plugin.settings.deleteOption;
	const currentMd = app.workspace.getActiveFile() as TFile;
	const file = getFileByBaseName(currentMd, FileBaseName) as TFile;
	removeReferenceLink(FileBaseName, app.workspace.getActiveFile() as TFile);
	if (deleteOption === ".trash") {
		
		app.vault.trash(file, false);
		new Notice("Image moved to Obsidian Trash !", SUCCESS_NOTICE_TIMEOUT);
	} else if (deleteOption === "system-trash") {
		
		app.vault.trash(file, true);
		new Notice("Image moved to System Trash !", SUCCESS_NOTICE_TIMEOUT);
	} else if (deleteOption === "permanent") {
		
		app.vault.delete(file);
		new Notice("Image deleted Permanently !", SUCCESS_NOTICE_TIMEOUT);
	}
};

/**
	 * 处理图片删除
	 * 
	 * @param FileBaseName 
	 * @param currentMd 
	 */
export const handlerDelFile = (FileBaseName: string, currentMd: TFile, plugin: NathanDeletefile)=> {

	if (IsRemove(FileBaseName)[0] as boolean) {
		ClearAttachment(FileBaseName, plugin);
	} else {
		const logs: string[] = IsRemove(
			FileBaseName
		)[1] as string[];
		const modal = new LogsModal(
			currentMd,
			FileBaseName,
			logs,
			app
		);
		modal.open();
	}
}