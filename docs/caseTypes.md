# Custom Template Generator - Case Types Guide

## Overview
Use `[[variable | caseType]]` syntax to automatically format your project names, file names, and other text.

**Case type is case insensitive and may contain spaces.**

## Available Case Types

| Case Type            | Syntax                              | Example Input | Result       |
| -------------------- | ----------------------------------- | ------------- | ------------ |
| `lowercase`          | `[[project \| lowercase]]`          | "My Project"  | `my project` |
| `uppercase`          | `[[project \| uppercase]]`          | "My Project"  | `MY PROJECT` |
| `camelcase`          | `[[project \| camelcase]]`          | "My Project"  | `myProject`  |
| `pascalcase`         | `[[project \| pascalcase]]`         | "My Project"  | `MyProject`  |
| `kebabcase`          | `[[project \| kebabcase]]`          | "My Project"  | `my-project` |
| `snakecase`          | `[[project \| snakecase]]`          | "My Project"  | `my_project` |
| `screamingsnakecase` | `[[project \| screamingsnakecase]]` | "My Project"  | `MY_PROJECT` |
| `titlecase`          | `[[project \| titlecase]]`          | "My Project"  | `My Project` |

## Usage Examples

**Without case type** (uses original):
```
Project: [[projectName]]
```
→ `Project: My Awesome Project`

**With case type**:
```
File: index-[[projectName | kebabcase]].html
Class: [[projectName | pascalcase]]Component
```
→ `File: index-my-awesome-project.html`  
→ `Class: MyAwesomeProjectComponent`