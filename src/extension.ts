import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { getTargetPath } from './utils/pathUtils';
import { isValidName, validateConfig } from './utils/validation';
import { createFileContent } from './utils/fileUtils';
import { getConfig } from './utils/configUtils';
import { promptStructureSelect } from './utils/promptUtils';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('folder-template-generator.generateTemplate', async (Uri?: vscode.Uri) => {

		// Get the user's set structures and templatesDirectory
		const { structures, templatesDirectory } = await getConfig();
		if (!(await validateConfig(structures, templatesDirectory))) {
			return;
		}

		// Get the target path
		let { targetPath, createNewFolder } = await getTargetPath(Uri);
		if (!targetPath) {
			return;
		}

		// Prompt user to select a structure
		const selectedStructure = await promptStructureSelect(structures);
		if (!selectedStructure) {
			return;
		}

		const structureName = selectedStructure.name;
		const structureVariables = selectedStructure.variables || [];
		const structureOptionals = selectedStructure.optionals || [];
		const structureStructure = selectedStructure.structure || [];

		// Exit if duplicate variable
		const uniqueVariables = new Set<string>();
		for (const variable of structureVariables) {
			if (uniqueVariables.has(variable.varName)) {
				vscode.window.showErrorMessage(`Duplicate variable '${variable.varName}'. Please update your structure`, { modal: true });
				return;
			}
			uniqueVariables.add(variable.varName);
		}

		// Exit if duplicate file
		const uniqueFiles = new Set<string>();
		for (const file of structureStructure) {
			if (uniqueFiles.has(file.fileName)) {
				vscode.window.showErrorMessage(`Duplicate file '${file.fileName}'. Please update your structure`, { modal: true });
				return;
			}
			uniqueFiles.add(file.fileName);
		}

		// Ask user if they want to create a new folder
		if (!createNewFolder) {
			createNewFolder = await vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: 'Create a new folder?' }) === 'Yes';
		}

		const createdItems: string[] = [];

		// Create new folder and change target path if createNewFolder is true
		if (createNewFolder) {
			while (true) {
				let newFolderPath = '';
				const folderName = await vscode.window.showInputBox({ title: 'folderName', value: structureName });
				if (!folderName) { return; }
				if (!isValidName(folderName)) {
					await vscode.window.showErrorMessage('Invalid folder name. Avoid special characters and reserved names', { modal: true });
					continue;
				}
				newFolderPath = path.join(targetPath, folderName);
				if (fs.existsSync(newFolderPath)) {
					await vscode.window.showErrorMessage(`Folder "${folderName}" already exists. Please choose another name.`, { modal: true });
					continue;
				}
				createdItems.push(newFolderPath);
				targetPath = newFolderPath;
				break;
			}
		}

		// Check variables
		const variables: { [key: string]: string } = {};
		if (structureVariables) {
			for (const variable of structureVariables) {
				const value = await vscode.window.showInputBox({ prompt: variable.varName, value: variable.default });
				if (!value) { return; }
				variables[variable.varName] = value;
			}
		}

		// Check optional values
		const optionals: { [key: string]: boolean } = {};
		if (structureOptionals) {
			for (const optional of structureOptionals) {
				const addItem = await vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: `${optional.optName}?` });
				if (addItem === undefined) { return; }
				if (addItem === 'Yes') {
					optionals[optional.optName] = true; // Add these items
					continue;
				}
				optionals[optional.optName] = false; // Don't add these items
			}
		}
		console.log(variables);
		console.log(optionals);

		if (createNewFolder) {
			fs.mkdirSync(targetPath);
		}

		// Create a new file/folder for every item in the structure
		for (const item of structureStructure) {
			const fileName = item.fileName;
			const fileTemplate = item.template || '';
			const filePath = path.join(targetPath, fileName);

			// Check for invalid parts in fileName
			const fileNameParts = fileName.split(/[\\/]/);
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

			// Skip item if optional false
			if (item.optional) {
				if (item.optional in optionals && !optionals[item.optional]) {
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
				const itemPath = path.join(targetPath, ...fileNameParts.slice(0, Number(i) + 1));
				if (!fs.existsSync(itemPath) && !createdItems.includes(itemPath)) {
					createdItems.push(itemPath);
				}
			}

			// Item is a folder
			if (fileTemplate.toUpperCase() === 'FOLDER') {
				fs.mkdirSync(filePath, { recursive: true });
				continue;
			}

			// Item is a file

			let fileContent = '';

			if (fileTemplate) {
				const fileTemplatePath = path.join(templatesDirectory, fileTemplate);
				if (!fs.existsSync(fileTemplatePath)) {
					vscode.window.showErrorMessage(`Could not find template "${fileTemplatePath}".\nPlease verify that the file exists and update your settings.json if needed.`, { modal: true });
					vscode.window.showInformationMessage(`Empty file "${fileName}" created (template not found)`);
				}
				else {
					fileContent = createFileContent(fileTemplatePath, variables, optionals);
				}
			}

			// Create the file
			fs.mkdirSync(path.dirname(filePath), { recursive: true });
			fs.writeFileSync(filePath, fileContent);
		};

		// Delete all created files and folders if user wants to
		const revertCreation = await vscode.window.showInformationMessage(`Are you sure you want to create ${createdItems.length} items?`, { modal: true }, 'Yes') !== 'Yes';

		if (revertCreation) {
			for (const itemPath of createdItems.slice().reverse()) {
				try {
					fs.rmSync(itemPath, { recursive: true });
				}
				catch {
					console.error(`Failed to remove ${itemPath}`);
					if (!fs.existsSync(itemPath)) {
						vscode.window.showErrorMessage(`Failed to remove ${itemPath}`);
					}
				}
			}
			return;
		}

		if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
			vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(targetPath), false);
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
