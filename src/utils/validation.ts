import * as vscode from 'vscode';
import { Structure } from '../types';
import { promptShowInvalidReason } from './promptUtils';

export function isValidName(name: string): boolean {
    const forbidden = /[\\\/:\*\?"<>\|]/;
    const reservedNames = [
        'CON', 'PRN', 'AUX', 'NUL',
        'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
        'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
    ];

    if (!name || name.trim().length === 0) {
        return false;
    }
    if (forbidden.test(name)) {
        return false;
    }
    if (name.endsWith(' ') || name.endsWith('.')) {
        return false;
    }
    if (reservedNames.includes(name.toUpperCase())) {
        return false;
    }

    return true;
}

export function validatePathParts(path: string): boolean {
    const pathParts = path.split(/[\\/]/);

    for (const part of pathParts) {
        if (!isValidName(part)) {
            return false;
        }
    }
    return true;
}

export async function validateConfigStructures(structures: Structure[]): Promise<boolean> {
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

    return true;
}

export async function validateConfigTemplatesDirectory(templatesDirectory: string): Promise<boolean> {
    // No templatesDirectory
    if (!templatesDirectory) {
        return false;
    }

    return true;
}

export async function isValidStructure(structure: Structure): Promise<boolean> {
    const structureVariables = structure.variables || [];
    const structureOptionals = structure.optionals || [];
    const structureStructure = structure.structure;

    let errorMessage = '';

    // Exit if structure doesn't have any files
    if (!structureStructure) {
        errorMessage += '\n    - The structure doesn\'t contain any files';
    }

    // Exit if duplicate variable
    const uniqueVariables = new Set<string>();
    const duplicateVariables = new Set<string>();
    for (const variable of structureVariables) {
        const name = variable.varName;
        if (uniqueVariables.has(name) && !duplicateVariables.has(name)) {
            errorMessage += `\n    - Duplicate variable '${name}'`;
            duplicateVariables.add(name);
        }
        uniqueVariables.add(name);
    }

    // Exit if duplicate optional
    const uniqueOptionals = new Set<string>();
    const duplicateOptionals = new Set<string>();
    for (const optional of structureOptionals) {
        const name = optional.optName;
        if (uniqueOptionals.has(name) && !duplicateOptionals.has(name)) {
            errorMessage += `\n    - Duplicate optional '${name}'`;
            duplicateOptionals.add(name);
        }
        uniqueOptionals.add(name);
    }

    // Exit if in both variables and optionals
    for (const name of uniqueOptionals) {
        if (uniqueVariables.has(name)) {
            errorMessage += `\n    - Name '${name}' is in both variables and optionals`;
        }
    }

    // Exit if duplicate file
    const uniqueFiles = new Set<string>();
    const duplicateFiles = new Set<string>();
    for (const file of structureStructure) {
        const name = file.fileName;
        if (uniqueFiles.has(name) && !duplicateFiles.has(name)) {
            errorMessage += `\n    - Duplicate file '${name}'`;
            duplicateFiles.add(name);
        }
        uniqueFiles.add(name);
    }

    if (errorMessage) {
        promptShowInvalidReason(errorMessage);
        return false;
    }

    return true;
}