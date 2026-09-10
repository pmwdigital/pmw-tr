import { describe, expect, it } from "vitest";
import { addVat, extractVat, format, parseKurus, splitByShares, splitEvenly, sum, ParaHatasi } from "./para.js";

describe("parseKurus", () => {
    it("turkce bicimli tutari kurusa cevirir", () => {
        expect(parseKurus("1.234,56")).toBe(123456);
        expect(parseKurus("0,05")).toBe(5);
        expect(parseKurus("12.345.678,90")).toBe(1234567890);
    });

    it("nokta binlik ayraci mi ondalik mi oldugunu ayirt eder", () => {
        expect(parseKurus("1.234")).toBe(123400);
        expect(parseKurus("1234.56")).toBe(123456);
    });

    it("sayi ve negatif degeri kabul eder", () => {
        expect(parseKurus(19.99)).toBe(1999);
        expect(parseKurus("-45,50")).toBe(-4550);
    });

    it("gecersiz girdide hata firlatir", () => {
        expect(() => parseKurus("abc")).toThrow(ParaHatasi);
        expect(() => parseKurus("")).toThrow(ParaHatasi);
    });
});

describe("format", () => {
    it("kurusu TRY olarak yazar", () => {
        expect(format(123456).replace(/\u00a0/g, " ")).toBe("\u20ba1.234,56");
        expect(format(5, { symbol: false })).toBe("0,05");
    });
});

describe("KDV", () => {
    it("net uzerine KDV ekler", () => {
        expect(addVat(10000, 0.2)).toEqual({ net: 10000, vat: 2000, gross: 12000 });
        expect(addVat(9550, 0.1)).toEqual({ net: 9550, vat: 955, gross: 10505 });
    });

    it("brutten KDV ayirir ve kurus kaybetmez", () => {
        const result = extractVat(12000, 0.2);
        expect(result.net + result.vat).toBe(result.gross);
        expect(result.net).toBe(10000);
    });

    it("yuvarlama artigi brutte kalir", () => {
        const result = extractVat(10505, 0.1);
        expect(result.net + result.vat).toBe(10505);
    });
});

describe("hesap bolme", () => {
    it("esit bolerken tek kurus kaybetmez", () => {
        const parts = splitEvenly(10000, 3);
        expect(parts).toEqual([3334, 3333, 3333]);
        expect(sum(parts)).toBe(10000);
    });

    it("paya gore bolerken toplami korur", () => {
        const parts = splitByShares(10000, [1, 1, 1]);
        expect(sum(parts)).toBe(10000);

        const uneven = splitByShares(171050, [2, 3, 5]);
        expect(sum(uneven)).toBe(171050);
    });

    it("negatif toplami da dogru boler", () => {
        expect(sum(splitEvenly(-10000, 3))).toBe(-10000);
    });

    it("gecersiz girdide hata firlatir", () => {
        expect(() => splitEvenly(100, 0)).toThrow(ParaHatasi);
        expect(() => splitByShares(100, [])).toThrow(ParaHatasi);
        expect(() => splitByShares(100, [0, 0])).toThrow(ParaHatasi);
    });
});
