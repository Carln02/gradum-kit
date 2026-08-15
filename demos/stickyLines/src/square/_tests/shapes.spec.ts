import {describe, it, expect} from "vitest";
import {Anchor, gradum, Point} from "../../../../../build/gradum-kit.esm";
import {Square} from "../square";
import {Circle} from "../../circle/circle";
import {Triangle} from "../../triangle/triangle";
import {StickyLine} from "../../stickyLine/stickyLine";
import {getRect} from "../../utils/getRect";

const tick = () => new Promise(resolve => setTimeout(resolve, 0));

describe("size takes a plain number, the way the add tools give it", () => {
    it("reads a number as both axes", () => {
        expect((Square.create({size: 20}) as Square).size).toEqual(new Point(20, 20));
        expect((Circle.create({size: 80}) as Circle).size).toEqual(new Point(80, 80));
        expect((Triangle.create({size: 60}) as Triangle).size).toEqual(new Point(60, 60));
    });

    it("still takes a Point, and still refuses to collapse", () => {
        expect((Square.create({size: new Point(30, 40)}) as Square).size).toEqual(new Point(30, 40));
        //Clamped to the floor rather than allowed to vanish.
        expect((Square.create({size: 1}) as Square).size).toEqual(new Point(5, 5));
    });
});

describe("the shapes share the new Square", () => {
    it("marks every one of them modifiable, sticky lines included", () => {
        for (const shape of [Square.create({}), Circle.create({}), Triangle.create({})]) {
            expect(gradum(shape).metadata.get("modifiable")).toBe(true);
        }
        //Not a Square, so it says so itself — otherwise the select tool would ignore it.
        expect(gradum(StickyLine.create({}) as any).metadata.get("modifiable")).toBe(true);
    });

    it("keeps each shape's own move behaviour", () => {
        const square = Square.create({position: new Point(100, 100)}) as Square;
        const circle = Circle.create({position: new Point(100, 100)}) as Circle;
        const triangle = Triangle.create({position: new Point(100, 100)}) as Triangle;

        for (const shape of [square, circle, triangle]) shape.move(new Point(10, 0));

        expect(square.position.x).toBe(110);
        expect(circle.position.x).toBe(90);    //moves against the drag
        expect(triangle.position.x).toBe(120); //moves double
    });

    it("reports the anchor the sticky line constrainer aligns to", () => {
        //`origin` is the anchor's position, and it is the same point `position` writes — which is what lets
        //the constrainer measure and place through the same value.
        const centred = Square.create({position: new Point(400, 300), size: 100}) as Square;
        expect(getRect(centred).origin.x).toBeCloseTo(400);
        expect(getRect(centred).origin.y).toBeCloseTo(300);
        expect(getRect(centred).center.x).toBeCloseTo(400);

        //Anchored elsewhere, the anchor is still at `position` while the box hangs off it — so this one
        //would stand on a line rather than sit astride it.
        const standing = Square.create({position: new Point(400, 300), size: 100,
            anchor: Anchor.BottomMiddle}) as Square;
        expect(getRect(standing).origin.y).toBeCloseTo(300);
        expect(getRect(standing).center.y).toBeCloseTo(250);
    });
});

describe("the triangle draws itself from its size", () => {
    it("puts the size into its border widths", async () => {
        const triangle = Triangle.create({parent: document.body, size: 60}) as Triangle;
        await new Promise(resolve => setTimeout(resolve, 50));

        expect(triangle.style.borderLeftWidth).toBe("30px");
        expect(triangle.style.borderRightWidth).toBe("30px");
        expect(triangle.style.borderBottomWidth).toBe("60px");
    });
});
