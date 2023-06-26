# Fast Image Cleaner

[中文](./ZH.md) / EN

This plugin can fast delete image (or video, audio, file .....) attachment and remove referenced link by right clicking on the context menu option. 

## Demo

//The feature has been updated. waiting...........

## Features

Feature intro:

1. Right-click image to delete attachment and links, and folder  as appropriate.

2. Right-click file list to delete notes and referenced attachments, and folder  as appropriate.

Feature Details:

1. Support `markdown ` and `wiki ` link style image link removal

2. Supports three different formats of **Internal link types** ([Details](https://help.obsidian.md/Linking+notes+and+files/Internal+links))

   1. Shortest path when possible
   2. Relative path to file
   3. Absolute path to vault

3. Support processing approach after deleting image

   1. Move to system trash

   2. Move to Obsidian trash (.trash folder)

   3. Permanently delete

4. In addition to supporting `img` type attachments, there are other types of attachment files such as images, videos, audio recordings, documents... (currently PDF attachments cannot be deleted by right-clicking).

   1. img type: img、gif、png、jpeg，svg， bmp...

   1. file type: docx、pptx、html、epub...

   1. media type: mp4、mkv...



> Explanation of image attachment and reference link deletion:
>
> 1. If the image is only referenced **once** in the current note, it will be deleted directly along with its link.
> 2. If the image is referenced **multiple times** in the current note, a prompt window will appear asking the user to manually remove the link without deleting the image. (This is to prevent accidental deletion of the image.)
> 3. If the image is referenced by **multiple notes**, a prompt window will appear. The user can click the `close` button to continue removing the image reference link from the **current document**, without deleting the image. (This is to prevent accidental deletion of the image.)
>
> Explanation of automatic deletion of referenced attachments when deleting a note:
>
> 1. If the attachment is referenced by other notes, it will not be deleted.
> 2. If the attachment is only referenced once or multiple times in the **note to be deleted**, it will be deleted.
> 3. Deletion method: using the provided command of the plugin, or by right-clicking on the file list.
>
> Explanation of automatic deletion of attachment folder depending on the situation:
>
> - The parent directory of an attachment (usually an attachment folder) will be deleted only if the attachment is referenced once in the note to be deleted, and the attachment folder is empty after the attachment is deleted.



## Install

### Install from plugin marketplace

Install directly from the plugin market and type `Fast Image cleaner`.

### Install from brat

👦 add `martinniee/Obsidian-fast-image-cleaner` to BRAT

### Manual installation

-   Way 1: Go to the release page and download the '.zip' package
-   Way 2 : Download and extract the three files (`main.js`, `manifest.json`, `style.css`) into the `/.obsidian/plugins/Obsidian-fast-image-cleaner` folder.

## Use

1. Install and enable the plug-in
2. In LIVE MODE OR READ MODE ,right-click on image then click the menu item to delete image and clear reference link.

### Deleted Image Destination

![image-20230209180042264](assets/README-images/image-20230209180042264.png)

Please make sure that you select the destination for the deleted images under "Fast Images Cleaner Settings" tab. You have 3 options:

1. **Move to Obsidian Trash** - Files are going to be moved to the `.trash` under the Obsidian Vault.
2. **Move to System Trash** - Files are going to be moved to the Operating System trash.
3. **Permanently Delete** - Files are going to be destroyed permanently. You won't beable to revert back.

### Deletion Mode

#### Delete attachments and links

(1) In live preview mode

![image-20230215115818647](assets/ZH-images/image-20230215115818647.png)

(2)In reading mode
![image-20230215115818647](assets/ZH-images/image-20230215115818647.png)



## Development

This plugin follows the structure of the [Obsidian Sample Plugin](https://github.com/obsidianmd/obsidian-sample-plugin) plugin, please see further details there.

## Support

❤ If you enjoy using Obsidian-Fast-Image-Cleaner, then please support my work by giving me a charge at: https://ko-fi.com/nathanielll

<a href='https://ko-fi.com/J3J6IL7MY' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi3.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

## Plan

-   [ ] Enable right-clicking on any type of embedded attachment to reveal contextmenu options in the file list.

