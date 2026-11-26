import {describe, it, expect} from "vitest";
import {Point} from "../point";

describe("bound", () => {
    it("clamps both axes to the same range", () => {
        expect(new Point(-5, 50).bound(0, 10).object).toEqual({x: 0, y: 10});
    });

    it("clamps each axis to its own range", () => {
        expect(new Point(-5, 50).bound(0, 10, 20, 30).object).toEqual({x: 0, y: 30});
    });

    it("clamps between two points, each axis on its own", () => {
        const min = new Point(60, 60), max = new Point(400, 400);
        expect(new Point(500, 10).bound(min, max).object).toEqual({x: 400, y: 60});
        expect(new Point(100, 200).bound(min, max).object).toEqual({x: 100, y: 200});
        expect(new Point(0, 999).bound({x: 1, y: 2}, {x: 3, y: 4}).object).toEqual({x: 1, y: 4});
    });
});
