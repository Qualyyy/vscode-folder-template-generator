import * as vscode from 'vscode';

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

export async function validateConfig(structures: any[]): Promise<boolean> {
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

    return true;
}