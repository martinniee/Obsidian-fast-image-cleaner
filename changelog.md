## Release 0.4.x 2023/4/6

-   ✨ feat：Delete all attachments referenced by the note when deleting current note
-   ✨ feat: Use the public api `app.fileManager.promptForDeletion(file)` to handle file deletion
-   🐞 fix: the processing approach after deleting file not work ,and remove the promptDeletion method

## Release 0.4.11 2023/04/08

-   🐞 fix: When deleting image by context menu in note,all images will be deleted as well.

## Release 0.5.0 2023/04/08

-   ✨ feat: add context menu on file context to delete the file and its all attachments

## Release 0.5.1 2023/04/08

-   🐞 fix: that delete the note by file menu causes unexpected files were deleted , restrict file menu only to be shown when the type of file is file than folder

## Release 0.6.0 2023/5/14

-   ✨ feat: support embed audio deletion
-   ✨ feat: delete all attachments and clear all attachment links in the note for #6
-   refactor: ...

## Release 0.6.1 2023/06/18

-   🦄 refactor: add a tool class for text-processing, and with it to refactor right-click image and link deletion operation. fixed [#9](https://github.com/martinniee/Obsidian-fast-image-cleaner/issues/9) , [#5](https://github.com/martinniee/Obsidian-fast-image-cleaner/issues/5)

## Release 0.6.2 2023/06/18

-   🐞 fix: cannot remove link when reference link is in markdown style

## Release 0.7.0 2023/06/19

-   ✨ feat: automatically delete the folder as attachments folder
    storing image attachments. as only if one file exists , which is also the current deleted file after deletion
-   ✨ feat: add as many attachment link removing of file type as possiable
-   ✨ feat: automatically delete parent attachment folder after the delete file and its all attachments operation
