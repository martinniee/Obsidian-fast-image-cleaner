# Fast Image Cleaner



[中文](./ZH.md) / [EN](./README.md)

这个插件可以允许你快速的删除文档中的图片附件文件以及引用链接，在 **实时阅览**模式下 鼠标移入到图片上方，点击删除按钮即可。



## 演示

<video src="assets/obsidian插件开发-删除图片插件改进删除方法-20230208-2-ai配音版本.mp4"></video>



## 特性

-  删除图片附件文件及其引用链接
-  当同一个图片被引用多次（包含下面给出的两种情况），则会弹出提示窗口，不会直接删除，避免图片被错误删除。弹出窗口有当前引用图片的文档和其他文档引用该图片的文档路径信息，下方有 `close` 按钮和 `remove link` 按钮，点击 `remove link` 按钮可以继续移除**当前文档**中的图片引用链接。
  - 情况1：在用一个文档引用同一个多次
  - 情况2：在多个文档同时引用同一个图片
-  支持 markdown 和 wiki 链接风格的链接
-  支持 三种不同格式的**内部链接类型** （[详情](https://help.obsidian.md/Linking+notes+and+files/Internal+links)）
  - 尽可能简短的形式
  - 基于当前笔记的相对路径
  - 基于仓库根目录的绝对路径
-  支持的图片类型：`jpg, jpeg, png, gif, svg, bmp`
-  支持设置图片删除后处理方式：① 移动到系统回收站 ； ②  移动到 obsidian trash ; ③ 永久删除



> 😅一点小问题：如果图片在callout块中，可能不会直接显示删除按钮。如果要显示，可以手动在文档其它位置 按一下键盘上的 `blank space` 按键。

> 😁  这个插件理论上支持删除任何类型的附件文件，但我不需要，所以目前它只支持图片类型的文件。



## 安装

### 从插件市场安装

直接从插件市场安装

........



### 从 brat安装



👦 添加 `martinniee/Obsidian-fast-image-cleaner` 到 BRAT





### 手动安装
从 [release](https://github.com/martinniee/Obsidian-fast-image-cleaner/releases) 页面下载最新版本的压缩包文件即可

✋ ~~下载最新版本。将三个文件（main.js、manifest.json、style.css）提取并放到{{obsidian_vault}}/.obsidian/plugins/Obsidian-fast-image-cleaner文件夹中。~~

## 使用



1. 安装并启用插件
2. 在 **实时阅览**模式下 鼠标移入到图片上方，应该会看到删除按钮，点击删除按钮即可删除图片文件同时从文档中移除引用链接



删除目的设置

![image-20230209180042264](assets/README-images/image-20230209180042264.png)

请确保你在 "通过上下文菜单设置删除图片 "选项卡下选择了被删除图片的目的地。你有3个选项。

1. **移动到黑曜石垃圾桶** - 文件将被移动到黑曜石保险库下的`.trash`。
2. **移动到系统垃圾箱** - 文件将被移动到操作系统垃圾箱。
3. **永久删除** - 文件将被永久销毁。你将不能再恢复了

## 开发

这个插件遵循  [Obsidian Sample Plugin](https://github.com/obsidianmd/obsidian-sample-plugin) 插件的结构，请看那里的进一步细节。





## 给我充电

❤ 如果你喜欢使用Obsidian-Fast-Image-Cleaner，那么请支持我的工作，请在以下网站给我充电。

- 国内捐赠： https://afdian.net/a/nathanel

- 国外捐赠：https://ko-fi.com/nathanielll



<a href='https://ko-fi.com/J3J6IL7MY' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi3.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>