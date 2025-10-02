# Folder Template Generator - Complete Guide

A VS Code extension by Qualyyy

## Table of Contents

- [Table of Contents](#table-of-contents)
- [How to Use](#how-to-use)
- [1. Creating Structures](#1-creating-structures)
  - [Required Properties](#required-properties)
  - [Optional Properties](#optional-properties)
  - [Setting Up Structures](#setting-up-structures)
  - [Example Structure: 'Website'](#example-structure-website)
  - [Important Notes](#important-notes)
- [2. Creating File Templates](#2-creating-file-templates)
  - [Setting Up a Template Directory](#setting-up-a-template-directory)
  - [Creating Templates](#creating-templates)
  - [Using Variables and Optionals in Templates](#using-variables-and-optionals-in-templates)
- [3. Generating a Structure](#3-generating-a-structure)
  - [Three Ways to Generate](#three-ways-to-generate)
  - [Generation Process](#generation-process)
  - [Example Generation Flow:](#example-generation-flow)

## How to Use

This extension helps you quickly generate folder and file structures with customizable templates. The process involves three main steps:

1. **Creating structures** - Define what files and folders you want
2. **Creating file templates** - Design template files with variables
3. **Generating a structure** - Use your templates to create new projects

## 1. Creating Structures

### Required Properties

A structure has 2 required properties:

#### `name`
This is the name of the structure. Make sure it's not empty and you don't have duplicates.

Example:

```json
"name": "Website"
```

#### `structure`
This contains all the files you want in this structure. A structure item can have 1 to 3 properties:

- `fileName` - The name/path of the file or folder (required)
- `template` - The template file to use for this item
- `optional` - Makes this item optional (user can choose yes/no)

Example:

```json
"structure": [
  {
    "fileName": "index.html",
    "template": "index.html"
  },
  {
    "fileName": "css/style.css",
    "template": "style.css",
    "optional": "addCss"
  },
  {
    "fileName": "js/index.js",
    "optional": "addJs"
  },
  {
    "fileName": "images",
    "template": "folder"
  }
]
```

### Optional Properties

#### `createNewFolder`
- `true`: a new folder will get created upon generating a structure.
- `false`: a new folder won't get created upon generating a structure. Files and folders will be added directly inside of the parent folder.

If you didn't include this property, you will get prompted whether to create a new folder.

#### `variables`
Each variable requires a name and a default value. In your file templates, you can use any variables you want. The extension will prompt you for values when generating a structure.

Example:

```json
"variables": [
  {
    "varName": "projectName",
    "default": "My Website"
  },
  {
    "varName": "projectLanguage", 
    "default": "en"
  }
]
```

#### `optionals`
Optionals are about the same as variables, but is just a list of the names. Instead of prompting for values, the extension will prompt you for ‘yes’ or ‘no’. When choosing ‘no’, chosen files and lines won’t be added.

Example:

```json
"optionals": [
  "addCss",
  "addJs"
]
```

### Setting Up Structures

1. Go to your vscode settings and search for the extension:
   ```
   @ext:Qualyyy.folder-template-generator
   ```

2. To add or edit structures, click on 'Edit in settings.json'

3. You will see the default example structure. Feel free to remove or edit it, or add new structures. You can make as many as you want.

### Example Structure: 'Website'

Here's a complete example structure that demonstrates all features:

```json
"folderTemplateGenerator.structures": [
  {
    "name": "Website",
    "variables": [
      {
        "varName": "projectName",
        "default": "My Website"
      },
      {
        "varName": "projectLanguage",
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
        "template": "index.html"
      },
      {
        "fileName": "css/style.css",
        "template": "style.css",
        "optional": "addCss"
      },
      {
        "fileName": "js/index.js",
        "optional": "addJs"
      },
      {
        "fileName": "images",
        "template": "folder"
      }
    ]
  }
]
```

### Important Notes

> **Creating Folders**: If you want to create a folder, make sure to add the template `'folder'`. If you do not do this, a file will be made instead of a folder. This template should not exist locally.

> **Missing Templates**: If the given template isn't found inside of the template directory, you will get an error message and an empty file will be created. If the template directory isn't found, you will be able to pick a new one.

## 2. Creating File Templates

### Setting Up a Template Directory

1. Create a local folder on your PC where you will store all your file templates
2. Set the directory in your VS Code settings, or generate a structure to get prompted to pick a directory

### Creating Templates

To create a template:
1. Create a new file in your templates directory
2. Write whatever content you want in the file
3. Use variables and optionals between double square brackets `[[varName]]`

### Using Variables and Optionals in Templates

Inside templates, you can add:
- Variables: `[[variableName]]` - Will be replaced with user input
- Optionals: `[[optionalName]]` - Lines with optionals will be removed if user chooses "no"

Example template: index.html

```html
<!DOCTYPE html>
<html lang="[[projectLanguage]]">

<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="css/style.css">[[addCss]]
    <script defer src="js/index.js"></script>[[addJs]]
    <title>[[projectName]]</title>
</head>

<body>
    <h1>[[projectName]]</h1>
</body>

</html>
```
In this example:
- `[[projectLanguage]]` and `[[projectName]]` will be replaced with user input
- Lines with `[[addCss]]` and `[[addJs]]` will be removed if user chooses "no"

## 3. Generating a Structure

### Three Ways to Generate

#### 1. Using the Command (Least Recommended)

Use the command palette - not the most convenient method.

#### 2. Empty Workspace Button (Most Recommended for New Projects)

When you have no folder opened and are in an empty workspace, click the "Generate Template" button. You'll be prompted to select a parent folder and create a new folder name.

#### 3. Right-Click a Folder (Best for Existing Projects)

Right-click any folder or the root folder in the Explorer and select "Generate Template" to create a structure inside that folder.

### Generation Process

After activating the command, you'll be prompted for the following in order:

1. **Select a structure** - Pick from your configured structures
2. **Create a new folder** - Choose whether to create a new folder (gets overridden by [`createNewFolder`](#createnewfolder))
3. **Folder name** - Enter the name for the new folder (if creating one)
4. **Variable values** - Input values for each variable (or keep defaults)
5. **Optional values** - Choose "yes" or "no" for each optional
6. **Confirm creation** - Confirm or cancel the structure generation
7. **Open new folder** - Choose whether to open the new folder in VS Code

### Example Generation Flow:

```
Select a structure: Website
Create a new folder?: Yes
Enter name for new folder: my-awesome-website
Enter value for projectName: My Awesome Website
Enter value for projectLanguage: en
addCss?: Yes
addJs?: No
Are you sure you want to create 3 items?: Yes
Open new folder?: Yes
```
If everything worked correctly, you should see your newly generated structure in the VS Code Explorer:

```
my-awesome-site/
├── css/
│   └── style.css
├── images/
└── index.html
```