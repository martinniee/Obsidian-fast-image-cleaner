# nn-delete-image-in-use



## 安装

你可以通过黑曜石应用程序中的社区插件标签来安装该插件。
[Here](https://obsidian.md/plugins?id=open-vscode)的插件在Obsidian的社区插件网站。你可以通过复制一个版本 (release) 到你的`.obsidian/plugins/nn-delete-image-in-use`文件夹来手动安装该插件。

## 使用

**介绍一下：**当你用鼠标右键点击一张图片时，你可以点击上下文菜单项，轻松删除图片文件，并从Markdown文档中删除使用中的链接。

1. 从社区插件中激活该插件
2. 将鼠标移到你需要删除的图片上（移到垃圾桶）。
3. 点击右键，并标记上下文菜单项 「Image moved to \*\*\*」。你会在黑曜石窗口的右上角看到这个信息。

![obsidian插件开发-删除图片当鼠标移入图片上方](assets/README-images/obsidian插件开发-删除图片当鼠标移入图片上方.gif)

![image-20220930112457882](assets/README-images/image-20220930112457882.png)

**支持的的图像格式** : jpg, jpeg, png, gif, svg, bmp

> 注意：这个插件受到 [复制图片和URL上下文菜](https://github.com/NomarCub/obsidian-copy-url-in-preview)和 [黑曜石清除未使用图片插件](https://github.com/ozntel/oz-clear-unused-images-obsidian#support)的启发, 由于上下文菜单删除图片的操作模式相同，可能会造成冲突。所以你需要禁用「复制图片和URL」这个插件... 如果你需要复制图片，那么你可以使用Plugin Image Toolkit。

### 设置-删除位置

请确保你在 "通过上下文菜单设置删除图片 "选项卡下选择了被删除图片的目的地。你有3个选项。

![image-20220930111923941](assets/README-images/image-20220930111923941.png)

1. **移动到黑曜石垃圾桶** - 文件将被移动到黑曜石保险库下的`.trash`。
2. **移动到系统垃圾箱** - 文件将被移动到操作系统垃圾箱。
3. **永久删除** - 文件将被永久销毁。你将不能再恢复了。

## 开发

这个插件遵循[Obsidian Sample Plugin](https://github.com/obsidianmd/obsidian-sample-plugin)的结构，请看那里的进一步细节。
欢迎投稿。

## 支持

如果你喜欢这个插件，那么你可以通过请我喝咖啡来支持我的工作和热情。
