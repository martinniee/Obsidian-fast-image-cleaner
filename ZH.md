# Fast Image Cleaner

中文 / [EN](./README.md)

这个插件可以让你快速删除文档中的图片附件和引用链接。你可以通过右键菜单快速删除图像（或文件、媒体）附件及其参考链接。

## 演示

https://www.bilibili.com/video/BV1U8411T7VH/?share_source=copy_web&vd_source=ddac77d9485ee57e18bdf1b8e1b7c728

## 特性

1. 鼠标右键图片点击删除菜单选项，会删除图片附件文件及其引用链接
2. 被删除的图片的情况
    1. 仅被当前文档引用且**一次**，则直接删除图片，同时移除链接。
    2. 仅被当前文档引用且**多次**，则弹出提示窗口，要求用户手动移除链接，不删除图片。（避免图片被错误删除）
    3. 被**多个文档**引用，则弹出提示窗口，用户可点击`close`按钮继续移除**当前文档**中的图片引用链接，不删除图片。（避免图片被错误删除）

3. 支持 `markdown `和 `wiki `链接风格的链接
4. 支持 三种不同格式的**内部链接类型** （[详情](https://help.obsidian.md/Linking+notes+and+files/Internal+links)）
    - 尽可能简短的形式
    - 基于当前笔记的相对路径
    - 基于仓库根目录的绝对路径
5. 支持的图片类型：`jpg, jpeg, png, gif, svg, bmp`
6. 支持设置图片删除后的处理方式：① 移动到系统回收站 ； ② 移动到 obsidian trash ; ③ 永久删除
7. 支持更多文件类型，除了支持 img 类型的附件，更多类型附件文件（目前不支持右键移除`PDF`附件）

    1. img 类型: img、gif、png、jpeg、svg, bmp
    2. file 类型: docx、pptx、html、epub...
    3. video: mp4、mkv...
8. 当删除笔记时同时删除此笔记中引用的所有附件文件
    1. 如果附件被其他笔记也引用，则不删除。
    2. 如果附件仅被当前**需被删除的笔记**引用一次或多次，则删除。
    3. 删除方式：①直接在文件列表右键删除笔记；②通过插件提供的命令删除笔记。


## 安装

### 从插件市场安装

直接从插件市场安装，输入`Fast Image cleaner`。

### 从 brat 安装

👦 添加 `martinniee/Obsidian-fast-image-cleaner` 到 BRAT

### 手动安装

方式

- 进入 release页面，下载`.zip`压缩包
- 下载并将三个文件（`main.js`、`manifest.json`、`style.css`）提取并放到`<your_vault>/.obsidian/plugins/Obsidian-fast-image-cleaner `文件夹中。

## 使用

1. 安装并启用插件
2. 在**阅读模式**或者**实时预览模式**鼠标右键图片，在弹出的菜单项目中，点击删除选项

### 删除目的设置

![image-20230209180042264](assets/README-images/image-20230209180042264.png)

请确保你在"Fast Images Cleaner Settings" 下选择了被删除图片的目的地。你有 3 个选项。

1. **移动到黑曜石垃圾桶** - 文件将被移动到黑曜石保险库下的`.trash`。
2. **移动到系统垃圾箱** - 文件将被移动到操作系统垃圾箱。
3. **永久删除** - 文件将被永久销毁。你将不能再恢复了

### 删除方式

#### 删除附件及链接

(1)实时预览模式下

![image-20230215115818647](assets/ZH-images/image-20230215115818647.png)

(2)阅读模式下

![image-20230215115818647](assets/ZH-images/image-20230215115818647.png)

#### 删除附件当删除笔记

1. 文件列表右键笔记点击删除选项删除，会删除笔记中的附件
2. 打开命令命板输入`Delete file and clear...`，回车会删除当前笔记，同时删除笔记中的附件，不包括被其他笔记也引用的附件



## 开发

这个插件遵循 [Obsidian Sample Plugin](https://github.com/obsidianmd/obsidian-sample-plugin) 插件的结构，请看那里的进一步细节。

## 给我充电

❤ 如果你喜欢使用 Obsidian-Fast-Image-Cleaner，那么请支持我的工作，请给我充电。
https://afdian.net/a/nathanel 或者
<img src="assets/ZH-images/微信支付宝二合一收款码.jpg" alt="微信支付宝二合一收款码" style="zoom: 33%;" />
