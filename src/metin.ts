const LOWER_MAP: Record<string, string> = { "I": "\u0131", "\u0130": "i" };
const UPPER_MAP: Record<string, string> = { "i": "\u0130", "\u0131": "I" };

const ASCII_FOLD: Record<string, string> = {
    "\u00e7": "c", "\u00c7": "C",
    "\u011f": "g", "\u011e": "G",
    "\u0131": "i", "\u0130": "I",
    "\u00f6": "o", "\u00d6": "O",
    "\u015f": "s", "\u015e": "S",
    "\u00fc": "u", "\u00dc": "U",
};

export function trLower(value: string): string {
    return value.replace(/[I\u0130]/g, (ch) => LOWER_MAP[ch]).toLowerCase();
}

export function trUpper(value: string): string {
    return value.replace(/[i\u0131]/g, (ch) => UPPER_MAP[ch]).toUpperCase();
}

export function trTitle(value: string): string {
    return value
        .split(/(\s+)/)
        .map((part) => (part.trim() === "" ? part : trUpper(part.slice(0, 1)) + trLower(part.slice(1))))
        .join("");
}

export function foldToAscii(value: string): string {
    return value.replace(/[\u00e7\u00c7\u011f\u011e\u0131\u0130\u00f6\u00d6\u015f\u015e\u00fc\u00dc]/g, (ch) => ASCII_FOLD[ch]);
}

export function slug(value: string): string {
    return foldToAscii(value)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function searchKey(value: string): string {
    return foldToAscii(trLower(value)).replace(/\s+/g, " ").trim();
}

const collator = new Intl.Collator("tr", { sensitivity: "variant", numeric: true });

export function compare(a: string, b: string): number {
    return collator.compare(a, b);
}

export function sort<T>(items: T[], key: (item: T) => string): T[] {
    return [...items].sort((a, b) => compare(key(a), key(b)));
}
