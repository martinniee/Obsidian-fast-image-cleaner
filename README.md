# Fast Image Cleaner

[中文](./ZH.md) / EN

This plugin allows you to quickly remove image attachment and referenced link from your document. You can quickly delete image(or file,media) attachment and their reference link with right-click menu.

## Demo

https://user-images.githubusercontent.com/55736512/218007296-eba24cf9-b3bd-40b5-a1b6-32efee1fd396.mp4

## Features

1. Delete image attachment and its reference link when right-click on image ,then click the delete item.
2. Scenarios when deleting image
    1. If the image only is referenced by current note,then delete image attachment and remove link.
    2. If the image is referenced by current note wtih more times,then popup a window.User should remove the link by manually (avoiding deleted image attachment linked by other notes)
    3. If the image is referenced by mutiple notes,then popup a window.User could go on to remove the link by clicking the Close button. (avoiding deleted image attachment linked by other notes)
3. Support both `makdown` and `wiki` link style.
4. Support three various of internal link types, ( [details](https://help.obsidian.md/Linking+notes+and+files/Internal+links) )
    1. Relative path to file
    2. Shortest path when possible
    3. Absolute path in vault
5. Supported image format: `jpg, jpeg, png, gif, svg, bmp`
6. Support processing approach after deleting image
    1. Move to system trash
    2. Move to Obsidian trash (.trash folder)
    3. Permanently delete
7. Support more file types, in addition to supporting img type attachments, more types of attachment files (currently does not support right-click to remove `PDF` attachments)
    1. Image: img、gif、png、jpeg、svg, bmp
    2. FIle: docx、pptx、html、epub...
    3. Video: mp4、mkv...
8. When you delete a note, all attachment files referenced in the note are also deleted
    1. If the attachment is also referenced by other notes, it is not deleted.
    2. Delete an attachment if it is referenced only one or more times by the current note to be deleted
    3. Delete method: Delete notes through the command provided by the plugin.

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

#### Delete attachments when deleting notes

1. Open the command palete and type` Delete file and clear...`, and enter will delete the current note, and remove the attachments in the note, excluding attachments that are also referenced by other notes

## Development

This plugin follows the structure of the [Obsidian Sample Plugin](https://github.com/obsidianmd/obsidian-sample-plugin) plugin, please see further details there.

## Support

❤ If you enjoy using Obsidian-Fast-Image-Cleaner, then please support my work by giving me a charge at: https://ko-fi.com/nathanielll

<a href='https://ko-fi.com/J3J6IL7MY' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi3.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

## Plan

-   [ ] achieve [#3](https://github.com/martinniee/Obsidian-fast-image-cleaner/issues/3)
