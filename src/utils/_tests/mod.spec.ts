import {describe, it, expect} from "vitest";
import {mod} from "../computations/misc";

describe("mod", () => {
    it("behaves like % for values already in range", () => {
        expect(mod(0, 5)).toBe(0);
        expect(mod(3, 5)).toBe(3);
        expect(mod(4, 5)).toBe(4);
    });

    it("wraps values at or above the modulus", () => {
        expect(mod(5, 5)).toBe(0);
        expect(mod(7, 5)).toBe(2);
        expect(mod(13, 5)).toBe(3);
    });

    // The point of the helper: unlike %, negatives come back positive.
    it("wraps negatives into [0, modValue)", () => {
        expect(mod(-1, 5)).toBe(4);
        expect(mod(-5, 5)).toBe(0);
        expect(mod(-7, 5)).toBe(3);
        expect(mod(-13, 5)).toBe(2);

        expect(-1 % 5).toBe(-1); // what the operator does, for contrast
    });

    // Used to spin forever: both loops adjusted by a modValue that defaulted to 0.
    // A zero modulus must fail loudly rather than hang.
    it("throws on a zero modulus instead of hanging", () => {
        expect(() => mod(5, 0)).toThrow(RangeError);
        expect(() => mod(-3, 0)).toThrow(RangeError);
        expect(() => mod(0, 0)).toThrow(/non-zero/);
    });

    it("still accepts a negative modulus without looping", () => {
        expect(mod(7, -5)).toBe(-3);
        expect(mod(-7, -5)).toBe(-2);
    });

    it("cycles an index around a list, in both directions", () => {
        const len = 3;
        expect([0, 1, 2, 3, 4].map(i => mod(i, len))).toEqual([0, 1, 2, 0, 1]);
        expect([-1, -2, -3, -4].map(i => mod(i, len))).toEqual([2, 1, 0, 2]);
    });
});
