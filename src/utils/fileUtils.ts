import * as fs from 'fs';
import * as vscode from 'vscode';
import { StructureItem } from '../types';
import { isValidName } from './validation';

export function skipFile(item: StructureItem, filePath: string, optionals: { [key: string]: boolean; }): string {
    const fileName = item.fileName;

    // Check for invalid parts in fileName
    const fileNameParts = fileName.split(/[\\/]/);
    let invalidPart;
    for (const part of fileNameParts) {
        if (!isValidName(part)) {
            invalidPart = part;
            break;
        }
    }

    // Skip item if the name is invalid
    if (invalidPart) {
        return 'Invalid fileName. Avoid special characters and reserved names. Please update your template';
    }

    // Skip item if optional false
    if (item.optional) {
        if (item.optional in optionals && !optionals[item.optional]) {
            return 'optional = false';
        }
    }

    // Skip items if exists
    if (fs.existsSync(filePath)) {
        return 'Item already exists';
    }

    return '';
}

export function createFileContent(fileTemplatePath: string, variables: { [key: string]: string }, optionals: { [key: string]: boolean }): string {
    const templateContent = fs.readFileSync(fileTemplatePath, 'utf8');

    const contentParts = templateContent.replace(/\r\n/g, '\n').split('\n');

    let fileContent = '';

    if (contentParts) {
        let filteredParts: string[] = [];

        for (let part of contentParts) {
            const matches = [...part.matchAll(/\[\[([a-zA-Z0-9_]+)\]\]/g)];
            let skipPart = false;

            if (matches) {
                for (const match of matches) {
                    const marker = match[1];
                    if (variables[marker]) {
                        continue;
                    }
                    if (marker in optionals) {
                        // Skip if false
                        if (!optionals[marker]) {
                            skipPart = true;
                            break;
                        }
                    }
                    part = part.replace(match[0], '');
                }
            }
            if (!skipPart) {
                filteredParts.push(part);
            }
        }

        fileContent = filteredParts.join('\n');

        // Replace variables with correct value
        if (variables) {
            for (const key in variables) {
                const searchKey = '[[' + key + ']]';
                fileContent = fileContent.replaceAll(searchKey, variables[key]);
            }
        }
    }
    return fileContent;
}