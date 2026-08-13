import {describe, it, expect} from "vitest";
import {Point} from "../point";

const close = (a: Point, b: Point) => expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeLessThan(1e-9);

describe("rotate", () => {
    it("turns about the origin by default", () => {
        close(new Point(10, 0).rotate(Math.PI / 2), new Point(0, 10));
        close(new Point(10, 0).rotate(Math.PI), new Point(-10, 0));
    });

    it("turns about another point when given one", () => {
        //A quarter turn about (100, 100) takes the point directly right of it to directly below it.
        close(new Point(110, 100).rotate(Math.PI / 2, new Point(100, 100)), new Point(100, 110));
    });

    it("leaves the pivot itself alone", () => {
        close(new Point(7, 9).rotate(1.234, new Point(7, 9)), new Point(7, 9));
    });

    it("returns a new point rather than changing this one", () => {
        const point = new Point(3, 4);
        const turned = point.rotate(Math.PI / 3);
        expect(turned).not.toBe(point);
        expect(point).toEqual(new Point(3, 4));
    });

    it("is its own inverse when negated", () => {
        const point = new Point(13, -7);
        close(point.rotate(0.9).rotate(-0.9), point);
    });

    it("costs nothing for a zero angle", () => {
        const point = new Point(3, 4);
        expect(point.rotate(0)).toEqual(point);
        expect(point.rotate(0)).not.toBe(point);
    });
});

describe("angleTo", () => {
    it("measures from the x axis", () => {
        expect(new Point(0, 0).angleTo(new Point(1, 0))).toBeCloseTo(0);
        expect(new Point(0, 0).angleTo(new Point(0, 1))).toBeCloseTo(Math.PI / 2);
        expect(new Point(5, 5).angleTo(new Point(6, 5))).toBeCloseTo(0);
    });
});

describe("angleBetween", () => {
    it("measures the sweep around this point", () => {
        const pivot = new Point(0, 0);
        expect(pivot.angleBetween(new Point(10, 0), new Point(0, 10))).toBeCloseTo(Math.PI / 2);
        expect(pivot.angleBetween(new Point(0, 10), new Point(10, 0))).toBeCloseTo(-Math.PI / 2);
    });

    it("takes the short way round the seam behind the pivot", () => {
        //Either side of the -π/π boundary, a small step backwards. Subtracting the raw angles gives nearly
        //a full turn forwards instead — the sign flips as well as the magnitude being wrong.
        const swept = new Point(0, 0).angleBetween(new Point(-10, -1), new Point(-10, 1));
        expect(Math.abs(swept)).toBeLessThan(0.5);
        expect(swept).toBeLessThan(0);
    });

    it("is zero when nothing moved", () => {
        expect(new Point(0, 0).angleBetween(new Point(5, 5), new Point(5, 5))).toBe(0);
    });

    it("works about a pivot away from the origin", () => {
        const pivot = new Point(400, 300);
        expect(pivot.angleBetween(new Point(500, 300), new Point(400, 400))).toBeCloseTo(Math.PI / 2);
    });
});
