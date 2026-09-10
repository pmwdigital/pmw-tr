import { describe, expect, it } from "vitest";
import { compare, foldToAscii, searchKey, slug, sort, trLower, trTitle, trUpper } from "./metin.js";

describe("buyuk kucuk harf", () => {
    it("noktali ve noktasiz i harfini dogru cevirir", () => {
        expect(trUpper("istanbul")).toBe("\u0130STANBUL");
        expect(trLower("ISPARTA")).toBe("\u0131sparta");
        expect(trUpper("\u0131\u015f\u0131k")).toBe("I\u015eIK");
        expect(trLower("\u0130\u00c7EL")).toBe("i\u00e7el");
    });

    it("varsayilan JavaScript davranisindan farklidir", () => {
        expect("istanbul".toUpperCase()).toBe("ISTANBUL");
        expect(trUpper("istanbul")).not.toBe("istanbul".toUpperCase());
    });

    it("basliga cevirir", () => {
        expect(trTitle("izmir k\u00f6fte")).toBe("\u0130zmir K\u00f6fte");
    });
});

describe("slug ve arama", () => {
    it("turkce karakterleri ascii karsiligina indirger", () => {
        expect(foldToAscii("\u00c7i\u011f K\u00f6fte")).toBe("Cig Kofte");
        expect(slug("Ad\u0131 \u015eanl\u0131 \u0130\u015fkembe")).toBe("adi-sanli-iskembe");
    });

    it("arama anahtari uretir", () => {
        expect(searchKey("  \u0130SKENDER   Kebap ")).toBe("iskender kebap");
        expect(searchKey("\u015eal\u011fam")).toBe(searchKey("salgam"));
    });
});

describe("siralama", () => {
    it("turk alfabesine gore siralar", () => {
        const words = ["zeytin", "\u00e7orba", "cacik", "\u015falgam", "salata", "\u0131spanak", "incir"];
        const sorted = [...words].sort(compare);
        expect(sorted.indexOf("cacik")).toBeLessThan(sorted.indexOf("\u00e7orba"));
        expect(sorted.indexOf("salata")).toBeLessThan(sorted.indexOf("\u015falgam"));
        expect(sorted.indexOf("\u0131spanak")).toBeLessThan(sorted.indexOf("incir"));
    });

    it("nesne listesini anahtara gore siralar", () => {
        const items = [{ ad: "\u00d6zel" }, { ad: "Adana" }];
        expect(sort(items, (item) => item.ad)[0].ad).toBe("Adana");
    });
});
