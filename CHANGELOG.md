# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [Unreleased]
### Changed
- Replacing of variables in files and filenames is now more efficient.


## [1.1.0] - 2026-01-25
### Added
- Variables in fileName:
  - the fileName in your structures can now contain variables.
  - Example: `"fileName": "[[title]].html"`.


## [1.0.3] - 2025-11-26
### Added
- Issue templates on GitHub.
- Explanation about ignoredFolders property in the README.


## [1.0.2] - 2025-11-26
### Added
- Prefix 'Templates: ' in front of the commands.


## [1.0.1] - 2025-11-26
### Changed
- Updated CHANGELOG for the rebrand.
- Updated the extension icon.


## [1.0.0] - 2025-11-26

### 🚀 Major Rebrand
This extension has been renamed from "Folder Template Generator" to "Custom Template Generator" to better reflect its capabilities.

### Breaking Changes
- Extension ID: `vscode-folder-template-generator` → `vscode-custom-template-generator`
- Configuration prefix: `folderTemplateGenerator.*` → `customTemplateGenerator.*`

### Migration
Users of the old extension should:
1. Install `Custom Template Generator`
2. Update configuration keys in `settings.json`
3. Uninstall the old extension

Templates remain fully compatible.

---

<details>
<summary>Click to expand old extension's CHANGELOG</summary>

