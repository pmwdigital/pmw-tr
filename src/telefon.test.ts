import { describe, expect, it } from "vitest";
import { format, isValidMobile, normalize } from "./telefon.js";

describe("telefon", () => {
    it("farkli yazimlari ayni E.164 numarasina indirger", () => {
        const beklenen = "+905321234567";
        expect(normalize("0532 123 45 67")).toBe(beklenen);
        expect(normalize("+90 532 123 45 67")).toBe(beklenen);
        expect(normalize("905321234567")).toBe(beklenen);
        expect(normalize("(0532) 123-45-67")).toBe(beklenen);
        expect(normalize("5321234567")).toBe(beklenen);
    });

    it("hane sayisi tutmayani reddeder", () => {
        expect(normalize("532123456")).toBeNull();
        expect(normalize("abc")).toBeNull();
    });

    it("cep numarasini ayirt eder", () => {
        expect(isValidMobile("0532 123 45 67")).toBe(true);
        expect(isValidMobile("0212 123 45 67")).toBe(false);
    });

    it("okunur bicimde yazar", () => {
        expect(format("+905321234567")).toBe("0532 123 45 67");
        expect(format("gecersiz")).toBeNull();
    });
});
