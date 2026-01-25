export function applyCase(input: string, caseType: string) {
    input = cleanString(input);

    switch (caseType.toLowerCase()) {
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

function cleanString(string: string) {
    return string.replace(/ +/g, ' ').trim();
}

function toCamelCase(input: string) {
    return input
        .split(' ')
        .map((word, i) =>
            i === 0 ? word.toLowerCase() : titleCaseWord(word))
        .join('');
}

function titleCaseWord(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}