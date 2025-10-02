import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Optional, Structure, Variable } from '../types';
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
        const folderName = await vscode.window.showInputBox({ title: 'Enter name for new folder', value: structureName });
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

export async function promptValues(structureVariables: Variable[], structureOptionals: Optional[]): Promise<{
    variables: { [key: string]: string }, optionals: { [key: string]: boolean }
} | null> {
    const variables: { [key: string]: string } = {};
    if (structureVariables) {
        for (const variable of structureVariables) {
            const value = await vscode.window.showInputBox({ title: `Enter value for ${variable.varName}`, value: variable.default });
            if (!value) { return null; }
            variables[variable.varName] = value;
        }
    }

    // Check optional values
    const optionals: { [key: string]: boolean } = {};
    if (structureOptionals) {
        for (const optional of structureOptionals) {
            const addItem = await vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: `${optional.optName}?` });
            if (addItem === undefined) { return null; }
            if (addItem === 'Yes') {
                optionals[optional.optName] = true; // Add these items
                continue;
            }
            optionals[optional.optName] = false; // Don't add these items
        }
    }

    return { variables, optionals };
}

export async function promptShowSkippedItems(skippedItems: { [key: string]: string }, createdItemsCount: number) {
    if (skippedItems) {
        const skippedItemsCount = Object.keys(skippedItems).length;

        const showSkippedItems = await vscode.window.showInformationMessage(`Successfully created ${createdItemsCount} item${createdItemsCount !== 1 ? 's' : ''} and skipped ${skippedItemsCount} item${skippedItemsCount !== 1 ? 's' : ''}.`, 'Show overview', 'OK') === 'Show overview';

        if (showSkippedItems) {
            let skippedItemsOverview: string = `Skipped item${skippedItemsCount !== 1 ? 's' : ''}:`;
            for (const item in skippedItems) {
                skippedItemsOverview += `\n\n- ${item}:\n      ${skippedItems[item]}`;
            }
            await vscode.window.showInformationMessage(skippedItemsOverview, { modal: true });
        }
    } else {
        vscode.window.showInformationMessage(`Successfully created ${createdItemsCount} item${createdItemsCount !== 1 ? 's' : ''}.`);
    }
}