import { TFile, Notice,} from "obsidian";
import NathanDeletefile from './main';
import { LogsModal } from "./modals";

const SUCCESS_NOTICE_TIMEOUT = 1800;


/**
 * 移除元素的dom结构从文档中
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
 * 函数表示从目标字符串origin_str中去除根据正则表达式regex匹配的出来的文本
 * @param origin_str     原始目标字符串
 * @param regex     正则表达式
 */
const trimFromRegExp = (origin_str: string, regex: RegExp): string => {
	// 获取所有的匹配内容包含信息的二位数组。第一维储存所有的匹配内容，第二维储存某个匹配内容相关的数据
	// 注意：二维数组的第二维度的第一项表示匹配的内容 Group0（不包括所有可能的匹配组,Group1,2,3...）
	const matching_array = Array.from(origin_str.matchAll(regex));
	// 4.遍历 依次所有的匹配内容matching_array[i][0] 从 目标字符串origin_str 去除
	for (let i = 0; i < matching_array.length; i++) {
		// 将目标字符串中的 匹配字符串用 ''替换,将替换后的结果覆盖 目标字符串
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
		// fileContent 表示遍历的某一行
		const regRefLink1 = new RegExp(
			"!\\[(.*)?\\]\\(((.*\\/)+)?" + imagePath + "\\)",
			"gm"
		); // markdown
		const regRefLink2 = new RegExp(
			"!\\[\\[.*?" + imagePath + "\\]\\]",
			"gm"
		); // wiki

		const isEscaped = fileContent.includes("%20");

		// 如果当前行包含 %20 ,说明路径中含有空格，需要解码为空格
		const fileContent_decode = decodeURI(fileContent);

		const isIncludeImage = fileContent_decode.includes(imagePath);
		const isMarkdownStyle = fileContent_decode.match(regRefLink1) != null;
		const isWikiStyle = fileContent_decode.match(regRefLink2) != null;

		if (isEscaped) {
			// 判断当前行是否要移除的curMd所在的行，并且引用链接是否为markdown格式
			if (isIncludeImage && isMarkdownStyle) {
				// 获取去除 引用链接后的 内容
				new_filecontents.push(
					trimFromRegExp(fileContent_decode, regRefLink1)
				);
				// 判断当前行是否要移除的curMd所在的行，并且引用链接是否为markdown格式
			} else if (isIncludeImage && isWikiStyle) {
				new_filecontents.push(
					trimFromRegExp(fileContent_decode, regRefLink2)
				);
			} else {
				// 拼接 每行内容 作为新的文档内容，包括移除引用链接的行
				new_filecontents.push(fileContent);
			}
		} else {
			// 判断当前行是否要移除的curMd所在的行，并且引用链接是否为markdown格式
			if (isIncludeImage && isMarkdownStyle) {
				// 获取去除 引用链接后的 内容
				new_filecontents.push(
					trimFromRegExp(fileContent_decode, regRefLink1)
				);
				// 判断当前行是否要移除的curMd所在的行，并且引用链接是否为markdown格式
			} else if (isIncludeImage && isWikiStyle) {
				new_filecontents.push(
					trimFromRegExp(fileContent_decode, regRefLink2)
				);
			} else {
				// 拼接 每行内容 作为新的文档内容，包括移除引用链接的行
				new_filecontents.push(fileContent);
			}
		}
	}
	// 写入文档
	app.vault.adapter.write(mdFile.path, new_filecontents.join("\n"));
};

/**
 * 用于判断是否删除curMd，如果同一张curMd被多个文档引用，则默认不删除，如果需要删除，则点击确定按钮
    1.遍历获取文档中所有md文档，然后获取文档引用的所有curMd
    2.遍历所有curMd并于当前的curMd对比，如果相等，则记录这个md文档，计数器+1，然后进入下轮遍历（因为可能一个文档存在引用同一个curMd多次的情况）对比匹配后只需要记录+1一次。
    3.遍历完后，如果计数器的值>1,说明至少两个文档同时引用相同的curMd
 */
export const IsRemove = (FileBaseName: string): [boolean, string[]] => {
	const currentMd = app.workspace.getActiveFile() as TFile;
	const deletedTargetFile = getFileByBaseName(currentMd, FileBaseName) as
		| TFile
		| undefined;
	// 定义一个数组保存md文档信息
	const mdPath: string[] = [];
	let CurMDPath = "";
	// const mdPath: Set<string> = new Set([]);
	// 定义一个计数器用于储存 同一个curMd被多个md文档引用的文档个数
	let refNum = 0;
	const resolvedLinks = app.metadataCache.resolvedLinks;
	// 得到 删除curMd对应的基于库的绝对路径,也就是AttachFile的库的绝对路径
	// const AttachFileFullPath: string = app.vault.getResourcePath(AttachFile);
	// const img_file = app.vault.getAbstractFileByPath(AttachFileFullPath) as TAbstractFile;
	// console.log("deletedTargetFile path--------" +deletedTargetFile.path)
	// const path_valt_based = img_file?.path;
	for (const [mdFile, links] of Object.entries(resolvedLinks)) {
		// filePath 是源文件引用的目标文件的链接路径, nr是引用的数量
		if (currentMd.path === mdFile) {
			// 如果遍历到当前打开的md文档,则将路径path保存在 CurMDPath中
			CurMDPath = currentMd.path;
			mdPath.unshift(CurMDPath);
		}
		for (const [filePath, nr] of Object.entries(links)) {
			if (deletedTargetFile?.path === filePath) {
				refNum++;
				if (nr > 1) {
					// 说明当前文档引用同一个curMd两次
					refNum += 1;
					// break; //则跳出当前循环
				}
				// 说明此时引用的curMd = 删除的curMd，记录md信息
				mdPath.push(mdFile);
			}
		}
	}
	// console.log("refNum----" + refNum);
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
		// 删除curMd
		app.vault.trash(file, false);
		new Notice("Image moved to Obsidian Trash !", SUCCESS_NOTICE_TIMEOUT);
	} else if (deleteOption === "system-trash") {
		// 删除curMd
		app.vault.trash(file, true);
		new Notice("Image moved to System Trash !", SUCCESS_NOTICE_TIMEOUT);
	} else if (deleteOption === "permanent") {
		// 删除curMd
		app.vault.delete(file);
		new Notice("Image deleted Permanently !", SUCCESS_NOTICE_TIMEOUT);
	}
};

/**
	 * 处理图片删除， 图片被引用次数>1,则弹出检测次数窗口 ；否则执行删除逻辑
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