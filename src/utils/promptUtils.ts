import * as vscode from 'vscode';
import { Structure, StructureItem, Variable } from '../types';

export async function promptStructureSelect(structures: Structure[]): Promise<{
    structureName: string,
    structureVariables: Variable[],
    structureOptionals: string[],
    structureStructure: StructureItem[]
}> {
    const structureNames = structures.map(structure => structure.name);
    const structureName = await vscode.window.showQuickPick(structureNames, { placeHolder: 'Select a structure' }) || '';
    const selectedStructure = structures.find(s => s.name === structureName);

    if (!selectedStructure) {
        return {
            structureName,
            structureVariables: [],
            structureOptionals: [],
            structureStructure: []
        };
    }

    return {
        structureName,
        structureVariables: selectedStructure.variables || [],
        structureOptionals: selectedStructure.optionals || [],
        structureStructure: selectedStructure.structure || []
    };
}