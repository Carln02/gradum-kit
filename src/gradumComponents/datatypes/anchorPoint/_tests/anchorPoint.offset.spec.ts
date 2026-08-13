import {describe, it, expect} from "vitest";
import {AnchorPoint} from "../anchorPoint";
import {Point} from "../../point/point";
import {Anchor} from "../../../../types/enums.types";

const close = (a: Point, b: Point) => expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeLessThan(1e-9);

describe("fraction", () => {
    it("scales the percentage into the form that multiplies a size", () => {
        expect(new AnchorPoint(Anchor.TopLeft).fraction).toEqual(new Point(-0.5, -0.5));
        expect(new AnchorPoint(Anchor.Center).fraction).toEqual(new Point(0, 0));
        expect(new AnchorPoint(Anchor.BottomRight).fraction).toEqual(new Point(0.5, 0.5));
        expect(new AnchorPoint(Anchor.TopMiddle).fraction).toEqual(new Point(0, -0.5));
    });
});

describe("offsetIn", () => {
    const size = new Point(100, 80);

    it("reaches each corner of an upright box", () => {
        close(new AnchorPoint(Anchor.TopLeft).offsetIn(size), new Point(-50, -40));
        close(new AnchorPoint(Anchor.BottomRight).offsetIn(size), new Point(50, 40));
        close(new AnchorPoint(Anchor.CenterRight).offsetIn(size), new Point(50, 0));
    });

    it("is zero at the centre, whatever the box or the angle", () => {
        close(new AnchorPoint(Anchor.Center).offsetIn(size, 1.3), new Point(0, 0));
    });

    it("turns with the box", () => {
        //A quarter turn sends the top-left offset (-50, -40) round to (40, -50).
        close(new AnchorPoint(Anchor.TopLeft).offsetIn(size, Math.PI / 2), new Point(40, -50));
    });

    it("lands on the corner when added to the middle", () => {
        const middle = new Point(400, 300);
        const rotation = Math.PI / 6;
        const corner = middle.add(new AnchorPoint(Anchor.BottomLeft).offsetIn(size, rotation));

        //Same thing the long way round: the untilted corner, swung about the middle.
        close(corner, new Point(350, 340).rotate(rotation, middle));
    });

    it("accepts a plain coordinate for the size", () => {
        close(new AnchorPoint(Anchor.BottomRight).offsetIn({x: 20, y: 10}), new Point(10, 5));
    });
});
