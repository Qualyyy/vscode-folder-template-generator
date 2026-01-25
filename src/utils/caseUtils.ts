export function applyCase(input: string, caseType: string): string {
    input = cleanString(input);

    switch (caseType?.toLowerCase()) {
        case 'lowercase':
            return input.toLowerCase();
        case 'uppercase':
            return input.toUpperCase();
        case 'camelcase':
            return toCamelCase(input);
        case 'pascalcase':
            return toPascalCase(input);
        case 'kebabcase':
            return toKebabCase(input);
        case 'snakecase':
            return toSnakeCase(input);
        case 'screamingsnakecase':
            return toScreamingSnakeCase(input);
        case 'titlecase':
            return toTitleCase(input);
        default:
            return input;
    }
}

function cleanString(string: string): string {
    return string.replace(/ +/g, ' ').trim();
}

function titleCaseWord(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function toCamelCase(input: string): string {
    return input
        .split(' ')
        .map((word, i) =>
            i === 0 ? word.toLowerCase() : titleCaseWord(word))
        .join('');
}

function toPascalCase(input: string): string {
    return input
        .split(' ')
        .map(titleCaseWord)
        .join('');
}

function toKebabCase(input: string): string {
    return input
        .toLowerCase()
        .replaceAll(' ', '-');
}

function toSnakeCase(input: string): string {
    return input
        .toLowerCase()
        .replaceAll(' ', '_');
}

function toScreamingSnakeCase(input: string): string {
    return input
        .toUpperCase()
        .replaceAll(' ', '_');
}

function toTitleCase(input: string): string {
    return input
        .split(' ')
        .map(titleCaseWord)
        .join(' ');
}