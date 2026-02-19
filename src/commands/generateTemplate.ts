import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { getConfig } from '../utils/configUtils';
import { createFileContent, getFileName, skipFile } from '../utils/fileUtils';
import { getTargetPath } from '../utils/pathUtils';
import { promptItemName, promptShowSkippedItems, promptStructureSelect, promptValues } from '../utils/promptUtils';
import { isValidStructure, validateConfigStructures, validateConfigTemplatesDirectory } from '../utils/validation';

export async function generateTemplateCommand(Uri?: vscode.Uri) {
    // Get the user's set structures and templatesDirectory
    const { structures, templatesDirectory } = await getConfig();
    if (!(await validateConfigStructures(structures) && await validateConfigTemplatesDirectory(templatesDirectory))) {
        return;
    }

    // Get the target path
    let { targetPath, createNewFolder } = await getTargetPath(Uri);
    if (!targetPath) {
        return;
    }

    // Prompt user to select a structure
    const selectedStructure = await promptStructureSelect(structures);
    if (!selectedStructure || !(await isValidStructure(selectedStructure))) {
        return;
    }

    const structureName = selectedStructure.name;
    const structureCreateNewFolder = selectedStructure.createNewFolder;
    const structureVariables = selectedStructure.variables || [];
    const structureOptionals = selectedStructure.optionals || [];
    const structureStructure = selectedStructure.structure || [];

    // Ask user if they want to create a new folder
    if (!createNewFolder) {
        if (structureCreateNewFolder !== undefined) {
            createNewFolder = structureCreateNewFolder;
        } else {
            createNewFolder = await vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: 'Create a new folder?' }) === 'Yes';
        }
    }

    // Create new folder and change target path if createNewFolder is true
    if (createNewFolder) {
        const newFolderNameResult = await promptItemName(targetPath, structureName, 'Folder');
        if (!newFolderNameResult) {
            return;
        }
        targetPath = newFolderNameResult;
    }

    // Get values for variables and optionals
    const valuesResult = await promptValues(structureVariables, structureOptionals);
    if (!valuesResult) {
        return;
    }
    const { variables, optionals } = valuesResult;
    console.log(variables);
    console.log(optionals);

    // Cancel file generation if user wants to
    const revertCreation = await vscode.window.showInformationMessage(`Are you sure you want to generate ${structureStructure.length} item${structureStructure.length !== 1 ? 's' : ''}?\n\nExisting and invalid items will be skipped.`, { modal: true }, 'Yes') !== 'Yes';

    if (revertCreation) {
        return;
    }

    // Create new folder if needed
    if (createNewFolder) {
        fs.mkdirSync(targetPath, { recursive: true });
    }

    const skippedItems: { [key: string]: string } = {};
    let createdItemsCount: number = 0;

    // Create a new file/folder for every item in the structure
    for (const item of structureStructure) {
        const fileName = getFileName(item.fileName, variables);
        const fileTemplate = item.template || '';
        const filePath = path.join(targetPath, fileName);

        const skipMessage = skipFile(fileName, filePath, item.optional, optionals);
        if (skipMessage) {
            skippedItems[fileName] = skipMessage;
            continue;
        }

        // Add the item
        createdItemsCount += 1;

        // Item is a folder
        if (fileTemplate.toUpperCase() === 'FOLDER') {
            fs.mkdirSync(filePath, { recursive: true });
            continue;
        }

        // Item is a file

        let fileContent = '';

        if (fileTemplate) {
            const fileTemplatePath = path.join(templatesDirectory, fileTemplate);
            if (!fs.existsSync(fileTemplatePath)) {
                await vscode.window.showErrorMessage(`Could not find template "${fileTemplatePath}".\nPlease verify that the file exists and update your settings.json if needed.`, { modal: true });
                vscode.window.showInformationMessage(`Empty file "${fileName}" created (template not found)`);
            } else {
                fileContent = createFileContent(fileTemplatePath, variables, optionals);
            }
        }

        // Create the file
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, fileContent);
    };

    await promptShowSkippedItems(skippedItems, createdItemsCount);

    if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
        vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(targetPath), false);
        return;
    }

    if (createNewFolder) {
        const openNewFolder = await vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: 'Open new folder?' }) === 'Yes';
        if (openNewFolder) {
            vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(targetPath), true);
        }
    }
}