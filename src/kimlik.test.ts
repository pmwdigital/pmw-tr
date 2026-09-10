import { describe, expect, it } from "vitest";
import { isValidTaxId, isValidTckn, isValidVkn, maskTckn } from "./kimlik.js";

describe("TCKN", () => {
    it("gecerli numarayi kabul eder", () => {
        expect(isValidTckn("10000000146")).toBe(true);
    });

    it("kontrol hanesi tutmayani reddeder", () => {
        expect(isValidTckn("12345678901")).toBe(false);
        expect(isValidTckn("10000000145")).toBe(false);
    });

    it("bicim kurallarini uygular", () => {
        expect(isValidTckn("01234567890")).toBe(false);
        expect(isValidTckn("1000000014")).toBe(false);
        expect(isValidTckn("1000000014a")).toBe(false);
        expect(isValidTckn("")).toBe(false);
    });

    it("tekrarli hane dizisi checksum acisindan gecerli gorunur", () => {
        expect(isValidTckn("11111111110")).toBe(true);
    });

    it("maskeler", () => {
        expect(maskTckn("10000000146")).toBe("100*****146");
        expect(() => maskTckn("12345678901")).toThrow();
    });
});

describe("VKN", () => {
    it("hesaplanan kontrol hanesiyle tutarlidir", () => {
        expect(isValidVkn("1234567890")).toBe(true);
        expect(isValidVkn("8490301516")).toBe(true);
    });

    it("kontrol hanesi bozulunca reddeder", () => {
        expect(isValidVkn("1234567891")).toBe(false);
        expect(isValidVkn("8490301517")).toBe(false);
    });

    it("bicim kurallarini uygular", () => {
        expect(isValidVkn("123456789")).toBe(false);
        expect(isValidVkn("12345678901")).toBe(false);
    });
});

describe("isValidTaxId", () => {
    it("uzunluga gore dogru dogrulayiciyi secer", () => {
        expect(isValidTaxId("10000000146")).toBe(true);
        expect(isValidTaxId("1234567890")).toBe(true);
        expect(isValidTaxId("123")).toBe(false);
    });
});
