import { describe, expect, it } from "vitest";
import { build, escapeField, formatNumber } from "./csv.js";

const BOM = String.fromCharCode(0xfeff);

describe("escapeField", () => {
    it("sıradan alana dokunmaz", () => {
        expect(escapeField("Ayşe Yılmaz")).toBe("Ayşe Yılmaz");
    });

    it("ayraç içeren alanı tırnağa alır, bir ad iki sütuna bölünmez", () => {
        expect(escapeField("Yılmaz; Ayşe")).toBe('"Yılmaz; Ayşe"');
    });

    it("alan içindeki tırnağı ikiler", () => {
        expect(escapeField('Ayşe "Ace" Yılmaz')).toBe('"Ayşe ""Ace"" Yılmaz"');
    });

    it("satır sonunu tırnağa alır, not sonraki satıra taşmaz", () => {
        expect(escapeField("bir\niki")).toBe('"bir\niki"');
    });

    it("tablonun formül diye çalıştıracağı değeri etkisizleştirir", () => {
        expect(escapeField("=1+1")).toBe("'=1+1");
        expect(escapeField("+90 555")).toBe("'+90 555");
        expect(escapeField("-5")).toBe("'-5");
        expect(escapeField("@here")).toBe("'@here");
    });

    it("null ve undefined için boş hücre yazar", () => {
        expect(escapeField(null)).toBe("");
        expect(escapeField(undefined)).toBe("");
    });
});

describe("formatNumber", () => {
    it("sayıyı Türkçe Excel'in okuduğu gibi yazar", () => {
        expect(formatNumber(1234.5)).toBe("1234,50");
        expect(formatNumber(7.5, 1)).toBe("7,5");
        expect(formatNumber(Number.NaN)).toBe("");
    });
});

describe("build", () => {
    it("başa BOM koyar, satırları CRLF ve noktalı virgülle birleştirir", () => {
        expect(build(["a", "b"], [[1, 2], [3, 4]])).toBe(`${BOM}a;b\r\n1;2\r\n3;4`);
    });

    it("bom: false ile BOM yazmaz", () => {
        expect(build(["a"], [["x"]], { bom: false })).toBe("a\r\nx");
    });

    it("istenen ayracı kullanır", () => {
        expect(build(["a", "b"], [["x;y", 2]], { delimiter: ",", bom: false })).toBe("a,b\r\nx;y,2");
    });
});
