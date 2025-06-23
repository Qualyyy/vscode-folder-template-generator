# folder-template-generator README

**folder-template-generator** is a Visual Studio Code extension that lets you quickly scaffold project folders and files from customizable templates, including variable substitution for project-specific values.

---

## Features

- **Generate entire folder/file structures** for new projects with a single command.
- **Customizable templates:** Define your own file contents and folder layouts in your VS Code settings.
- **Variable prompts:** When generating a structure, the extension prompts you for variables (like project name or language) and automatically replaces them in your templates.
- **Supports both files and folders:** Easily specify which items are folders or files in your structure.
- **Skips existing files/folders** to avoid overwriting your work.

**Example workflow:**

1. Right-click a folder in the VS Code Explorer and select **Generate Template**.
2. Choose a structure (e.g., "Website").
3. Enter values for any variables (e.g., projectName, projectLanguage).
4. The extension creates the specified folders and files, filling in templates with your values.

<!-- Example screenshot (add your own image if you like) -->
<!--  -->

---

## Requirements

- **Node.js** (required for VS Code extension development)
- Works on all platforms supported by VS Code.
- No additional dependencies for end users.

---

## Extension Settings

This extension contributes the following settings:

- **`folderTemplateGenerator.structures`**  
  An array of structure definitions. Each structure specifies:
  - `name`: The name of the structure (shown in the picker).
  - `variables`: An array of variable names to prompt for.
  - `structure`: An array of items, each with:
    - `fileName`: The file or folder path (relative to the workspace root).
    - `template`: The template to use (for files), or `"folder"` for folders.

- **`folderTemplateGenerator.templates`**  
  An object mapping template names to arrays of strings (the file content, line by line).  
  Variables in the form `[variableName]` will be replaced with user input.

**Example `settings.json`:**
```json
"folderTemplateGenerator.structures": [
        {
            "name": "Website",
            "variables": [
                "projectName",
                "projectLanguage"
            ],
            "structure": [
                {
                    "fileName": "index.html",
                    "template": "indexHtml"
                },
                {
                    "fileName": "css/mainstyle.css",
                    "template": "mainstyle"
                },
                {
                    "fileName": "js/index.js"
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
            "\t<link rel=\"stylesheet\" type=\"text/css\" href=\"css/mainstyle.css\">",
            "\t<title>[projectName]</title>",
            "</head>",
            "",
            "<body>",
            "\t<script src=\"js/index.js\"></script>",
            "</body>",
            "",
            "</html>"
        ],
        "mainstyle": [
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

---

## Known Issues

- Only works in local workspaces (not remote or virtual workspaces).
- Does not support advanced template logic (like loops or conditionals).
- If a variable is missing from the template, it will be left as `[variableName]` in the output.

---

## Release Notes

### 0.0.1

- Initial release of **folder-template-generator**
- Supports customizable structures and templates
- Variable substitution in templates
- Skips existing files/folders

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

---

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy using folder-template-generator!**

