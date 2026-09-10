const TR_IBAN_LENGTH = 26;

function compact(value: string): string {
    return value.replace(/\s+/g, "").toUpperCase();
}

function mod97(input: string): number {
    let remainder = 0;
    for (const char of input) {
        remainder = (remainder * 10 + Number(char)) % 97;
    }
    return remainder;
}

function toNumeric(iban: string): string {
    const rearranged = iban.slice(4) + iban.slice(0, 4);
    return [...rearranged]
        .map((char) => (/[A-Z]/.test(char) ? String(char.charCodeAt(0) - 55) : char))
        .join("");
}

export function isValidIban(value: string): boolean {
    const iban = compact(value);
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(iban)) return false;
    if (iban.length < 15 || iban.length > 34) return false;
    return mod97(toNumeric(iban)) === 1;
}

export function isValidTrIban(value: string): boolean {
    const iban = compact(value);
    if (!iban.startsWith("TR") || iban.length !== TR_IBAN_LENGTH) return false;
    return isValidIban(iban);
}

export function formatIban(value: string): string {
    const iban = compact(value);
    return iban.replace(/(.{4})/g, "$1 ").trim();
}

export function ibanBankCode(value: string): string | null {
    const iban = compact(value);
    if (!isValidTrIban(iban)) return null;
    return iban.slice(4, 9);
}
