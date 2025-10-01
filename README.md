

# Folder Template Generator
![Version](https://img.shields.io/visual-studio-marketplace/v/Qualyyy.folder-template-generator?style=flat&logo=visual-studio-code&logoColor=white&label=Version&color=green)
![Installs](https://img.shields.io/visual-studio-marketplace/i/Qualyyy.folder-template-generator?style=flat&logo=visual-studio-code&logoColor=white&label=Installs&color=blue)
![Rating](https://img.shields.io/vscode-marketplace/r/Qualyyy.folder-template-generator?style=flat&logo=visual-studio-code&logoColor=white&label=Rating&color=yellow)<br>
![License](https://img.shields.io/badge/License-MIT-purple.svg?style=flat&logoColor=white)
![Last Updated](https://img.shields.io/github/last-commit/Qualyyy/vscode-folder-template-generator?style=flat&logo=github&logoColor=white&label=Last%20Updated&color=orange)

**Folder Template Generator** is a Visual Studio Code extension that lets you quickly scaffold project folders and files from customizable templates, with variable substitution, optional files/lines, and robust cross-platform validation.

**⚠️ Version 2.0.0 BREAKING CHANGE**  
Template variables now use **double square brackets** `[[var]]` instead of `[var]`.  
See the [Changelog](CHANGELOG.md#200---2025-08-24) for details.

## Features

- **Generate entire folder/file structures** for new projects with a single command.
- **Customizable templates:** Define your own folder structures in your VS Code settings and create local file templates.
- **Variable prompts with defaults:** When generating a structure, the extension prompts you for variables (like project name or language) and automatically replaces them in your templates. Each variable can have a default value. These can be set in the folder structures.
- **Optional files and template lines:** Use `[optionalKey]` markers in your templates and structures to conditionally include files or lines.
- **Cross-platform validation:** Prevents creation of files or folders with invalid or reserved names.
- **Supports both files and folders:** Easily specify which items are folders or files in your structure.
- **Skips existing files/folders** to avoid overwriting your work.
- **One-click revert:** Optionally revert all created files and folders immediately after generation.


## How It Works

1. **Right-click a folder** in the VS Code Explorer and select **Generate Template**, or use the command palette. Using the command in an empty workspace prompts you to choose a local parent folder.
2. **Choose a structure** (e.g., "Website").
3. **Enter values** for any variables (with defaults provided).
4. **Decide on optional features** (e.g., include CSS or JS).
5. The extension creates the specified folders and files, filling in templates with your values and skipping invalid or existing items.
6. **Optionally revert**: After creation, you can undo all generated items with one click.

📖 **Want more detailed guidance?** Check out the [Complete Step-by-Step Guide](https://docs.google.com/presentation/d/e/2PACX-1vSPi0L-s6cIFdp5_Mvl-JmGZOViShL173VcsrdKZB162sVvIIpKY8JaP0dBjlYlfdc8kyl0KTBnueOM/pub?start=false&loop=false) for step-by-step examples.

## Extension Settings

This extension contributes the following settings:

### `folderTemplateGenerator.structures`

An array of structure definitions. Each structure specifies:

- `name`: The name of the structure (shown in the picker).
- `createNewFolder`: Create a new folder upon generating a template. (optional)
- `variables`: An array of objects, each with:
    - `varName`: The variable name to prompt for (e.g., `projectName`).
    - `default`: The default value to pre-fill in the input box.
- `optionals`: An array of string keys for optional features (e.g., `addCss`).
- `structure`: An array of items, each with:
    - `fileName`: The file or folder path (relative to the workspace root).
    - `template`: The template to use (for files), or `"folder"` for folders.
    - `optional`: *(optional)* A key that makes this item optional, shown as a prompt.


### `folderTemplateGenerator.templatesDirectory`

A string path to the directory containing your template files. Template files should contain the content you want to generate for each file type with the variable and optional names between square brackets.


## Example `settings.json`

```json
"folderTemplateGenerator.structures": [
  {
    "name": "Website",
    "createNewFolder": true, //Optional
    "variables": [
      { "varName": "projectName",
        "default": "My Website"
      },
      { "varName": "projectLanguage",
        "default": "en"
      }
    ],
    "optionals": [
      "addCss",
      "addJs"
    ],
    "structure": [
      {
        "fileName": "index.html",
        "template": "indexHtml.html"
      },
      {
        "fileName": "css/mainstyle.css",
        "template": "mainstyleCss.css",
        "optional": "addCss"
      },
      {
        "fileName": "js/index.js",
        "optional": "addJs"
      },
      {
        "fileName": "pages",
        "template": "folder"
      },
      {
        "fileName": "images",
        "template": "folder"
      }
    ]
  }
],
"folderTemplateGenerator.templatesDirectory": "C:/.Personal/file-templates"
```

## Example `indexHtml.html` template
```html
<!DOCTYPE html>
<html lang="[[projectLanguage]]">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="css/mainstyle.css">[[addCss]]
    <script defer src="js/index.js"></script>[[addJs]]
    <title>[[projectName]]</title>
</head>

<body>
  <h1>[[projectName]]</h1>
</body>

</html>
```

## Template Syntax

- **Variables:**
Use `[[variableName]]` in your template lines to have them replaced with user input.
- **Optionals:**
Use `[[optionalKey]]` at the end of a line in your template, or as `"optional": "key"` in your structure.
The user will be prompted to include/exclude these items.

## Validation \& Safety

- **Cross-platform:**
The extension validates every part of file and folder names to avoid forbidden characters and reserved names (e.g., `CON`, `PRN`, `<`, `>`, `:`, `"`, `/`, `\`, `|`, `?`, `*`).
- **No overwrites:**
Existing files and folders are never overwritten—those items are skipped.
- **One-click revert:**
After creation, you can instantly revert all created files and folders.

## Known Issues

- Only works in local workspaces (not remote or virtual workspaces).
- Does not support advanced template logic (like loops or conditionals).

## Changelog

See the [full changelog on GitHub](https://github.com/Qualyyy/vscode-folder-template-generator/blob/master/CHANGELOG.md).

## Contributing \& Feedback

Found a bug or want a new feature?
- Open an issue or pull request at [GitHub Repo](https://github.com/Qualyyy/vscode-folder-template-generator).
- Reach out on Discord: **@qualyyy**

## Extension Guidelines

- [VS Code Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

**Enjoy using Folder Template Generator!**