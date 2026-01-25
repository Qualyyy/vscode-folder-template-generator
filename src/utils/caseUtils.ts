export function applyCase(input: string, caseType: string) {
    switch (caseType.toLowerCase()) {
        case 'lowercase':
            return input.toLowerCase();
        case 'uppercase':
            return input.toUpperCase();
        default:
            return input;
    }
}