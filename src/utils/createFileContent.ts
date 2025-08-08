import * as fs from 'fs';
import * as path from 'path';

export function createFileContent(fileTemplate: string, templatesDirectory: string, variables: { [key: string]: string }, optionals: { [key: string]: boolean }): string {
    const templateFilePath = path.join(templatesDirectory, fileTemplate);
    const templateContent = fs.readFileSync(templateFilePath, 'utf8');

    const contentParts = templateContent.replace(/\r\n/g, '\n').split('\n');

    let fileContent = '';

    if (contentParts) {
        let filteredParts: string[] = [];

        for (let part of contentParts) {
            const matches = [...part.matchAll(/\[([a-zA-Z0-9_]+)\]/g)];
            let skipPart = false;

            if (matches) {
                for (const match of matches) {
                    const marker = match[1];
                    if (variables[marker]) {
                        continue;
                    }
                    if (marker in optionals) {
                        // Skip if false
                        if (!optionals[marker]) {
                            skipPart = true;
                            break;
                        }
                        // Remove marker if true
                        part = part.replace(match[0], '');
                    }
                }
            }
            if (!skipPart) {
                filteredParts.push(part);
            }
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
    return fileContent;
}