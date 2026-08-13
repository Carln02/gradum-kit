import {describe, it, expect} from "vitest";
import {effect, GradumRect, Point} from "../../../../../build/gradum-kit.esm";
import {Square} from "../square";

const tick = () => new Promise(resolve => setTimeout(resolve, 0));

describe("getBoundingClientRect is reactive", () => {
    //The selection box tracks its target by calling getBoundingClientRect inside an effect. That only keeps
    //following the square if the call reads the model's signals — a plain method call subscribes to nothing.
    it("re-runs an effect on position, size and rotation changes", async () => {
        const square = Square.create({}) as Square;
        const seen: GradumRect[] = [];

        const dispose = effect(() => {
            seen.push(square.getBoundingClientRect() as GradumRect);
        });
        await tick();
        expect(seen.length).toBe(1);

        square.position = new Point(500, 300);
        await tick();
        expect(seen.length, "position change").toBe(2);
        //`x` is the anchor's position now, and a square anchors at its centre by default.
        expect(seen[1].x).toBe(500);

        square.size = new Point(200, 200);
        await tick();
        expect(seen.length, "size change").toBe(3);
        expect(seen[2].width).toBe(200);

        square.rotation = Math.PI / 4;
        await tick();
        expect(seen.length, "rotation change").toBe(4);
        expect(seen[3].angleRad).toBeCloseTo(Math.PI / 4);

        dispose();
        square.position = new Point(0, 0);
        await tick();
        expect(seen.length, "disposed").toBe(4);
    });

    it("reports its origin at the anchor, and works its centre out from there", () => {
        const square = Square.create({}) as Square;
        square.position = new Point(400, 300);
        square.size = new Point(100, 100);
        square.rotation = Math.PI / 2;

        const rect = square.getBoundingClientRect() as GradumRect;
        //Anchored at its centre, so the origin is the position and turning about it moves nothing.
        expect(rect.x).toBe(400);
        expect(rect.y).toBe(300);
        expect(rect.center.x).toBeCloseTo(400);
        expect(rect.center.y).toBeCloseTo(300);
        expect(rect.width).toBe(100);
        expect(rect.angleRad).toBeCloseTo(Math.PI / 2);
    });
});
