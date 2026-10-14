import {describe, it, expect} from "vitest";
import {GradumRect} from "../rect";
import {Point} from "../../point/point";
import {Anchor} from "../../../../types/enums.types";

const close = (a: Point, b: Point) => expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeLessThan(1e-9);

describe("an unrotated rect reads like the DOMRect it extends", () => {
    it("puts x and y at the top-left by default", () => {
        const rect = new GradumRect({x: 10, y: 20, width: 100, height: 50});
        close(rect.center, new Point(60, 45));
        expect(rect.left).toBe(10);
        expect(rect.right).toBe(110);
    });

    it("keeps that behaviour through fromDOMRect", () => {
        const rect = GradumRect.fromDOMRect(new DOMRect(10, 20, 100, 50));
        close(rect.center, new Point(60, 45));
    });
});

describe("the anchor is the origin", () => {
    it("reads x and y as the anchor's position", () => {
        const size = {width: 100, height: 80};
        close(new GradumRect({x: 400, y: 300, ...size, anchor: Anchor.Center}).center, new Point(400, 300));
        close(new GradumRect({x: 400, y: 300, ...size, anchor: Anchor.TopLeft}).center, new Point(450, 340));
        close(new GradumRect({x: 400, y: 300, ...size, anchor: Anchor.BottomRight}).center, new Point(350, 260));
    });

    it("finds any of its anchors from any other", () => {
        const rect = new GradumRect({x: 400, y: 300, width: 100, height: 80, anchor: Anchor.Center});
        close(rect.pointAt(Anchor.TopLeft), new Point(350, 260));
        close(rect.pointAt(Anchor.BottomRight), new Point(450, 340));
        close(rect.pointAt(Anchor.Center), new Point(400, 300));
    });
});

describe("the anchor is what it turns about", () => {
    it("leaves the anchor where it is, whatever the rotation", () => {
        for (const anchor of [Anchor.Center, Anchor.TopLeft, Anchor.BottomRight, Anchor.CenterLeft]) {
            for (const angleRad of [0, Math.PI / 4, Math.PI / 2, -1.1]) {
                const rect = new GradumRect({x: 400, y: 300, width: 100, height: 80, anchor, angleRad});
                //`x`/`y` name the anchor, so turning about it cannot move it.
                close(rect.pointAt(anchor), new Point(400, 300));
            }
        }
    });

    it("swings the centre around the anchor", () => {
        const rect = new GradumRect({x: 400, y: 300, width: 100, height: 100,
            anchor: Anchor.TopLeft, angleRad: Math.PI / 2});
        //Unrotated the centre would sit at (450, 350); a quarter turn about the top-left carries it round.
        close(rect.center, new Point(350, 350));
    });

    it("carries the corners with it", () => {
        const rect = new GradumRect({x: 400, y: 300, width: 100, height: 100,
            anchor: Anchor.TopLeft, angleRad: Math.PI / 2});
        //The corner the rect is anchored to is the first of `points`, and it has not moved.
        close(rect.points[0], new Point(400, 300));
    });
});

describe("fromSegment still lies along its segment", () => {
    it("spans the two ends", () => {
        const a = new Point(100, 100), b = new Point(200, 200);
        const rect = GradumRect.fromSegment(a, b, 10);

        //Anchored and turned about the midpoint, so its own centre is that midpoint.
        close(rect.center, new Point(150, 150));
        //And its short edges land on the segment's ends.
        close(rect.pointAt(Anchor.CenterLeft), a);
        close(rect.pointAt(Anchor.CenterRight), b);
    });
});

describe("topLeft is the corner to lay the rectangle out from", () => {
    it("is the real corner while the rectangle is upright", () => {
        const rect = new GradumRect({x: 10, y: 20, width: 100, height: 50});
        close(rect.topLeft, new Point(10, 20));
        close(rect.topLeft, rect.points[0]);
    });

    it("follows the anchor rather than x and y", () => {
        const rect = new GradumRect({x: 400, y: 300, width: 100, height: 80, anchor: Anchor.Center});
        close(rect.topLeft, new Point(350, 260));
    });

    it("parts ways with the actual corner once rotated", () => {
        const rect = new GradumRect({x: 400, y: 300, width: 100, height: 100,
            anchor: Anchor.Center, angleRad: Math.PI / 4});
        //Still the untilted box around the centre...
        close(rect.topLeft, new Point(350, 250));
        //...while the corner itself has swung round, which is the distinction worth keeping straight.
        expect(Math.hypot(rect.points[0].x - rect.topLeft.x, rect.points[0].y - rect.topLeft.y))
            .toBeGreaterThan(1);
        close(rect.points[0], rect.pointAt(Anchor.TopLeft));
    });

    it("places the box where a transform would draw it", () => {
        //What a `translate(topLeft) rotate(angle)` produces: the untilted box, turned about its middle.
        const rect = new GradumRect({x: 400, y: 300, width: 100, height: 60,
            anchor: Anchor.BottomRight, angleRad: 0.7});
        close(rect.topLeft.add(rect.half), rect.center);
    });
});

