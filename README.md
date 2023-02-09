# Fast Image Cleaner

[中文](./ZH.md) / [EN](./README.md)

> The following English version was translated by deelp

This plugin allows you to quickly remove image attachments and referenced links from your documents in **live view** mode. Mouse over the image and click the delete button.

> ⚠️ If you do not see the delete button icon, then you can press the space in the blank space of the document 

## Demo





<video src="assets/obsidian插件开发-删除图片插件改进删除方法-20230208-2-ai配音版本.mp4"></video>




## Features

- Remove image attachment files and their referencing links
- When the same image is referenced twice or more, a popup window will appear and it will not be deleted directly to avoid the image being deleted by mistake. pop-up window with the current reference to the image of the document and other documents referencing the image of the document path information, the bottom `close` button and `remove link` button, click `remove link` button can continue to remove **current document** in the image reference link.
  - Case 1: the same document is referenced multiple times in a single document
  - Case 2: the same image is referenced in multiple documents at the same time
- Support markdown and wiki link style links
- Support for three different formats of **Internal link types** ([details](https://help.obsidian.md/Linking+notes+and+files/Internal+links))
  - The shortest possible form
  - Relative path based on the current notes
  - Absolute path based on the repository root directory
- Supported image types: `jpg, jpeg, png, gif, svg, bmp`
- Support for setting how to handle images after deletion: ① Move to system recycle bin; ② Move to obsidian trash; ③ Delete permanently

> 😅A small problem: If the image is in a callout block, the delete button may not be displayed directly. To do so, you can manually press the `blank space` button on your keyboard elsewhere in the document.

> 😁 This plugin theoretically supports the deletion of any type of attachment file, but I don't need it, so for now it only supports image type files



## Use

1. Install and enable the plug-in
2. In **Live View** mode Mouse over the image and you should see a delete button, click the delete button to delete the image file and remove the reference link from the document

### Install from plugin marketplace

直接从插件市场安装

........

### Install from brat

👦 添加 `martinniee/Obsidian-fast-image-cleaner`到BRAT

### Manual installation

✋Download the latest release. Extract and put the three files (main.js, manifest.json, styles.css) to folder {{obsidian_vault}}/.obsidian/plugins/Obsidian-fast-image-cleaner



## Development

This plugin follows the structure of the [Obsidian Sample Plugin](https://github.com/obsidianmd/obsidian-sample-plugin) plugin, please see further details there.



## Support

❤ If you enjoy using Obsidian-Fast-Image-Cleaner, then please support my work by giving me a charge at: https://ko-fi.com/nathanielll

<a href='https://ko-fi.com/J3J6IL7MY' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi3.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>