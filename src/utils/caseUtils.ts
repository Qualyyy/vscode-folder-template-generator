export function applyCase(input: string, caseType: string) {
    switch (caseType.toLowerCase()) {
        case 'lowercase':
            return input.toLowerCase();
        default:
            return input;
    }
}