## [3.2.1] - 2025-11-26
### Deprecated
- ⚠️ **This extension has been deprecated and renamed to "Custom Template Generator"**
- New extension ID: `qualyyy.vscode-custom-template-generator`
- This is the final update to this extension
- Please migrate to the new extension: [Install Custom Template Generator](https://marketplace.visualstudio.com/items?itemName=qualyyy.vscode-custom-template-generator)

### Migration
See the README for migration instructions.


## [3.2.0] - 2025-11-20
### Added
- **NEW PROPERTY**: `ignoredFolders`
  - These folders are ignored when being prompted to pick a template.
  - Default: `[".git"]`


## [3.1.0] - 2025-11-20
### Added
- **NEW COMMAND** `editTemplates`:
  - Opens the set templates directory in a new window.


## [3.0.0] - 2025-11-19
### 🚨 BREAKING CHANGES
- Optionals in template files should now have a '?'.
  - Example: `[[addCss]]` &rarr; `[[?addCss]]`

### Added
- **NEW COMMAND** `generateFile`:
  - Allows generation of the files in your templateDirectory.
  - No setup in settings.json required.
  - Variables and optionals will still get prompted.
  - Right click a folder or use the command to try.
- Path nesting:
  - You can now nest folders in the new folder and file names (e.g. js/index.js).
  - Nested folders will get created if non-existent.

### Changed
- Moved "generateTemplate" command logic to `commands/generateTemplate.ts` for better code maintainability and future-proofing for new commands.


## [2.3.0] – 2025-11-10
### Changed
- Invalid structure error message:
  - Shows no details. When pressing 'Show More', the user will see why it's invalid.
  - Second message shows all errors instead of only the first detected one.

### Added
- Structure validation:
  - Cancels generation when a name is in both variables and optionals.


## [2.2.4] – 2025-10-09
### Fixed
- Added .env to .vscodeignore:
  - This is the reason v2.2.1 and v2.2.3 were not published.


## [2.2.3] – 2025-10-09
### Changed
- Updated readme to match latest changes.

### Fixed
- 'Show overview' button showing even if no items got skipped.


## [2.2.2] – 2025-10-03
### Changed
- Minimum VS Code version to 1.95.0.


## [2.2.1] – 2025-10-02
### Added
- guide.md:
  - Added an extended guide to the project. This replaces the google slides guide I made earlier.

### Changed
- Link in README to step-by-step guide now goes to the new 'guide.md'.


## [2.2.0] – 2025-10-02
### Added
- Tracking skipped items:
  - Information message shows amount of created and skipped items.
  - Button to view what items got skipped, if any got skipped.
  - Overview of skipped items and the reason for the skip when button gets clicked.
- Pluralization in messages according to item count (e.g., "1 item", "2 items").

### Removed
- Information message for each separate skipped file.


## [2.1.2] – 2025-10-02
### Added
- Modal error message when there are no files in the selected structure.


## [2.1.1] – 2025-10-02
### Added
- Modal error message when duplicate optional in the template is detected.


## [2.1.0] – 2025-10-02
### Added
- createNewFolder property inside structures:
  - New optional property in structure overrides the 'create new folder' prompt.
  - Prompt still shows when property is not set.
- Input box titles:
  - Variable prompts: 'Enter value for ${name}'

### Changed
- Input box titles:
  - New folder name prompt: 'Enter name for new folder'


## [2.0.0] – 2025-08-24
### 🚨 BREAKING CHANGES
- **Template syntax changed**: Variables and optionals must now use **double square brackets** `[[variableName]]` instead of single brackets `[variableName]`.  
  - All existing templates and structure definitions need to be updated.  
  - Prevents conflicts with literal square-bracket usage in code (arrays, CSS selectors, regex, etc.).

### Changed
- Documentation and README examples updated to use `[[variableName]]`.  
- Regex in function createFileContent adjusted for parsing variables and optionals.

### Removed
- Legacy support for single-bracket `[variableName]` syntax.


## [1.4.2] – 2025-08-22
### Changed
- The name of the default structure is now 'default structure' instead of 'default template'.
- Moved cancellation prompt to occur before file creation:
  - Files are no longer created and then deleted if user cancels.
  - Command now exits cleanly without creating any files when cancelled.

### Fixed
- Information message after picking a template directory is now correct.
- Await modal error message after nonexistent template to prevent command cancellation.


## [1.4.1] – 2025-08-21
### Added
- Link to the google slides guide under 'How It Works' in the README.


## [1.4.0] – 2025-08-21
### Added
- Validation for structure names:
  - Shows modal error message when an empty structure name is detected.
  - Shows modal error message when a duplicate structure name is detected.

### Changed
- Project structure:
  - Renamed folder 'images' to 'resources' in projects directory.
  - Renamed file 'createFileContents.ts' to 'fileUtils.ts'.
    - Checking whether a structure item should be skipped now happens in this file.
- Utilities:
  - Added util 'configUtils.ts':
    - Collects user settings and handles the template directory path.
  - Added util 'promptUtils.ts':
    - Prompts the user to select a structure.
    - Prompts the user for the folder name when creating a new folder.
    - Prompts the user for values of variables and optionals.
  - Util 'validation.ts':
    - Moved validation for user's structures to 'validation.ts'.
    - Moved validation for selected structure to 'validation.ts'.
    - Renamed function 'validateStructures' to 'validateConfig' and moved validation for empty templatesDirectory to this function.
- Interfaces:
  - Defined 'Structure', 'Variable', 'Optional' and 'StructureItem' in 'index.ts'.
  - Replaced all 'any' and 'any[]' usages with the new interfaces.

### Fixed
- Command now keeps prompting for the folder name when it's invalid.
- Command now correctly cancels when no parent folder is selected.
- Optional items and lines now get added when the optional is not defined in the structure.


## [1.3.1] – 2025-08-13
### Fixed
- Command now works when there are no variables in the structure.


## [1.3.0] – 2025-08-13
### Added
- Option to pick a template directory when not configured:
  - Error message now gives the option to pick a template directory using the systems dialog.
- Folder in default structure:
  - The default structure now contains 'images' with the template 'folder' as example on how to add folders.
- Case insensitive 'folder' template:
  - Templates like 'Folder', 'folDER',... are now also seen as 'folder' template.

### Fixed
- Command now works when there are no optionals in the structure.


## [1.2.1] – 2025-08-10
### Added
- README badges for the following extension metrics:
  - Version, installs, rating, license and last-updated.

### Fixed
- Updated README to show more correct information and better examples.


## [1.2.0] – 2025-08-09
### Added
- Validation for file templates:
  - Shows a modal error if the file template is not found.
  - Shows an information message saying an empty file got created.
- Default example structure:
  - Provides a ready-to-use template configuration to help new users get started.
- Default empty template directory.

### Fixed
- Command now works when deciding not to create a new folder.


## [1.1.0] – 2025-08-09
### Added
- Validation for `customTemplateGenerator.templatesDirectory`:
  - Shows a modal error if the setting is **not configured** (empty string).
  - Shows a modal error if the configured directory **does not exist**.
  - Provides clear instructions in the error message to update the setting.
- Changelog link in README


## [1.0.0] – 2025-08-09
### Added
- Initial release: generate folder structures from customizable templates with variable substitution and optionals.
- Command `custom-template-generator.generateTemplate`.
- Configuration properties `customTemplateGenerator.structures` and `customTemplateGenerator.templatesDirectory`.
- MIT license.
- Icon and metadata setup.

</details>