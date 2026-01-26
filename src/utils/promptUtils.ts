import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { Optional, Structure, Variable } from '../types';
import { getDirectoryContent } from './fileUtils';
import { validatePathParts } from './validation';

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

export async function promptTemplateSelect(templatesDirectory: string): Promise<string | null> {
    let currentDirectory = templatesDirectory;

    while (fs.statSync(currentDirectory).isDirectory()) {
        const directoryContent = await getDirectoryContent(currentDirectory, templatesDirectory);

        const items = directoryContent.map(item => `${item.type} ${item.itemPath}`);
        if (path.normalize(currentDirectory) !== path.normalize(templatesDirectory)) {
            items.push('↩️ Return');
        }

        const pickedItem = await vscode.window.showQuickPick(items, { placeHolder: 'Pick template' });
        if (!pickedItem) {
            return null;
        }

        const pickedIndex = items.indexOf(pickedItem);
        if (pickedIndex === directoryContent.length) {
            currentDirectory = path.dirname(currentDirectory);
            continue;
        }
        const pickedPath = directoryContent[pickedIndex].itemPath;

        currentDirectory = path.join(currentDirectory, pickedPath);
    }

    return currentDirectory;
}

export async function promptItemName(targetPath: string, defaultValue: string, type: string): Promise<string | null> {
    while (true) {
        const itemName = await vscode.window.showInputBox({ title: `Enter name for new ${type.toLowerCase()}`, value: defaultValue });
        if (!itemName) { return null; }
        if (!validatePathParts(itemName)) {
            await vscode.window.showErrorMessage(`Invalid ${type.toLowerCase()} name. Avoid special characters and reserved names`, { modal: true });
            continue;
        }
        const newPath = path.join(targetPath, itemName);
        if (fs.existsSync(newPath)) {
            await vscode.window.showErrorMessage(`${type} "${itemName}" already exists. Please choose another name.`, { modal: true });
            continue;
        }
        targetPath = newPath;
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
    const skippedItemsCount = Object.keys(skippedItems).length;
    if (skippedItemsCount) {

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

export async function promptShowInvalidReason(errorMessage: string) {
    const showMore = await vscode.window.showErrorMessage('Invalid structure.\nSelect \'Show More\' to see reason.', { modal: true }, 'Show More') === 'Show More';
    if (showMore) {
        errorMessage = 'Invalid structure:' + errorMessage + '\n\nPlease update your structure.';
        await vscode.window.showInformationMessage(errorMessage, { modal: true });
    }
}