//`left`, `top`, `right` and `bottom` were left to `DOMRect`, which derives all four from `x` and `y` as
//though they were the top-left corner. A rect carrying any other anchor therefore described a box its
//anchor's offset away from the one it drew — silently, and only for the objects that had good reason not
//to be top-left anchored.
describe("every reading of a rect describes the same box", () => {
    it("resolves the edges through the anchor", () => {
        const rect = new GradumRect({x: 100, y: 100, width: 80, height: 60, anchor: Anchor.Center});

        close(rect.center, new Point(100, 100));
        expect(rect.left).toBe(60);
        expect(rect.right).toBe(140);
        expect(rect.top).toBe(70);
        expect(rect.bottom).toBe(130);
    });

    it("agrees with the corner it reports", () => {
        for (const anchor of [Anchor.TopLeft, Anchor.Center, Anchor.BottomRight, Anchor.TopRight]) {
            const rect = new GradumRect({x: 400, y: 300, width: 100, height: 80, anchor});
            expect([rect.left, rect.top], String(anchor)).toEqual([rect.topLeft.x, rect.topLeft.y]);
            expect([rect.right, rect.bottom], String(anchor)).toEqual([rect.left + 100, rect.top + 80]);
        }
    });

    it("describes one box however it is anchored", () => {
        const centred = new GradumRect({x: 100, y: 100, width: 80, height: 60, anchor: Anchor.Center});
        const cornered = new GradumRect({x: 60, y: 70, width: 80, height: 60});

        expect([centred.left, centred.top, centred.right, centred.bottom])
            .toEqual([cornered.left, cornered.top, cornered.right, cornered.bottom]);
    });

    it("still reads like a DOMRect when anchored to its top-left", () => {
        const rect = new GradumRect({x: 10, y: 20, width: 100, height: 50});
        expect([rect.x, rect.left, rect.top, rect.right, rect.bottom]).toEqual([10, 10, 20, 110, 70]);
    });

    it("reports the edges through the anchor in toJSON too", () => {
        const json = new GradumRect({x: 100, y: 100, width: 80, height: 60, anchor: Anchor.Center}).toJSON() as any;
        expect([json.left, json.right]).toEqual([60, 140]);
    });
});

describe("a rect can be restated from another anchor", () => {
    it("keeps the same box, in the same place", () => {
        const centred = new GradumRect({x: 100, y: 100, width: 80, height: 60, anchor: Anchor.Center});

        const cornered = centred.withAnchor(Anchor.TopLeft);

        expect([cornered.x, cornered.y]).toEqual([60, 70]);
        close(cornered.center, centred.center);
        expect([cornered.left, cornered.right]).toEqual([centred.left, centred.right]);
    });

    it("keeps the rotation, and the box it draws", () => {
        const centred = new GradumRect({x: 100, y: 100, width: 80, height: 60,
            anchor: Anchor.Center, angleDeg: 30});

        const cornered = centred.withAnchor(Anchor.BottomRight);

        expect(cornered.angleRad).toBe(centred.angleRad);
        close(cornered.center, centred.center);
        centred.points.forEach((point, at) => close(point, cornered.points[at]));
    });

    it("round-trips", () => {
        const rect = new GradumRect({x: 7, y: 11, width: 40, height: 25, anchor: Anchor.TopRight, angleDeg: 17});
        close(rect.withAnchor(Anchor.Center).withAnchor(Anchor.TopRight).origin, rect.origin);
    });
});

describe("the constructors place a rect from the anchor asked for", () => {
    it("keeps fromSegment on its segment whatever anchor is asked for", () => {
        const a = new Point(0, 0), b = new Point(100, 0);

        const centred = GradumRect.fromSegment(a, b, 10);
        const cornered = GradumRect.fromSegment(a, b, 10, {anchor: Anchor.TopLeft});

        //Asking for a different anchor used to relabel the midpoint as a corner, moving the rect off the
        //segment it was built to cover.
        close(cornered.center, centred.center);
        close(cornered.center, new Point(50, 0));
    });

    it("keeps fromDOMRect over the same box whatever anchor is asked for", () => {
        const source = new DOMRect(10, 20, 100, 50);

        const centred = GradumRect.fromDOMRect(source, {anchor: Anchor.Center});

        close(centred.center, new Point(60, 45));
        expect([centred.left, centred.top, centred.right, centred.bottom]).toEqual([10, 20, 110, 70]);
    });
});
