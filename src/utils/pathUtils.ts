import * as vscode from 'vscode';

export async function getTargetPath(Uri?: vscode.Uri): Promise<{ targetPath: string, createNewFolder: boolean }> {
    let targetPath = '';
    let createNewFolder = false;

    if (Uri?.fsPath) {
        targetPath = Uri.fsPath;
    } else if (vscode.workspace.workspaceFolders?.length) {
        targetPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    } else {
        const options: vscode.OpenDialogOptions = {
            canSelectMany: false,
            openLabel: 'Select parent folder',
            canSelectFiles: false,
            canSelectFolders: true,
        };
        const parentFolderUri = await vscode.window.showOpenDialog(options);

        if (parentFolderUri?.[0]) {
            targetPath = parentFolderUri[0].fsPath;
            createNewFolder = true;
        } else {
            throw new Error('No folder selected');
        }
    }
    return { targetPath, createNewFolder };
}
