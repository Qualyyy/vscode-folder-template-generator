import * as vscode from 'vscode';
import { Structure, StructureItem, Variable } from '../types';

export async function promptStructureSelect(structures: Structure[]): Promise<Structure | null> {
    const structureNames = structures.map(structure => structure.name);
    const structureName = await vscode.window.showQuickPick(structureNames, { placeHolder: 'Select a structure' }) || '';
    const selectedStructure = structures.find(s => s.name === structureName);

    if (!selectedStructure) {
        return null;
    }

    return selectedStructure;
}