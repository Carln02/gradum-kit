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
        expect(seen[1].x).toBe(500 - seen[1].width / 2);

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

    it("reports the untilted top-left, so a transform can place then rotate it", () => {
        const square = Square.create({}) as Square;
        square.position = new Point(400, 300);
        square.size = new Point(100, 100);
        square.rotation = Math.PI / 2;

        const rect = square.getBoundingClientRect() as GradumRect;
        //Rotating a square about its centre leaves the centre alone, so x/y stay the unrotated corner —
        //which is exactly what the view and the selection box both translate to before rotating.
        expect(rect.x).toBe(350);
        expect(rect.y).toBe(250);
        expect(rect.width).toBe(100);
        expect(rect.angleRad).toBeCloseTo(Math.PI / 2);
    });
});
