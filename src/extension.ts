import * as vscode from 'vscode';
import { editTemplatesCommand } from './commands/editTemplates';
import { generateFileCommand } from './commands/generateFile';
import { generateTemplateCommand } from './commands/generateTemplate';

export function activate(context: vscode.ExtensionContext) {

	// --- GENERATE TEMPLATE --- //
	const generateTemplate = vscode.commands.registerCommand(
		'custom-template-generator.generateTemplate',
		generateTemplateCommand
	);

	// --- GENERATE FILE --- //
	const generateFile = vscode.commands.registerCommand(
		'custom-template-generator.generateFile',
		generateFileCommand
	);

	// --- EDIT TEMPLATES --- //
	const editTemplates = vscode.commands.registerCommand(
		'custom-template-generator.editTemplates',
		editTemplatesCommand
	);

	context.subscriptions.push(generateTemplate, generateFile, editTemplates);
}

// This method is called when your extension is deactivated
export function deactivate() { }
