import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { getConfig } from '../utils/configUtils';
import { createFileContent, getOptionals, getVariables } from '../utils/fileUtils';
import { getTargetPath } from '../utils/pathUtils';
import { promptItemName, promptTemplateSelect, promptValues } from '../utils/promptUtils';
import { validateConfigTemplatesDirectory } from '../utils/validation';

export async function generateFileCommand(Uri?: vscode.Uri) {
    // Get the user's set templatesDirectory
    const templatesDirectory = (await getConfig()).templatesDirectory;
    if (!(await validateConfigTemplatesDirectory(templatesDirectory))) {
        return;
    }

    // Get the target path
    const { targetPath, createNewFolder } = await getTargetPath(Uri);
    if (!targetPath) {
        return;
    }

    // Prompt user to pick a template
    const templatePath = await promptTemplateSelect(templatesDirectory);
    if (!templatePath) {
        return;
    }

    const templateName = path.basename(templatePath);

    // const filePath = path.join(targetPath, templateName);
    const newFileNameResult = await promptItemName(targetPath, templateName, 'File');
    if (!newFileNameResult) {
        return;
    }
    const filePath = newFileNameResult;

    const templateContent = fs.readFileSync(templatePath, 'utf8');

    // Get the variables from the template
    const templateVariables = getVariables(templateContent);
    console.log(templateVariables);

    // Get the optionals from the template
    const templateOptionals = getOptionals(templateContent);
    console.log(templateOptionals);

    // Prompt values for variables and optionals
    const valuesResult = await promptValues(templateVariables, templateOptionals);
    if (!valuesResult) {
        return;
    }
    const { variables, optionals } = valuesResult;
    const fileContent = createFileContent(templatePath, variables, optionals);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, fileContent);

    if (createNewFolder) {
        vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(targetPath), false);
        return;
    }
    vscode.commands.executeCommand('vscode.open', vscode.Uri.file(filePath));
}