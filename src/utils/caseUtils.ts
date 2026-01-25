export function applyCase(input: string, caseType: string) {
    input = cleanString(input);

    switch (caseType.toLowerCase()) {
        case 'lowercase':
            return input.toLowerCase();
        case 'uppercase':
            return input.toUpperCase();
        default:
            return input;
    }
}

function cleanString(string: string) {
    return string.replace(/ +/g, ' ').trim();
}