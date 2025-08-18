import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Structure } from '../types';
import { isValidName } from './validation';

export async function promptStructureSelect(structures: any[]): Promise<Structure | null> {
    const structureNames = structures.map(structure => structure.name);
    const structureName = await vscode.window.showQuickPick(structureNames, { placeHolder: 'Select a structure' }) || '';
    const selectedStructure = structures.find(s => s.name === structureName);

    if (!selectedStructure) {
        return null;
    }

    const structure: Structure = { ...selectedStructure };
    if (selectedStructure.optionals) {
        structure.optionals = selectedStructure.optionals.map((optName: string) => ({
            optName,
            value: undefined
        }));
    }

    return structure;
}

export async function promptNewFolderName(targetPath: string, structureName: string): Promise<string | null> {
    while (true) {
        let newFolderPath = '';
        const folderName = await vscode.window.showInputBox({ title: 'folderName', value: structureName });
        if (!folderName) { return null; }
        if (!isValidName(folderName)) {
            await vscode.window.showErrorMessage('Invalid folder name. Avoid special characters and reserved names', { modal: true });
            continue;
        }
        newFolderPath = path.join(targetPath, folderName);
        if (fs.existsSync(newFolderPath)) {
            await vscode.window.showErrorMessage(`Folder "${folderName}" already exists. Please choose another name.`, { modal: true });
            continue;
        }
        targetPath = newFolderPath;
        break;
    }
    return targetPath;
}