import {describe, it, expect} from "vitest";
import {isNull, isUndefined} from "../dataManipulation/misc";

describe("isNull / isUndefined", () => {
    it("isNull is true only for null", () => {
        expect(isNull(null)).toBe(true);

        expect(isNull(undefined)).toBe(false);
        expect(isNull(0)).toBe(false);
        expect(isNull("")).toBe(false);
        expect(isNull(false)).toBe(false);
        expect(isNull(NaN)).toBe(false);
        expect(isNull({})).toBe(false);
    });

    it("isUndefined is true only for undefined", () => {
        expect(isUndefined(undefined)).toBe(true);

        expect(isUndefined(null)).toBe(false);
        expect(isUndefined(0)).toBe(false);
        expect(isUndefined("")).toBe(false);
    });

    // The two used to be mutually exclusive under loose equality, which made isNull
    // return false for every input — silently disabling any guard built on it.
    it("together they cover null and undefined, and nothing else", () => {
        const nullish = (v: unknown) => isNull(v) || isUndefined(v);

        expect(nullish(null)).toBe(true);
        expect(nullish(undefined)).toBe(true);

        expect(nullish(0)).toBe(false);
        expect(nullish("")).toBe(false);
        expect(nullish(false)).toBe(false);
    });
});
