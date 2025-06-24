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
		const fileTemplates = config.get<Record<string, string[]>>('templates') || {};

		// Exit if user hasn't created any structures
		if (structures.length === 0) {
			vscode.window.showErrorMessage('Please create a structure first.');
			return;
		}

		// Exit if no opened folder
		if (!vscode.workspace.workspaceFolders) {
			vscode.window.showErrorMessage('No folder open');
			return;
		}

		// Get the current workspace folder
		const workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;

		const structureNames = structures.map(structure => structure.name);

		// Prompt user to select a structure
		const selectedStructureName = await vscode.window.showQuickPick(structureNames, { placeHolder: 'Select a structure' });
		const selectedStructure = structures.find(s => s.name === selectedStructureName);

		// Check variables
		const variables: { [key: string]: string } = {};
		for (const variable of selectedStructure.variables) {
			const value = await vscode.window.showInputBox({ prompt: variable }) || '';
			variables[variable] = value;
		}

		// Check optional values
		const optionals: { [key: string]: boolean } = {};
		for (const item of selectedStructure.structure) {
			if (item.optional && !(item.optional in optionals)) {
				const addItem = await vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: `${item.optional}?` }) === 'Yes';
				if (addItem) {
					optionals[item.optional] = true; // Add these items
					continue;
				}
				optionals[item.optional] = false; // Don't add these items
			}
		}

		// Create a new file/folder for every item in the structure
		for (const item of selectedStructure.structure) {
			const fileName = item.fileName;
			const fileTemplate = item.template;
			const filePath = path.join(workspacePath, fileName);

			// Skip item if optional true
			if (item.optional) {
				if (!optionals[item.optional]) {
					vscode.window.showInformationMessage(`Skipped ${fileName}`);
					continue;
				}
			}

			// Skip items if exists
			if (fs.existsSync(filePath)) {
				vscode.window.showInformationMessage(`${fileName} already exists, skipping...`);
				continue;
			}

			// Item is a folder
			if (fileTemplate === 'folder') {
				fs.mkdirSync(filePath, { recursive: true });
				continue;
			}

			// Item is a file

			let fileContent = '';

			// Make content match the template
			const contentParts = fileTemplates[fileTemplate];
			if (contentParts) {
				let filteredParts: string[] = [];

				for (let part of contentParts) {
					const match = part.match(/\[([a-zA-Z0-9_]+)\]/);
					if (match) {
						const marker = match[1];
						if (marker in optionals) {
							// Skip if false
							if (!optionals[marker]) {
								continue;
							}
							// Remove marker if true
							part = part.replace(match[0], '');
						}
					}

					filteredParts.push(part);
				}

				fileContent = filteredParts.join('\n');

				// Replace variables with correct value
				for (const key in variables) {
					const searchKey = '[' + key + ']';
					fileContent = fileContent.replaceAll(searchKey, variables[key]);
				}
			}

			// Create the file
			fs.mkdirSync(path.dirname(filePath), { recursive: true });
			fs.writeFileSync(filePath, fileContent);
		};

	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
