export interface KdvDonemi {
    rate: number;
    validFrom: string;
    validUntil: string | null;
}

export const PERIODS: readonly KdvDonemi[] = [
    { rate: 1, validFrom: "2023-07-10", validUntil: null },
    { rate: 10, validFrom: "2023-07-10", validUntil: null },
    { rate: 20, validFrom: "2023-07-10", validUntil: null },
];

const ISO_DAY = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

function assertDay(day: string): void {
    if (!ISO_DAY.test(day)) throw new RangeError(`Gün YYYY-AA-GG biçiminde olmalı: ${day}`);
}

export function periodsOn(day: string, periods: readonly KdvDonemi[] = PERIODS): KdvDonemi[] {
    assertDay(day);
    const byRate = new Map<number, KdvDonemi>();
    for (const period of periods) {
        if (period.validFrom <= day && (period.validUntil === null || period.validUntil >= day)) {
            byRate.set(period.rate, period);
        }
    }
    return [...byRate.values()].sort((a, b) => a.rate - b.rate);
}

export function ratesOn(day: string, periods: readonly KdvDonemi[] = PERIODS): number[] {
    return periodsOn(day, periods).map((period) => period.rate);
}

export function withStoredRate(rates: readonly number[], stored: number | null | undefined): number[] {
    if (stored === null || stored === undefined || !Number.isFinite(stored) || rates.includes(stored)) return [...rates];
    return [...rates, stored].sort((a, b) => a - b);
}
