// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

function isValidName(name: string): boolean {
	// Forbidden characters on Windows: \ / : * ? " < > |
	// Forbidden on macOS/Linux: /
	// Disallow empty string, trailing spaces or dots (Windows), and reserved names (Windows)
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

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "folder-template-generator" is now active!');

	let disposable = vscode.commands.registerCommand('folder-template-generator.generateTemplate', async (Uri?: vscode.Uri) => {

		// Get the target path

		let targetPath = '';
		let createNewFolder = false;
		// User right clicks a folder
		if (Uri && Uri.fsPath) {
			targetPath = Uri.fsPath;
		}
		// User uses command in folder
		else if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
			targetPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
		}
		// User uses command in empty workspace
		else {
			const options: vscode.OpenDialogOptions = {
				canSelectMany: false,
				openLabel: 'Select parent folder',
				canSelectFiles: false,
				canSelectFolders: true
			};
			const parentFolderUri = await vscode.window.showOpenDialog(options);
			if (parentFolderUri && parentFolderUri[0]) {
				targetPath = parentFolderUri[0].fsPath;
				createNewFolder = true;
			}
			else {
				vscode.window.showErrorMessage('No folder selected');
				return;
			}
		}

		const config = vscode.workspace.getConfiguration('folderTemplateGenerator');
		const structures = config.get<any[]>('structures') || [];
		const fileTemplates = config.get<Record<string, string[]>>('templates') || {};

		// Exit if user hasn't created any structures
		if (structures.length === 0) {
			vscode.window.showErrorMessage('Please create a structure first.');
			return;
		}

		const structureNames = structures.map(structure => structure.name);

		// Prompt user to select a structure
		const selectedStructureName = await vscode.window.showQuickPick(structureNames, { placeHolder: 'Select a structure' });
		if (!selectedStructureName) { return; }
		const selectedStructure = structures.find(s => s.name === selectedStructureName);

		const structureVariables = selectedStructure.variables;

		// Ask user if they want to create a new folder
		if (!createNewFolder) {
			createNewFolder = await vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: 'Create a new folder?' }) === 'Yes';
		}

		// Create new folder and change target path if createNewFolder is true
		if (createNewFolder) {
			while (true) {
				let newFolderPath = '';
				const folderName = await vscode.window.showInputBox({ placeHolder: 'folderName', value: selectedStructureName });
				if (!folderName) { return; }
				if (!isValidName(folderName)) {
					vscode.window.showErrorMessage('Invalid folder name. Avoid special characters and reserved names');
					continue;
				}
				newFolderPath = path.join(targetPath, folderName);
				if (fs.existsSync(newFolderPath)) {
					vscode.window.showErrorMessage(`Folder "${folderName}" already exists. Please choose another name.`);
					continue;
				}
				targetPath = newFolderPath;
				break;
			}
			fs.mkdirSync(targetPath);
		}

		// Check variables
		const variables: { [key: string]: string } = {};
		if (structureVariables) {
			for (const variable of structureVariables) {
				const value = await vscode.window.showInputBox({ prompt: variable });
				if (!value) { return; }
				variables[variable] = value;
			}
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

		const createdItems: string[] = [];

		// Create a new file/folder for every item in the structure
		for (const item of selectedStructure.structure) {
			const fileName = item.fileName;
			const fileTemplate = item.template;
			const filePath = path.join(targetPath, fileName);

			// Check for invalid parts in fileName
			const fileNameParts = fileName.split(/[\\/]/);
			console.log(fileNameParts);
			let invalidPart;
			for (const part of fileNameParts) {
				if (!isValidName(part)) {
					invalidPart = part;
					break;
				}
			}

			// Skip item if the name is invalid
			if (invalidPart) {
				vscode.window.showErrorMessage(`Skipping ${fileName}, fileName is invalid. Avoid special characters and reserved names. Please update your template`);
				continue;
			}

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

			// Add the item

			// Add folders and files to arrays
			for (const i in fileNameParts) {
				// const itemPath = fileNameParts.slice(0, i + 1).reduce((acc: string, curr: string) => acc + curr, '');
				const itemPath = path.join(targetPath, ...fileNameParts.slice(0, Number(i) + 1));
				console.log(itemPath);
				if (!fs.existsSync(itemPath) && !createdItems.includes(itemPath)) {
					createdItems.push(itemPath);
				}
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
				if (variables) {
					for (const key in variables) {
						const searchKey = '[' + key + ']';
						fileContent = fileContent.replaceAll(searchKey, variables[key]);
					}
				}
			}

			// Create the file
			fs.mkdirSync(path.dirname(filePath), { recursive: true });
			fs.writeFileSync(filePath, fileContent);
		};

		console.log(createdItems);

		// Delete all created files and folders if user wants to
		const revertCreation = await vscode.window.showInformationMessage(`Succesfully created ${createdItems.length} items.\nDo you want to revert?`, 'Revert', 'Keep') === 'Revert';

		if (revertCreation) {
			for (const itemPath of createdItems) {
				try {
					fs.rmSync(itemPath, { recursive: true });
				}
				catch {
					console.error('Failed to remove', itemPath);
				}
			}
			return;
		}

		if (createNewFolder) {
			const openNewFolder = await vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: `Open new folder?` }) === 'Yes';
			if (openNewFolder) {
				vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(targetPath), true);
			}
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
