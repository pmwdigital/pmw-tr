function digits(value: string): number[] | null {
    const trimmed = value.trim();
    if (!/^\d+$/.test(trimmed)) return null;
    return [...trimmed].map(Number);
}

export function isValidTckn(value: string): boolean {
    const d = digits(value);
    if (!d || d.length !== 11) return false;
    if (d[0] === 0) return false;

    const oddSum = d[0] + d[2] + d[4] + d[6] + d[8];
    const evenSum = d[1] + d[3] + d[5] + d[7];

    const tenth = (oddSum * 7 - evenSum) % 10;
    if (((tenth + 10) % 10) !== d[9]) return false;

    const firstTenSum = d.slice(0, 10).reduce((total, digit) => total + digit, 0);
    return firstTenSum % 10 === d[10];
}

export function isValidVkn(value: string): boolean {
    const d = digits(value);
    if (!d || d.length !== 10) return false;

    let total = 0;
    for (let i = 0; i < 9; i += 1) {
        const shifted = (d[i] + (9 - i)) % 10;
        if (shifted === 0) continue;
        const scaled = (shifted * 2 ** (9 - i)) % 9;
        total += scaled === 0 ? 9 : scaled;
    }

    return (10 - (total % 10)) % 10 === d[9];
}

export function isValidTaxId(value: string): boolean {
    const trimmed = value.trim();
    if (trimmed.length === 11) return isValidTckn(trimmed);
    if (trimmed.length === 10) return isValidVkn(trimmed);
    return false;
}

export function maskTckn(value: string): string {
    if (!isValidTckn(value)) throw new Error(`Gecersiz TCKN: ${value}`);
    const trimmed = value.trim();
    return `${trimmed.slice(0, 3)}*****${trimmed.slice(-3)}`;
}
