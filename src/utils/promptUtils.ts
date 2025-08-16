import * as vscode from 'vscode';
import { Structure } from '../types';

export async function promptStructureSelect(structures: any[]): Promise<Structure | null> {
    const structureNames = structures.map(structure => structure.name);
    const structureName = await vscode.window.showQuickPick(structureNames, { placeHolder: 'Select a structure' }) || '';
    const selectedStructure = structures.find(s => s.name === structureName);

    if (!selectedStructure) {
        return null;
    }

    const structure: Structure = { ...selectedStructure };
    structure.optionals = selectedStructure.optionals.map((optName: string) => ({
        optName,
        value: undefined
    }));

    return structure;
}