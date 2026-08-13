import {describe, it, expect} from "vitest";
import {Anchor, GradumRect, Point} from "../../../../../build/gradum-kit.esm";
import {RotateTool} from "../rotate.tool";

type Turner = {turn(el: any, from: Point, to: Point): void; anchor: Anchor | Point};
const tool = Object.create(RotateTool.prototype) as Turner;

//A target with no rotate() of its own: just the fields getRect reads. That is the fallback's whole audience.
function plain(x: number, y: number, size = 100, anchor: Anchor = Anchor.Center) {
    return {position: new Point(x, y), size: new Point(size, size), rotation: 0, anchor};
}

const close = (a: Point, b: Point) => expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeLessThan(1e-9);
const cornerOf = (el: any, anchor: Anchor) =>
    new GradumRect({x: el.position.x, y: el.position.y, width: el.size.x, height: el.size.y,
        anchor: el.anchor, angleRad: el.rotation}).pointAt(anchor);

describe("turning a target that only exposes a rotation", () => {
    it("turns it by the swept angle", () => {
        tool.anchor = Anchor.Center;
        const el = plain(400, 300);
        //A quarter turn around its centre.
        tool.turn(el, new Point(500, 300), new Point(400, 400));
        expect(el.rotation).toBeCloseTo(Math.PI / 2);
    });

    it("leaves position alone when the pivot is what it is positioned from", () => {
        tool.anchor = Anchor.Center;
        const el = plain(400, 300);
        tool.turn(el, new Point(500, 300), new Point(400, 400));
        close(el.position, new Point(400, 300));
    });

    it("carries it round a pivot it is not positioned from", () => {
        tool.anchor = Anchor.TopLeft;
        const el = plain(400, 300);
        const pinned = cornerOf(el, Anchor.TopLeft);

        tool.turn(el, new Point(500, 300), new Point(400, 400));

        expect(el.rotation).not.toBe(0);
        //The corner it turned about has not moved; the target itself has swung around it.
        close(cornerOf(el, Anchor.TopLeft), pinned);
        expect(Math.hypot(el.position.x - 400, el.position.y - 300)).toBeGreaterThan(1);
    });

    it("accumulates, and ignores a sweep of nothing", () => {
        tool.anchor = Anchor.Center;
        const el = plain(400, 300);
        tool.turn(el, new Point(500, 300), new Point(400, 400));
        tool.turn(el, new Point(400, 400), new Point(300, 300));
        expect(el.rotation).toBeCloseTo(Math.PI);

        const before = el.rotation;
        tool.turn(el, new Point(500, 300), new Point(500, 300));
        expect(el.rotation).toBe(before);
    });

    it("does nothing for a target with no geometry to measure", () => {
        const el: any = {rotation: 0};
        expect(() => tool.turn(el, new Point(0, 0), new Point(10, 10))).not.toThrow();
        expect(el.rotation).toBe(0);
    });
});
