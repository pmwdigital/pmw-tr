export type Kurus = number;

export class ParaHatasi extends Error {}

function assertInteger(value: number, label: string): void {
    if (!Number.isInteger(value)) {
        throw new ParaHatasi(`${label} tam sayi kurus olmali, alinan deger: ${value}`);
    }
}

export function parseKurus(input: string | number): Kurus {
    if (typeof input === "number") {
        if (!Number.isFinite(input)) throw new ParaHatasi(`Gecersiz tutar: ${input}`);
        return Math.round(input * 100);
    }

    const cleaned = input.trim().replace(/[\s\u20ba]/g, "");
    if (cleaned === "") throw new ParaHatasi("Bos tutar");

    const thousandsOnly = /^-?\d{1,3}(\.\d{3})+$/;
    const normalized = cleaned.includes(",")
        ? cleaned.replace(/\./g, "").replace(",", ".")
        : thousandsOnly.test(cleaned)
            ? cleaned.replace(/\./g, "")
            : cleaned;

    if (!/^-?\d+(\.\d+)?$/.test(normalized)) {
        throw new ParaHatasi(`Gecersiz tutar: ${input}`);
    }

    const [whole, fraction = ""] = normalized.split(".");
    const sign = whole.startsWith("-") ? -1 : 1;
    const wholeKurus = Math.abs(Number(whole)) * 100;
    const fractionKurus = Math.round(Number(`0.${fraction || "0"}`) * 100);
    return sign * (wholeKurus + fractionKurus);
}

export function format(kurus: Kurus, options: { symbol?: boolean } = {}): string {
    assertInteger(kurus, "Tutar");
    const { symbol = true } = options;
    return new Intl.NumberFormat("tr-TR", {
        style: symbol ? "currency" : "decimal",
        currency: "TRY",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(kurus / 100);
}

export function addVat(netKurus: Kurus, rate: number): { net: Kurus; vat: Kurus; gross: Kurus } {
    assertInteger(netKurus, "Net tutar");
    if (rate < 0) throw new ParaHatasi(`KDV orani negatif olamaz: ${rate}`);
    const gross = Math.round(netKurus * (1 + rate));
    return { net: netKurus, vat: gross - netKurus, gross };
}

export function extractVat(grossKurus: Kurus, rate: number): { net: Kurus; vat: Kurus; gross: Kurus } {
    assertInteger(grossKurus, "Brut tutar");
    if (rate < 0) throw new ParaHatasi(`KDV orani negatif olamaz: ${rate}`);
    const net = Math.round(grossKurus / (1 + rate));
    return { net, vat: grossKurus - net, gross: grossKurus };
}

export function splitEvenly(totalKurus: Kurus, parts: number): Kurus[] {
    assertInteger(totalKurus, "Toplam");
    if (!Number.isInteger(parts) || parts < 1) {
        throw new ParaHatasi(`Parca sayisi en az 1 olmali, alinan deger: ${parts}`);
    }
    const sign = totalKurus < 0 ? -1 : 1;
    const total = Math.abs(totalKurus);
    const base = Math.floor(total / parts);
    const remainder = total % parts;
    return Array.from({ length: parts }, (_, index) => sign * (base + (index < remainder ? 1 : 0)));
}

export function splitByShares(totalKurus: Kurus, shares: number[]): Kurus[] {
    assertInteger(totalKurus, "Toplam");
    if (shares.length === 0) throw new ParaHatasi("Pay listesi bos");
    if (shares.some((share) => share < 0)) throw new ParaHatasi("Pay negatif olamaz");

    const shareTotal = shares.reduce((sum, share) => sum + share, 0);
    if (shareTotal <= 0) throw new ParaHatasi("Pay toplami sifirdan buyuk olmali");

    const sign = totalKurus < 0 ? -1 : 1;
    const total = Math.abs(totalKurus);

    const exact = shares.map((share) => (total * share) / shareTotal);
    const floors = exact.map((value) => Math.floor(value));
    let distributed = floors.reduce((sum, value) => sum + value, 0);

    const order = exact
        .map((value, index) => ({ index, remainder: value - Math.floor(value) }))
        .sort((a, b) => b.remainder - a.remainder || a.index - b.index);

    const result = [...floors];
    let cursor = 0;
    while (distributed < total) {
        result[order[cursor % order.length].index] += 1;
        distributed += 1;
        cursor += 1;
    }

    return result.map((value) => sign * value);
}

export function sum(values: Kurus[]): Kurus {
    values.forEach((value, index) => assertInteger(value, `${index}. tutar`));
    return values.reduce((total, value) => total + value, 0);
}
