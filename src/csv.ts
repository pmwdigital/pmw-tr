const BOM = String.fromCharCode(0xfeff);
const FORMULA_START = /^[=+\-@\t\r]/;
const DEFAULT_DELIMITER = ";";

export interface CsvOptions {
    delimiter?: string;
    bom?: boolean;
}

export function escapeField(value: unknown, delimiter = DEFAULT_DELIMITER): string {
    if (value === null || value === undefined) return "";
    let text = String(value);
    if (FORMULA_START.test(text)) text = `'${text}`;
    const mustQuote = text.includes(delimiter) || /["\n\r]/.test(text);
    if (!mustQuote) return text;
    return `"${text.split('"').join('""')}"`;
}

export function formatNumber(value: number, fractionDigits = 2): string {
    if (!Number.isFinite(value)) return "";
    return value.toFixed(fractionDigits).replace(".", ",");
}

export function build(
    headers: readonly string[],
    rows: ReadonlyArray<readonly unknown[]>,
    options: CsvOptions = {},
): string {
    const delimiter = options.delimiter ?? DEFAULT_DELIMITER;
    const line = (cells: readonly unknown[]) => cells.map((cell) => escapeField(cell, delimiter)).join(delimiter);
    const text = [line(headers), ...rows.map(line)].join("\r\n");
    return options.bom === false ? text : BOM + text;
}
