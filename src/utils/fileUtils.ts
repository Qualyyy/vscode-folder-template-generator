import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { directoryItem, Optional, Variable } from '../types';
import { applyCase } from './caseUtils';
import { validatePathParts } from './validation';

export function getFileName(fileName: string, variables: { [key: string]: string }): string {
    fileName = replaceVariables(fileName, variables);
    return fileName;
}

export function skipFile(fileName: string, filePath: string, optionalKey: string | undefined, optionals: { [key: string]: boolean; }): string {

    // Skip item if the name is invalid
    if (!validatePathParts(fileName)) {
        return 'Invalid fileName. Avoid special characters and reserved names. Please update your template';
    }

    // Skip item if optional false
    if (optionalKey) {
        if (optionalKey in optionals && !optionals[optionalKey]) {
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
            const matches = [...part.matchAll(/\[\[\?([a-zA-Z0-9_]+)\]\]/g)];
            let skipPart = false;

            if (matches) {
                for (const match of matches) {
                    const marker = match[1];
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
        fileContent = replaceVariables(fileContent, variables);
    }
    return fileContent;
}

function replaceVariables(content: string, variables: { [key: string]: string }) {
    const variableMatches = [...content.matchAll(/\[\[([a-zA-Z0-9_]+)(?:\s*\|\s*([a-zA-Z0-9_\s]+))?\]\]/g)];

    for (const match of variableMatches) {
        const varName = match[1];
        const varCase = match[2] || '';
        const varValue = applyCase(variables[varName], varCase);

        content = content.replace(match[0], varValue);
    }
    return content;
}

export function getVariables(templateContent: string): Variable[] {
    const variableMatches = [...templateContent.matchAll(/\[\[([a-zA-Z0-9_]+)\]\]/g)];

    const uniqueVariables = new Set<string>();
    const variables: Variable[] = [];

    for (const match of variableMatches) {
        const varName = match[1];

        if (!uniqueVariables.has(varName)) {
            uniqueVariables.add(varName);
            variables.push({
                varName,
                default: varName
            });
        }
    }

    return variables;
}

export function getOptionals(templateContent: string): Optional[] {
    const optionalMatches = [...templateContent.matchAll(/\[\[\?([a-zA-Z0-9_]+)\]\]/g)];

    const uniqueOptionals = new Set<string>();
    const optionals: Optional[] = [];

    for (const match of optionalMatches) {
        const optName = match[1];

        if (!uniqueOptionals.has(optName)) {
            uniqueOptionals.add(optName);
            optionals.push({
                optName: optName,
                value: undefined
            });
        }
    }

    return optionals;
}

export function getDirectoryContent(directory: string, templatesDirectory: string): directoryItem[] {
    const config = vscode.workspace.getConfiguration('customTemplateGenerator');
    let ignoredFolders = config.get<string[]>('ignoredFolders') || [];
    ignoredFolders = ignoredFolders.map(folder => path.normalize(folder));

    const items = fs.readdirSync(directory);

    const directoryContent: directoryItem[] = [];
    items.forEach(item => {
        const relativePath = path.relative(templatesDirectory, path.join(directory, item));
        if (!ignoredFolders.includes(relativePath)) {
            directoryContent.push({
                itemPath: item,
                type: fs.statSync(path.join(directory, item)).isDirectory() ? '📁' : '📄'
            });
        }
    });

    return directoryContent;
}