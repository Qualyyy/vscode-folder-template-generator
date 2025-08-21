import * as vscode from 'vscode';
import { Structure } from '../types';

export function isValidName(name: string): boolean {
    const forbidden = /[\\\/:\*\?"<>\|]/;
    const reservedNames = [
        'CON', 'PRN', 'AUX', 'NUL',
        'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
        'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
    ];

    if (!name || name.trim().length === 0) { return false; }
    if (forbidden.test(name)) { return false; }
    if (name.endsWith(' ') || name.endsWith('.')) { return false; }
    if (reservedNames.includes(name.toUpperCase())) { return false; }

    return true;
}

export async function validateConfig(structures: Structure[], templatesDirectory: string): Promise<boolean> {
    // No structures
    if (structures.length === 0) {
        await vscode.window.showErrorMessage('You haven\'t created any structures.\nPlease create a structure in your settings.json', { modal: true });
        return false;
    }

    // 1 or more structures with empty name
    const emptyNameStructures = structures.filter(s => !s.name || s.name.trim() === '');
    if (emptyNameStructures.length > 0) {
        await vscode.window.showErrorMessage('One or more structures have an empty name. Please update your settings.', { modal: true });
        return false;
    }

    // Structures with the same name
    const uniqueStructureNames = new Set<string>();
    for (const structure of structures) {
        if (uniqueStructureNames.has(structure.name)) {
            vscode.window.showErrorMessage(`Duplicate structure name '${structure.name}'. Please update your structure`, { modal: true });
            return false;
        }
        uniqueStructureNames.add(structure.name);
    }

    // No templatesDirectory
    if (!templatesDirectory) {
        return false;
    }

    return true;
}

export async function isValidStructure(structure: Structure): Promise<boolean> {
    const structureVariables = structure.variables || [];
    const structureStructure = structure.structure || [];

    // Exit if duplicate variable
    const uniqueVariables = new Set<string>();
    for (const variable of structureVariables) {
        if (uniqueVariables.has(variable.varName)) {
            vscode.window.showErrorMessage(`Duplicate variable '${variable.varName}'. Please update your structure`, { modal: true });
            return false;
        }
        uniqueVariables.add(variable.varName);
    }

    // Exit if duplicate file
    const uniqueFiles = new Set<string>();
    for (const file of structureStructure) {
        if (uniqueFiles.has(file.fileName)) {
            vscode.window.showErrorMessage(`Duplicate file '${file.fileName}'. Please update your structure`, { modal: true });
            return false;
        }
        uniqueFiles.add(file.fileName);
    }

    return true;
}