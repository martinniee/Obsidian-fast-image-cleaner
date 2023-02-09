import { TFile, Notice } from "obsidian";
import NathanDeleteImage from "./main";

const imageExtensions: Set<string> = new Set([
  "jpeg",
  "jpg",
  "png",
  "gif",
  "svg",
  "bmp",
]);
const SUCCESS_NOTICE_TIMEOUT = 1800;

export const getAllImgDivs = (): HTMLCollection => {
  const leaf_active: HTMLCollection = document.getElementsByClassName(
    "workspace-leaf mod-active"
  );
  const preview_content: HTMLCollection = leaf_active[0].getElementsByClassName(
    "markdown-source-view cm-s-obsidian mod-cm6 is-folding is-live-preview node-insert-event"
  );
  const embed_divs: HTMLCollection = preview_content[0]?.getElementsByClassName(
    "internal-embed media-embed image-embed is-loaded"
  );
  return embed_divs;
};
export const removeImgDom = (target: HTMLElement) => {
  const img_div: HTMLDivElement = target.parentElement as HTMLDivElement;
  const content_container: HTMLDivElement = target.parentElement
    ?.parentElement as HTMLDivElement;
  content_container.removeChild(img_div);
};

const trimFromRegExp = (origin_str: string, regex: RegExp): string => {
  const matching_array = Array.from(origin_str.matchAll(regex));
  for (let i = 0; i < matching_array.length; i++) {
    origin_str = origin_str.replace(matching_array[i][0], "");
  }
  return origin_str;
};

export const removeReferenceLink = async (imagePath: string, mdFile: TFile) => {
  const origin_filecontents = await app.vault.read(mdFile);
  const new_filecontents: string[] = [];

  const fileContents_array = origin_filecontents.split("\n");

  for (const fileContent of fileContents_array) {
    const regRefLink1 = new RegExp(
      "!\\[(.*)?\\]\\(((.*\\/)+)?" + imagePath + "\\)",
      "gm"
    ); // markdown
    const regRefLink2 = new RegExp("!\\[\\[.*?" + imagePath + "\\]\\]", "gm"); // wiki

    const isEscaped = fileContent.includes("%20");

    const fileContent_decode = decodeURI(fileContent);

    const isIncludeImage = fileContent_decode.includes(imagePath);
    const isMarkdownStyle = fileContent_decode.match(regRefLink1) != null;
    const isWikiStyle = fileContent_decode.match(regRefLink2) != null;

    if (isEscaped) {
      if (isIncludeImage && isMarkdownStyle) {
        new_filecontents.push(trimFromRegExp(fileContent_decode, regRefLink1));
      } else if (isIncludeImage && isWikiStyle) {
        new_filecontents.push(trimFromRegExp(fileContent_decode, regRefLink2));
      } else {
        new_filecontents.push(fileContent);
      }
    } else {
      if (isIncludeImage && isMarkdownStyle) {
        new_filecontents.push(trimFromRegExp(fileContent_decode, regRefLink1));
      } else if (isIncludeImage && isWikiStyle) {
        new_filecontents.push(trimFromRegExp(fileContent_decode, regRefLink2));
      } else {
        new_filecontents.push(fileContent);
      }
    }
  }
  app.vault.adapter.write(mdFile.path, new_filecontents.join("\n"));
};

