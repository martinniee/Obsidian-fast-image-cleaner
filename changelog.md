# 2023

2023 年 4 月 6 日

-   ✨ feat：Delete all attachments referenced by the note when deleting current note
-   ✨ feat: Use the public api `app.fileManager.promptForDeletion(file)` to handle file deletion
-   🐞 fix: the processing approach after deleting file not work ,and remove the promptDeletion method

## Release 0.4.11

-   2023/04/08
-   🐞 fix: When deleting image by context menu in note,all images will be deleted as well.

## Release 0.5.0

-   2023/04/08
-   ✨ feat: add context menu on file context to delete the file and its all attachments

## Release 0.5.1

-   2023/04/08
-   🐞 fix: that delete the note by file menu causes unexpected files were deleted , restrict file menu only to be shown when the type of file is file than folder
