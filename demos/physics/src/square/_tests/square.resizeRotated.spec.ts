import {describe, it, expect} from "vitest";
import {Anchor, AnchorPoint, Point} from "../../../../../build/gradum-kit.esm";
import {Square} from "../square";

//Where a named corner of the square actually sits on screen: the centre, plus its offset along the square's
//own two axes, turned by the square's rotation.
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

const corners = [Anchor.TopLeft, Anchor.TopRight, Anchor.BottomLeft, Anchor.BottomRight];

//`resize` takes the pointer's screen movement — it works out the frame and the direction itself, from the
//anchor and its own rotation.
const drag = new Point(30, 20);

describe("resizing keeps the anchored corner where it is", () => {
    it("when the square is upright", () => {
        for (const anchor of corners) {
            const square = makeSquare();
            const before = corner(square, anchor);
            square.resize(drag, anchor);
            expect(close(corner(square, anchor), before), `${anchor}`).toBe(true);
        }
    });

    it("when the square is rotated", () => {
        //The case that drifted: growth happens along the square's axes, the centre used to be shifted along
        //the screen's, so the pinned corner slid away by the difference.
        for (const rotation of [Math.PI / 4, Math.PI / 2, -0.7, 2.3]) {
            for (const anchor of corners) {
                const square = makeSquare(rotation);
                const before = corner(square, anchor);
                square.resize(drag, anchor);
                expect(close(corner(square, anchor), before), `${anchor} @ ${rotation}`).toBe(true);
            }
        }
    });
});

describe("resizing follows the grip being dragged", () => {
    it("grows along the square's own axes, not the screen's", () => {
        const rotation = Math.PI / 3;
        const square = makeSquare(rotation);
        //Bottom-right grip pins the top-left, so the box grows by the drag measured in its own frame.
        square.resize(drag, Anchor.TopLeft);

        const expected = new Point(100, 100).add(drag.rotate(-rotation));
        expect(close(square.size, expected)).toBe(true);
    });

    it("inverts on the near side", () => {
        //Pinning the bottom-right means the top-left grip is the one moving, so the same drag shrinks it.
        const pinnedFar = makeSquare();
        pinnedFar.resize(drag, Anchor.TopLeft);
        const pinnedNear = makeSquare();
        pinnedNear.resize(drag, Anchor.BottomRight);

        expect(pinnedFar.size).toEqual(new Point(130, 120));
        expect(pinnedNear.size).toEqual(new Point(70, 80));
    });

    it("grows both ways about the centre, so the dragged edge keeps up", () => {
        const square = makeSquare();
        square.resize(drag, Anchor.Center);
        expect(close(square.position, new Point(400, 300))).toBe(true);
        expect(square.size).toEqual(new Point(160, 140));
    });

    it("keeps the ratio when asked", () => {
        const square = makeSquare();
        square.resize(drag, Anchor.TopLeft, true);
        //Both axes take the smaller of the two components.
        expect(square.size).toEqual(new Point(120, 120));
    });
});
