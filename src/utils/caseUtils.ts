export function applyCase(input: string, caseType: string): string {
    input = cleanString(input);

    switch (caseType?.toLowerCase()) {
        case 'lowercase':
            return input.toLowerCase();
        case 'uppercase':
            return input.toUpperCase();
        case 'camelcase':
            return toCamelCase(input);
        default:
            return input;
    }
}

function cleanString(string: string): string {
    return string.replace(/ +/g, ' ').trim();
}

function toCamelCase(input: string): string {
    return input
        .split(' ')
        .map((word, i) =>
            i === 0 ? word.toLowerCase() : titleCaseWord(word))
        .join('');
}

function titleCaseWord(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
}