export const addDelBtn = (img_list: HTMLCollection) => {
  for (let index = 0; index < img_list?.length; index++) {
    const btn_del: HTMLButtonElement = document.createElement("button");
    btn_del.setAttribute("class", "btn-delete");
    btn_del.setAttribute("aria-label", "Delete current image");
    btn_del.innerHTML =
      '<svg fill="#ff0000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="48px" height="48px"><path d="M 28 7 C 25.243 7 23 9.243 23 12 L 23 15 L 13 15 C 11.896 15 11 15.896 11 17 C 11 18.104 11.896 19 13 19 L 15.109375 19 L 16.792969 49.332031 C 16.970969 52.510031 19.600203 55 22.783203 55 L 41.216797 55 C 44.398797 55 47.029031 52.510031 47.207031 49.332031 L 48.890625 19 L 51 19 C 52.104 19 53 18.104 53 17 C 53 15.896 52.104 15 51 15 L 41 15 L 41 12 C 41 9.243 38.757 7 36 7 L 28 7 z M 28 11 L 36 11 C 36.552 11 37 11.449 37 12 L 37 15 L 27 15 L 27 12 C 27 11.449 27.448 11 28 11 z M 19.113281 19 L 44.886719 19 L 43.212891 49.109375 C 43.153891 50.169375 42.277797 51 41.216797 51 L 22.783203 51 C 21.723203 51 20.846109 50.170328 20.787109 49.111328 L 19.113281 19 z M 32 23.25 C 31.033 23.25 30.25 24.034 30.25 25 L 30.25 45 C 30.25 45.966 31.033 46.75 32 46.75 C 32.967 46.75 33.75 45.966 33.75 45 L 33.75 25 C 33.75 24.034 32.967 23.25 32 23.25 z M 24.642578 23.251953 C 23.677578 23.285953 22.922078 24.094547 22.955078 25.060547 L 23.652344 45.146484 C 23.685344 46.091484 24.462391 46.835938 25.400391 46.835938 C 25.421391 46.835938 25.441891 46.835938 25.462891 46.835938 C 26.427891 46.801938 27.183391 45.991391 27.150391 45.025391 L 26.453125 24.939453 C 26.419125 23.974453 25.606578 23.228953 24.642578 23.251953 z M 39.355469 23.251953 C 38.388469 23.224953 37.580875 23.974453 37.546875 24.939453 L 36.849609 45.025391 C 36.815609 45.991391 37.571109 46.801938 38.537109 46.835938 C 38.558109 46.836938 38.578609 46.835938 38.599609 46.835938 C 39.537609 46.835938 40.314656 46.091484 40.347656 45.146484 L 41.044922 25.060547 C 41.078922 24.094547 40.321469 23.285953 39.355469 23.251953 z" /></svg>';
    img_list[index].appendChild(btn_del);
  }
};
export const clearAllDelBtns = () => {
  const btn_dels: HTMLCollection = document.getElementsByClassName(
    "btn-delete"
  ) as HTMLCollection;
  Array.from(btn_dels).forEach((btn_del) => {
    btn_del.parentNode?.removeChild(btn_del);
  });
};
export const getAllImages = (): TFile[] => {
  const allFiles: TFile[] = app.vault.getFiles();
  const attachments: TFile[] = [];
  for (let i = 0; i < allFiles.length; i++) {
    if (allFiles[i].extension !== "md") {
      if (imageExtensions.has(allFiles[i].extension.toLowerCase())) {
        attachments.push(allFiles[i]);
      }
    }
  }
  return attachments;
};


export const isRemoveImage = (imageName: string): [boolean, string[]] => {
  const currentMd = app.workspace.getActiveFile() as TFile;
  const de_img = getImageFileByName(currentMd, imageName) as TFile;
  if (de_img == undefined) {
    new Notice(` 1111`);
  }
  const md_path: string[] = [];
  let cur_md_path = "";
  let ref_num = 0;
  const resolvedLinks = app.metadataCache.resolvedLinks;
  for (const [mdFile, links] of Object.entries(resolvedLinks)) {
    if (currentMd.path === mdFile) {
      cur_md_path = currentMd.path;
      md_path.unshift(cur_md_path);
    }
    for (const [filePath, nr] of Object.entries(links)) {
      if (de_img.path === filePath) {
        ref_num++;
        if (nr > 1) {
          ref_num += 1;
        }
        md_path.push(mdFile);
      }
    }
  }
  const result: boolean = ref_num > 1 ? false : true;
  return [result, md_path];
};


export const getImageFileByName = (
  currentMd: TFile,
  imageName: string
): TFile | undefined => {
  const resolvedLinks = app.metadataCache.resolvedLinks;
  for (const [mdFile, links] of Object.entries(resolvedLinks)) {
    if (currentMd.path === mdFile) {
      for (const [filePath, nr] of Object.entries(links)) {
        if (filePath.includes(imageName)) {
          try {
            const imageFile: TFile = app.vault.getAbstractFileByPath(
              filePath
            ) as TFile;
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

export const deleteImg = (
  targetImg: HTMLImageElement,
  imageName: string,
  plugin: NathanDeleteImage
) => {
  const deleteOption = plugin.settings.deleteOption;
  let file: TFile;
  const imgType = targetImg.localName;
  switch (imgType) {
    case "img": {
      const imageUrl = targetImg.currentSrc;
      const thisURL = new URL(imageUrl);
      const currentMd = app.workspace.getActiveFile() as TFile;
      file = getImageFileByName(currentMd, imageName) as TFile;
      if (file == undefined) {
        console.error(" cannot get image file ");
      }
      const Proto = thisURL.protocol;
      switch (Proto) {
        case "app:":
        case "data:":
        case "http:":
        case "https:":
          removeReferenceLink(
            imageName,
            app.workspace.getActiveFile() as TFile
          );
          if (deleteOption === ".trash") {
            app.vault.trash(file, false);
            new Notice(
              "Image moved to Obsidian Trash !",
              SUCCESS_NOTICE_TIMEOUT
            );
          } else if (deleteOption === "system-trash") {
            app.vault.trash(file, true);
            new Notice("Image moved to System Trash !", SUCCESS_NOTICE_TIMEOUT);
          } else if (deleteOption === "permanent") {
            app.vault.delete(file);
            new Notice("Image deleted Permanently !", SUCCESS_NOTICE_TIMEOUT);
          }
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
