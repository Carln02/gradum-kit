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
