const MOBILE_PREFIX = /^5\d{9}$/;

export function normalize(value: string): string | null {
    const raw = value.replace(/[^\d+]/g, "");
    let national = raw.startsWith("+90") ? raw.slice(3) : raw;
    if (national.startsWith("90") && national.length === 12) national = national.slice(2);
    if (national.startsWith("0")) national = national.slice(1);
    if (!/^\d{10}$/.test(national)) return null;
    return `+90${national}`;
}

export function isValidMobile(value: string): boolean {
    const normalized = normalize(value);
    if (!normalized) return false;
    return MOBILE_PREFIX.test(normalized.slice(3));
}

export function format(value: string): string | null {
    const normalized = normalize(value);
    if (!normalized) return null;
    const n = normalized.slice(3);
    return `0${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6, 8)} ${n.slice(8)}`;
}
