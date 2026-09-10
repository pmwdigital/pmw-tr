import { describe, expect, it } from "vitest";
import { formatIban, ibanBankCode, isValidIban, isValidTrIban } from "./iban.js";

const GECERLI_TR = "TR330006100519786457841326";

describe("IBAN", () => {
    it("gecerli IBAN kabul eder", () => {
        expect(isValidIban(GECERLI_TR)).toBe(true);
        expect(isValidIban("GB82WEST12345698765432")).toBe(true);
    });

    it("bosluklu ve kucuk harfli yazimi tolere eder", () => {
        expect(isValidIban("tr33 0006 1005 1978 6457 8413 26")).toBe(true);
    });

    it("tek hane degisince reddeder", () => {
        expect(isValidIban("TR330006100519786457841327")).toBe(false);
    });

    it("bozuk bicimi reddeder", () => {
        expect(isValidIban("TR33")).toBe(false);
        expect(isValidIban("3333000610051978645784")).toBe(false);
        expect(isValidIban("")).toBe(false);
    });
});

describe("TR IBAN", () => {
    it("yalnizca 26 haneli TR IBAN kabul eder", () => {
        expect(isValidTrIban(GECERLI_TR)).toBe(true);
        expect(isValidTrIban("GB82WEST12345698765432")).toBe(false);
    });

    it("banka kodunu cikarir", () => {
        expect(ibanBankCode(GECERLI_TR)).toBe("00061");
        expect(ibanBankCode("GB82WEST12345698765432")).toBeNull();
    });

    it("dortlu gruplar halinde yazar", () => {
        expect(formatIban(GECERLI_TR)).toBe("TR33 0006 1005 1978 6457 8413 26");
    });
});
