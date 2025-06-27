

# Folder Template Generator

**Folder Template Generator** is a Visual Studio Code extension that lets you quickly scaffold project folders and files from customizable templates, with variable substitution, optional files/lines, and robust cross-platform validation.



## Features

- **Generate entire folder/file structures** for new projects with a single command.
- **Customizable templates:** Define your own file contents and folder layouts in your VS Code settings.
- **Variable prompts with defaults:** When generating a structure, the extension prompts you for variables (like project name or language) and automatically replaces them in your templates. Each variable can have a default value.
- **Optional files and template lines:** Use `[optionalKey]` markers in your templates and structures to conditionally include files or lines.
- **Cross-platform validation:** Prevents creation of files or folders with invalid or reserved names.
- **Supports both files and folders:** Easily specify which items are folders or files in your structure.
- **Skips existing files/folders** to avoid overwriting your work.
- **One-click revert:** Optionally revert all created files and folders immediately after generation.


## How It Works

1. **Right-click a folder** in the VS Code Explorer and select **Generate Template**, or use the command palette.
2. **Choose a structure** (e.g., "Website").
3. **Enter values** for any variables (with defaults provided).
4. **Decide on optional features** (e.g., include CSS or JS).
5. The extension creates the specified folders and files, filling in templates with your values and skipping invalid or existing items.
6. **Optionally revert**: After creation, you can undo all generated items with one click.

## Extension Settings

This extension contributes the following settings:

### `folderTemplateGenerator.structures`

An array of structure definitions. Each structure specifies:

- `name`: The name of the structure (shown in the picker).
- `variables`: An array of objects, each with:
    - `varName`: The variable name to prompt for (e.g., `projectName`).
    - `default`: The default value to pre-fill in the input box.
- `optionals`: An array of string keys for optional features (e.g., `addCss`).
- `structure`: An array of items, each with:
    - `fileName`: The file or folder path (relative to the workspace root).
    - `template`: The template to use (for files), or `"folder"` for folders.
    - `optional`: *(optional)* A key that makes this item optional, shown as a prompt.


### `folderTemplateGenerator.templates`

An object mapping template names to arrays of strings (the file content, line by line).
Variables in the form `[variableName]` will be replaced with user input.
Lines with `[optionalKey]` will only be included if the user enables that option.


## Example `settings.json`

```json
"folderTemplateGenerator.structures": [
  {
    "name": "Website",
    "variables": [
      { "varName": "projectName", "default": "My Website" },
      { "varName": "projectLanguage", "default": "en" }
    ],
    "optionals": [
      "addCss",
      "addJs"
    ],
    "structure": [
      {
        "fileName": "index.html",
        "template": "indexHtml"
      },
      {
        "fileName": "css/mainstyle.css",
        "template": "mainstyleCss",
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
"folderTemplateGenerator.templates": {
  "indexHtml": [
    "<!DOCTYPE html>",
    "<html lang=\"[projectLanguage]\">",
    "",
    "<head>",
    "\t<meta charset=\"UTF-8\">",
    "\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">",
    "\t<link rel=\"stylesheet\" type=\"text/css\" href=\"css/mainstyle.css\">[addCss]",
    "\t<title>[projectName]</title>",
    "</head>",
    "",
    "<body>",
    "\t<script src=\"js/index.js\"></script>[addJs]",
    "",
    "</body>",
    "",
    "</html>"
  ],
  "mainstyleCss": [
    ":root {",
    "    --backgroundColor: white;",
    "    --mainColor: black;",
    "}",
    "",
    "* {",
    "\tmargin: 0px;",
    "\tpadding: 0px;",
    "\tbox-sizing: border-box;",
    "\tcolor: var(--mainColor);",
    "\tfont-family: 'Courier New', Courier, monospace;",
    "}",
    "",
    "body {",
    "\tmin-height: 100vh;",
    "\tbackground-color: var(--backgroundColor);",
    "}"
  ]
}
```

## Template Syntax

- **Variables:**
Use `[variableName]` in your template lines to have them replaced with user input.
- **Optionals:**
Use `[optionalKey]` at the end of a line in your template, or as `"optional": "key"` in your structure.
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
- If a variable is missing from the template, it will be left as `[variableName]` in the output.

## Release Notes

### 0.0.1

- Initial release of **folder-template-generator**
- Supports customizable structures and templates
- Variable substitution in templates (with defaults)
- Optional files and template lines
- Cross-platform path validation
- Skips existing files/folders
- One-click revert for all generated items

## Contributing \& Feedback

Found a bug or want a new feature?
Open an issue or pull request at [GitHub Repo](https://github.com/Qualyyy/vscode-folder-template-generator)[^1].

## Extension Guidelines

- [VS Code Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

**Enjoy using Folder Template Generator!**