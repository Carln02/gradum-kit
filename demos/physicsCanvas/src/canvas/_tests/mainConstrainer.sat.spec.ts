import {describe, it, expect} from "vitest";
import {Anchor, GradumRect, Point} from "../../../../../build/gradum-kit.esm";
import {CanvasConstrainer} from "../canvas.mainConstrainer";

//Reaches the protected geometry directly — it is the part worth pinning, and going through a real drag would
//test the event stack rather than the collision test.
type Geometry = {
    overlaps(a: object, b: object): boolean;
    mtvAxis(a: object, b: object): {normal: Point, depth: number} | null;
};

const geometry = Object.create(CanvasConstrainer.prototype) as Geometry;

//A plain object, deliberately not an Element: the constrainer works on whatever the substrate holds, and
//most of those are painted into a canvas rather than laid out. All it ever asks for is the box.
function box(x: number, y: number, size: number, angleDeg = 0) {
    //x/y name the untilted top-left, so the rect is anchored at its centre — which is also what makes it
    //turn about its middle rather than about that corner.
    const rect = new GradumRect({
        x: x + size / 2, y: y + size / 2, width: size, height: size, angleDeg, anchor: Anchor.Center
    });
    return {getBoundingClientRect: () => rect};
}

const round = (n: number) => Math.round(n * 1000) / 1000;

describe("upright boxes behave as before", () => {
    it("reports no overlap when apart", () => {
        expect(geometry.overlaps(box(0, 0, 100), box(200, 0, 100))).toBe(false);
    });

    it("reports no overlap when exactly touching", () => {
        expect(geometry.overlaps(box(0, 0, 100), box(100, 0, 100))).toBe(false);
    });

    it("separates along the shallower axis", () => {
        //Overlapping by 20 across and 60 down, so the way out is sideways.
        const mtv = geometry.mtvAxis(box(0, 0, 100), box(80, 40, 100));
        expect(mtv.depth).toBeCloseTo(20);
        expect(Math.abs(mtv.normal.x)).toBeCloseTo(1);
        expect(mtv.normal.y).toBeCloseTo(0);
    });

    it("points the normal away from the other box", () => {
        //b sits to the right of a, so a gets pushed left to clear it.
        const mtv = geometry.mtvAxis(box(0, 0, 100), box(80, 0, 100));
        expect(round(mtv.normal.x)).toBe(-1);
    });
});

describe("rotated boxes", () => {
    it("misses a corner-on square that an upright test would call a hit", () => {
        //Their axis-aligned rects overlap, but the 45° square's corner stops short of the other. The old
        //axis-aligned check treated the rotated square as the upright box containing it and collided here.
        const upright = box(0, 0, 100);
        const diamond = box(130, 130, 100, 45);
        //Sanity: the containing rects really do overlap, so this is the case that used to be wrong.
        expect(130 < 100 + 100 * (Math.SQRT2 - 1) / 2 + 100).toBe(true);
        expect(geometry.overlaps(upright, diamond)).toBe(false);
    });

    it("still collides when the rotated square genuinely reaches in", () => {
        expect(geometry.overlaps(box(0, 0, 100), box(60, 60, 100, 45))).toBe(true);
    });

    it("separates along the rotated box's own axis when that is the shallower way out", () => {
        //A 45° square approaching corner-first along the diagonal. Its own axis gives a smaller overlap than
        //either upright axis does, so the push comes out diagonal — something the old code could not express.
        //(Offset the other way, say purely horizontally, the upright axis wins and a straight push is right.)
        const mtv = geometry.mtvAxis(box(0, 0, 100), box(77.78, 77.78, 100, 45));
        expect(mtv).not.toBeNull();
        expect(Math.abs(mtv.normal.x)).toBeCloseTo(Math.SQRT1_2, 2);
        expect(Math.abs(mtv.normal.y)).toBeCloseTo(Math.SQRT1_2, 2);
        //A unit vector, so `depth` really is a distance in pixels.
        expect(round(Math.hypot(mtv.normal.x, mtv.normal.y))).toBe(1);
    });

    it("moving by the mtv actually separates them", () => {
        const a = box(0, 0, 100), b = box(70, 30, 100, 30);
        const mtv = geometry.mtvAxis(a, b);
        expect(mtv).not.toBeNull();

        //Re-measure with a shifted by the full mtv: they should now be exactly clear.
        const moved = box(0 + mtv.normal.x * mtv.depth, 0 + mtv.normal.y * mtv.depth, 100);
        expect(geometry.overlaps(moved, b)).toBe(false);
    });

    it("two boxes at the same angle collide like upright ones", () => {
        expect(geometry.overlaps(box(0, 0, 100, 30), box(200, 0, 100, 30))).toBe(false);
        expect(geometry.overlaps(box(0, 0, 100, 30), box(50, 0, 100, 30))).toBe(true);
    });
});

describe("degenerate input", () => {
    it("ignores a box with no area", () => {
        expect(geometry.overlaps(box(0, 0, 0), box(0, 0, 100))).toBe(false);
    });
});
