import {describe, it, expect} from "vitest";
import {gradum, Point} from "../../../../../build/gradum-kit.esm";
import {Canvas} from "../canvas";
import {Square} from "../../square/square";

const collect = async () => {
    (globalThis as any).gc?.();
    await new Promise(resolve => setTimeout(resolve, 10));
    (globalThis as any).gc?.();
};

//Only meaningful under --expose-gc; without it these assert the ordinary behaviour and the collection is a
//no-op. Run with NODE_OPTIONS="--expose-gc" to exercise the case this guards against.
describe("a substrate keeps the objects it is given", () => {
    it("does not lose an object nothing else references", async () => {
        const canvas = Canvas.create({parent: document.body}) as Canvas;

        //Handed straight over, exactly as AddSquareTool does it — no local holds on to it. GradumNodeList
        //stores entries weakly, so the substrate is the only thing that can keep this alive.
        canvas.addObject(Square.create({position: new Point(400, 300)}));
        expect(canvas.objects.length).toBe(1);

        await collect();
        expect(canvas.objects.length, "survived collection").toBe(1);
    });

    it("still lets go on removeObject", async () => {
        const canvas = Canvas.create({parent: document.body}) as Canvas;
        const square = Square.create({position: new Point(400, 300)}) as Square;

        canvas.addObject(square);
        expect(canvas.objects).toEqual([square]);

        canvas.removeObject(square);
        expect(canvas.objects).toEqual([]);
    });

    it("keeps the constrainers looking at the same list", async () => {
        const canvas = Canvas.create({parent: document.body}) as Canvas;
        canvas.addObject(Square.create({position: new Point(400, 300)}));
        await collect();

        const constrainers = Array.from(gradum(canvas).constrainers as any) as any[];
        expect(constrainers.map(entry => entry.constrainerName).sort()).toEqual(["main", "pusher", "spacer"]);
        for (const constrainer of constrainers) {
            expect(Array.from(constrainer.objectList).length, constrainer.constrainerName).toBe(1);
            expect(Array.from(constrainer.triggerList).length, constrainer.constrainerName).toBe(1);
        }
    });
});