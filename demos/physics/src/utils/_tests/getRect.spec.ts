import {describe, it, expect} from "vitest";
import {Anchor, effect, GradumRect, Point, signal} from "../../../../../build/gradum-kit.esm";
import {getRect} from "../getRect";

const tick = () => new Promise(resolve => setTimeout(resolve, 0));

describe("getRect prefers an oriented box the object builds itself", () => {
    it("takes a GradumRect straight from getBoundingClientRect", () => {
        const own = new GradumRect({x: 1, y: 2, width: 3, height: 4, angleRad: 0.5});
        expect(getRect({getBoundingClientRect: () => own})).toBe(own);
    });
});

describe("getRect falls back to the object's own fields", () => {
    it("builds from position, size and rotation when the box is a plain DOMRect", () => {
        const rect = getRect({
            getBoundingClientRect: () => new DOMRect(0, 0, 10, 10),   //stale, upright, and ignored
            position: new Point(400, 300),
            size: new Point(100, 80),
            rotation: Math.PI / 4,
            anchor: Anchor.Center
        });
        //`x`/`y` are the anchor's position now; the centre is what the anchor resolves to.
        expect(rect.x).toBe(400);
        expect(rect.y).toBe(300);
        expect(rect.center.x).toBeCloseTo(400);
        expect(rect.center.y).toBeCloseTo(300);
        expect(rect.width).toBe(100);
        expect(rect.height).toBe(80);
        expect(rect.angleRad).toBeCloseTo(Math.PI / 4);
    });

    it("reads position as a corner when the object names its anchor", () => {
        const rect = getRect({position: new Point(400, 300), size: new Point(100, 80), anchor: Anchor.BottomRight});
        //The bottom-right sits at 400,300, so the centre is half a box back from it.
        expect(rect.center.x).toBeCloseTo(350);
        expect(rect.center.y).toBeCloseTo(260);
    });

    it("treats position as the top-left when no anchor is named", () => {
        const rect = getRect({position: new Point(400, 300), size: new Point(100, 80)});
        expect(rect.x).toBe(400);
        expect(rect.y).toBe(300);
        expect(rect.angleRad).toBe(0);
    });

    it("accepts plain coordinates and a single number for size", () => {
        expect(getRect({position: {x: 10, y: 20}, size: 50}).width).toBe(50);
        expect(getRect({position: {x: 10, y: 20}, width: 30, height: 40}).height).toBe(40);
    });
});

describe("getRect falls back to the painted box", () => {
    it("wraps a plain DOMRect as an upright GradumRect", () => {
        const rect = getRect({getBoundingClientRect: () => new DOMRect(5, 6, 7, 8)});
        expect(rect).toBeInstanceOf(GradumRect);
        expect(rect.x).toBe(5);
        expect(rect.width).toBe(7);
        expect(rect.angleRad).toBe(0);
    });

    it("gives nothing back for objects with no geometry at all", () => {
        expect(getRect(undefined)).toBeUndefined();
        expect(getRect({})).toBeUndefined();
        expect(getRect({getBoundingClientRect: () => new DOMRect(0, 0, 0, 0)})).toBeUndefined();
    });
});

describe("getRect stays reactive through the fallback path", () => {
    it("re-runs an effect when a plain object's signals change", async () => {
        //The point of the fallback: an object that isn't a Square, whose native getBoundingClientRect would
        //subscribe an effect to nothing, still drives one through its own signal-backed fields.
        class Shape {
            @signal public position: Point = new Point(0, 0);
            @signal public rotation: number = 0;
            public size = new Point(50, 50);
            public getBoundingClientRect() {return new DOMRect(0, 0, 50, 50)}
        }

        const shape = new Shape();
        const seen: GradumRect[] = [];
        const dispose = effect(() => {seen.push(getRect(shape))});
        await tick();
        expect(seen.length).toBe(1);

        shape.position = new Point(100, 100);
        await tick();
        expect(seen.length, "position").toBe(2);
        expect(seen[1].x).toBe(100);

        shape.rotation = 1;
        await tick();
        expect(seen.length, "rotation").toBe(3);
        expect(seen[2].angleRad).toBe(1);

        dispose();
    });
});
