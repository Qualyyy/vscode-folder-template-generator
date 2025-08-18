# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [Unreleased]
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
  - Added util 'configUtils.ts' to collect user settings and handle the template directory path.
  - Added util 'promptUtils.ts' to prompt the user to select a structure.
- Validation:
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
- Validation for `folderTemplateGenerator.templatesDirectory`:
  - Shows a modal error if the setting is **not configured** (empty string).
  - Shows a modal error if the configured directory **does not exist**.
  - Provides clear instructions in the error message to update the setting.
- Changelog link in README


## [1.0.0] – 2025-08-09
### Added
- Initial release: generate folder structures from customizable templates with variable substitution and optionals.
- Command `folder-template-generator.generateTemplate`.
- Configuration properties `folderTemplateGenerator.structures` and `folderTemplateGenerator.templatesDirectory`.
- MIT license.
- Icon and metadata setup.