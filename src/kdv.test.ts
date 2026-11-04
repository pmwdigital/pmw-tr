import { describe, expect, it } from "vitest";
import { periodsOn, ratesOn, withStoredRate, type KdvDonemi } from "./kdv.js";

const withHistory: KdvDonemi[] = [
    { rate: 1, validFrom: "2020-01-01", validUntil: null },
    { rate: 8, validFrom: "2020-01-01", validUntil: "2023-07-09" },
    { rate: 18, validFrom: "2020-01-01", validUntil: "2023-07-09" },
    { rate: 10, validFrom: "2023-07-10", validUntil: null },
    { rate: 20, validFrom: "2023-07-10", validUntil: null },
];

describe("ratesOn", () => {
    it("bugün geçerli oranları verir", () => {
        expect(ratesOn("2026-11-04")).toEqual([1, 10, 20]);
    });

    it("yürürlük günü dahildir, öncesinde paket verisi yoktur", () => {
        expect(ratesOn("2023-07-10")).toEqual([1, 10, 20]);
        expect(ratesOn("2023-07-09")).toEqual([]);
    });

    it("verilen dönemlerle geçmiş günün oranlarını verir, bitiş günü dahildir", () => {
        expect(ratesOn("2023-07-09", withHistory)).toEqual([1, 8, 18]);
        expect(ratesOn("2023-07-10", withHistory)).toEqual([1, 10, 20]);
    });

    it("biçimi bozuk günü reddeder", () => {
        expect(() => ratesOn("2023-7-1")).toThrow(RangeError);
        expect(() => ratesOn("2023-13-01")).toThrow(RangeError);
    });
});

describe("periodsOn", () => {
    it("aynı oran için son verilen dönemi tutar", () => {
        const periods: KdvDonemi[] = [
            { rate: 20, validFrom: "2023-07-10", validUntil: null },
            { rate: 20, validFrom: "2024-01-01", validUntil: null },
        ];
        expect(periodsOn("2024-06-01", periods)).toEqual([periods[1]]);
    });
});

describe("withStoredRate", () => {
    it("eski kayıttaki oranı listeye ekler", () => {
        expect(withStoredRate([1, 10, 20], 18)).toEqual([1, 10, 18, 20]);
    });

    it("oran zaten varsa ya da yoksa listeyi değiştirmez", () => {
        expect(withStoredRate([1, 10, 20], 10)).toEqual([1, 10, 20]);
        expect(withStoredRate([1, 10, 20], null)).toEqual([1, 10, 20]);
        expect(withStoredRate([1, 10, 20], Number.NaN)).toEqual([1, 10, 20]);
    });
});
