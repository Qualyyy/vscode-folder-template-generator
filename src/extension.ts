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
		if (!vscode.workspace.workspaceFolders) {
			vscode.window.showErrorMessage('No folder open');
			return;
		}
		const workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;

		const structureNames = structures.map(structure => structure.name);
		const selectedStructureName = await vscode.window.showQuickPick(structureNames, { placeHolder: 'Select a structure' });
		const selectedStructure = structures.find(s => s.name === selectedStructureName);
		vscode.window.showInformationMessage(selectedStructure.name);
		for (const item of selectedStructure.structure) {
			const fileName = item.fileName;
			const fileTemplate = item.template;

			const filePath = path.join(workspacePath, fileName);
			if (fs.existsSync(filePath)) {
				vscode.window.showInformationMessage(`${fileName} already exists, skipping...`);
				continue;
			}

			if (fileTemplate === 'folder') {
				fs.mkdirSync(filePath, { recursive: true });
				continue;
			}

			fs.mkdirSync(path.dirname(filePath), { recursive: true });
			fs.writeFileSync(filePath, '');
		};

	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
