export function isValidName(name: string): boolean {
    const forbidden = /[\\\/:\*\?"<>\|]/;
    const reservedNames = [
        'CON', 'PRN', 'AUX', 'NUL',
        'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
        'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
    ];

    if (!name || name.trim().length === 0) { return false; }
    if (forbidden.test(name)) { return false; }
    if (name.endsWith(' ') || name.endsWith('.')) { return false; }
    if (reservedNames.includes(name.toUpperCase())) { return false; }

    return true;
}
