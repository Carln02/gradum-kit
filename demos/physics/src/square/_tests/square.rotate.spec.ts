import {describe, it, expect} from "vitest";
import {Anchor, AnchorPoint, Point} from "../../../../../build/gradum-kit.esm";
import {Square} from "../square";

function corner(square: Square, anchor: Anchor): Point {
    const fraction = new AnchorPoint(anchor).fraction;
    const offset = new Point(square.size.x * fraction.x, square.size.y * fraction.y);
    return square.position.add(offset.rotate(square.rotation));
}

const close = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y) < 1e-9;

function makeSquare(rotation = 0) {
    const square = Square.create({}) as Square;
    square.position = new Point(400, 300);
    square.size = new Point(100, 100);
    square.rotation = rotation;
    return square;
}

describe("rotate about the centre", () => {
    it("turns by the swept angle and stays put", () => {
        const square = makeSquare();
        //A quarter turn around the centre at (400, 300).
        square.rotate(new Point(450, 300), new Point(400, 350));

        expect(square.rotation).toBeCloseTo(Math.PI / 2);
        expect(close(square.position, new Point(400, 300))).toBe(true);
    });

    it("accumulates across drags", () => {
        const square = makeSquare();
        square.rotate(new Point(450, 300), new Point(400, 350));
        square.rotate(new Point(400, 350), new Point(350, 300));
        expect(square.rotation).toBeCloseTo(Math.PI);
    });

    it("ignores a sweep of nothing", () => {
        const square = makeSquare(0.4);
        square.rotate(new Point(450, 300), new Point(450, 300));
        expect(square.rotation).toBe(0.4);
    });
});

describe("rotate about a corner", () => {
    it("keeps that corner pinned and swings the square around it", () => {
        for (const anchor of [Anchor.TopLeft, Anchor.TopRight, Anchor.BottomLeft, Anchor.BottomRight]) {
            const square = makeSquare();
            const pinned = corner(square, anchor);

            square.rotate(new Point(500, 300), new Point(400, 400), anchor);

            expect(square.rotation).not.toBe(0);
            //Turning about a corner carries the square around it, so the centre moves — but the corner does not.
            expect(close(corner(square, anchor), pinned), `${anchor}`).toBe(true);
            expect(close(square.position, new Point(400, 300)), `${anchor} centre moved`).toBe(false);
        }
    });

    it("works from an already-rotated square", () => {
        const square = makeSquare(Math.PI / 3);
        const pinned = corner(square, Anchor.BottomRight);
        square.rotate(new Point(500, 300), new Point(430, 380), Anchor.BottomRight);
        expect(close(corner(square, Anchor.BottomRight), pinned)).toBe(true);
    });
});

describe("the square's own anchor is what it pivots on", () => {
    it("rotating leaves position exactly where it is", () => {
        for (const anchor of [Anchor.Center, Anchor.TopLeft, Anchor.BottomRight]) {
            const square = makeSquare(0.3);
            square.anchor = anchor;
            const before = square.position;

            square.rotate(new Point(600, 300), new Point(500, 420));

            expect(square.rotation).not.toBeCloseTo(0.3);
            //`position` names the anchor, and the anchor is the pivot — so it cannot move.
            expect(close(square.position, before), `${anchor}`).toBe(true);
        }
    });

    it("resizing leaves position exactly where it is", () => {
        for (const anchor of [Anchor.Center, Anchor.TopLeft, Anchor.BottomRight]) {
            const square = makeSquare(0.3);
            square.anchor = anchor;
            const before = square.position;

            square.resize(new Point(30, 20));

            expect(square.size).not.toEqual(new Point(100, 100));
            expect(close(square.position, before), `${anchor}`).toBe(true);
        }
    });

    it("still pivots elsewhere when told to, moving position onto that arc", () => {
        const square = makeSquare();
        square.anchor = Anchor.Center;
        const corner = square.getBoundingClientRect().pointAt(Anchor.TopLeft);

        square.rotate(new Point(600, 300), new Point(400, 500), Anchor.TopLeft);

        expect(close(square.getBoundingClientRect().pointAt(Anchor.TopLeft), corner)).toBe(true);
        expect(close(square.position, new Point(400, 300))).toBe(false);
    });
});
