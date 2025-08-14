import * as vscode from 'vscode';

export async function promptStructureSelect(structures: any[]): Promise<{
    structureName: string,
    structureVariables: any[],
    structureOptionals: any[],
    structureStructure: any[]
}> {
    const structureNames = structures.map(structure => structure.name);
    const selectedStructureName = await vscode.window.showQuickPick(structureNames, { placeHolder: 'Select a structure' }) || '';
    const selectedStructure = structures.find(s => s.name === selectedStructureName) || {};
    const structureName = selectedStructure.name || '';
    const structureVariables = selectedStructure.variables || [];
    const structureOptionals = selectedStructure.optionals || [];
    const structureStructure = selectedStructure.structure || [];

    return { structureName, structureVariables, structureOptionals, structureStructure };
}