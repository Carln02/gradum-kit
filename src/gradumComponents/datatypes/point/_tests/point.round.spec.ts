import {describe, it, expect} from "vitest";
import {Point} from "../point";

describe("round", () => {
    it("rounds to the nearest integer by default", () => {
        expect(new Point(1.4, 2.6).round().object).toEqual({x: 1, y: 3});
    });

    it("rounds both axes to the nearest multiple of one step", () => {
        expect(new Point(57, 23).round(40).object).toEqual({x: 40, y: 40});
        expect(new Point(-61, 19).round(40).object).toEqual({x: -80, y: 0});
    });

    it("rounds each axis to its own step when given a point", () => {
        expect(new Point(57, 23).round(new Point(40, 10)).object).toEqual({x: 40, y: 20});
        expect(new Point(57, 23).round({x: 5, y: 100}).object).toEqual({x: 55, y: 0});
    });
});
