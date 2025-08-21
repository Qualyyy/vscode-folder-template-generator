import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { getTargetPath } from './utils/pathUtils';
import { isValidName, isValidStructure, validateConfig } from './utils/validation';
import { createFileContent, skipFile } from './utils/fileUtils';
import { getConfig } from './utils/configUtils';
import { promptNewFolderName, promptStructureSelect, promptValues } from './utils/promptUtils';

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
		if (!selectedStructure || !(await isValidStructure(selectedStructure))) {
			return;
		}

		const structureName = selectedStructure.name;
		const structureVariables = selectedStructure.variables || [];
		const structureOptionals = selectedStructure.optionals || [];
		const structureStructure = selectedStructure.structure || [];

		// Ask user if they want to create a new folder
		if (!createNewFolder) {
			createNewFolder = await vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: 'Create a new folder?' }) === 'Yes';
		}

		const createdItems: string[] = [];

		// Create new folder and change target path if createNewFolder is true
		if (createNewFolder) {
			const newFolderNameResult = await promptNewFolderName(targetPath, structureName);
			if (!newFolderNameResult) {
				return;
			}
			targetPath = newFolderNameResult;
			createdItems.push(targetPath);
		}

		// Get values for variables and optionals
		const valuesResult = await promptValues(structureVariables, structureOptionals);
		if (!valuesResult) {
			return;
		}
		const { variables, optionals } = valuesResult;
		console.log(variables);
		console.log(optionals);

		// Create new folder if needed
		if (createNewFolder) {
			fs.mkdirSync(targetPath);
		}

		// Create a new file/folder for every item in the structure
		for (const item of structureStructure) {
			const fileName = item.fileName;
			const fileTemplate = item.template || '';
			const filePath = path.join(targetPath, fileName);

			if (skipFile(item, filePath, optionals)) {
				continue;
			}

			// Add the item

			// Add folders and files to arrays
			const fileNameParts = fileName.split(/[\\/]/);
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
					await vscode.window.showErrorMessage(`Could not find template "${fileTemplatePath}".\nPlease verify that the file exists and update your settings.json if needed.`, { modal: true });
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
