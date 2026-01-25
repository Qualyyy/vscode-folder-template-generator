# Custom Template Generator - Case Types Guide

## Overview
Use `[[variable | caseType]]` syntax to automatically format your project names, file names, and other text.

## Available Case Types

**Case type is case insensitive and may contain spaces.**

| Case Type              | Syntax                              | Example Input | Result        |
| ---------------------- | ----------------------------------- | ------------- | ------------- |
| `lowercase`            | `[[project \| lowercase]]`          | "Hello World" | `hello world` |
| `UPPERCASE`            | `[[project \| uppercase]]`          | "Hello World" | `HELLO WORLD` |
| `camelCase`            | `[[project \| camelcase]]`          | "Hello World" | `helloWorld`  |
| `PascalCase`           | `[[project \| pascalcase]]`         | "Hello World" | `HelloWorld`  |
| `kebab-case`           | `[[project \| kebabcase]]`          | "Hello World" | `hello-world` |
| `snake_case`           | `[[project \| snakecase]]`          | "Hello World" | `hello_world` |
| `SCREAMING_SNAKE_CASE` | `[[project \| screamingsnakecase]]` | "Hello World" | `HELLO_WORLD` |
| `Title Case`           | `[[project \| titlecase]]`          | "Hello World" | `Hello World` |
| `Sentence case`        | `[[project \| sentencecase]]`       | "Hello World" | `Hello world` |


For missing case types, create a [feature request](https://github.com/Qualyyy/vscode-custom-template-generator/issues/new/choose) or DM qualyyy on Discord.

## Usage Examples

**Without case type** (uses original, but removes excessive spaces):
```
Project: [[projectName]]
```
→ `Project: My Awesome Project`

**With case type**:
```
File: index-[[projectName | kebabCase]].html
Class: [[projectName | pascal case]]Component
```
→ `File: index-my-awesome-project.html`  
→ `Class: MyAwesomeProjectComponent`