import * as vscode from 'vscode';
import * as fs from 'fs';

export async function getConfig(): Promise<{ structures: any[], templatesDirectory: string }> {
    const config = vscode.workspace.getConfiguration('folderTemplateGenerator');
    const structures = config.get<any[]>('structures') || [];
    let templatesDirectory = config.get<string>('templatesDirectory') || '';


    if (!fs.existsSync(templatesDirectory)) {
        let errorMessage = '';
        if (templatesDirectory.trim() === '') {
            errorMessage = 'No template directory configured.\nPlease set "folderTemplateGenerator.templatesDirectory" in your settings.';
        }
        else {
            errorMessage = `The configured templates directory was not found: "${templatesDirectory}".\nPlease update "folderTemplateGenerator.templatesDirectory" in your settings.`;
        }
        templatesDirectory = '';
        const pickDirectory = await vscode.window.showErrorMessage(errorMessage, { modal: true }, 'Pick directory') === 'Pick directory';
        if (pickDirectory) {
            const options: vscode.OpenDialogOptions = {
                canSelectMany: false,
                openLabel: 'Select directory',
                canSelectFiles: false,
                canSelectFolders: true,
            };
            const templatesDirectoryUri = await vscode.window.showOpenDialog(options);
            if (templatesDirectoryUri?.[0]) {
                templatesDirectory = templatesDirectoryUri[0].fsPath.replaceAll('\\', '/');
                vscode.workspace.getConfiguration('folderTemplateGenerator').update('templatesDirectory', templatesDirectory, vscode.ConfigurationTarget.Global);
                await vscode.window.showInformationMessage(`Updated templatesDirectory to ${templatesDirectory}.\n Select the parent folder for your project next.`, { modal: true });
            }
            else {
                await vscode.window.showErrorMessage('No directory selected', { modal: true });
            }
        }
    }
    return { structures, templatesDirectory };
}