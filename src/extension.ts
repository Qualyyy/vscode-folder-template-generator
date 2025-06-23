// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "folder-template-generator" is now active!');

	let disposable = vscode.commands.registerCommand('folder-template-generator.generateTemplate', async () => {
		const config = vscode.workspace.getConfiguration('folderTemplateGenerator');
		const structures = config.get<any[]>('structures') || [];

		if (structures.length === 0) {
			vscode.window.showErrorMessage('Please create a template first.');
			return;
		}

		const structureNames = structures.map(structure => structure.name);
		const selectedStructureName = await vscode.window.showQuickPick(structureNames, { placeHolder: 'Select a structure' });
		const selectedStructure = structures.find(s => s.name === selectedStructureName);
		vscode.window.showInformationMessage(selectedStructure.name);

	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
