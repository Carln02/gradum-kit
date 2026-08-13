import {describe, it, expect} from "vitest";
import {gradum, Point} from "../../../../../build/gradum-kit.esm";
import {Canvas} from "../canvas";
import {Square} from "../../square/square";

//The substrate holds its objects in a plain Set, so both constrainer lists have to read that set live. The
//failure this guards against is silent: the trigger lookup finds nothing and no solver is ever called.
describe("a square on the substrate triggers the constrainers", () => {
    it("is visible to every constrainer's trigger list", () => {
        const canvas = Canvas.create({parent: document.body}) as Canvas;
        const square = Square.create({position: new Point(400, 300)}) as Square;
        canvas.addObject(square);

        for (const constrainer of Array.from(gradum(canvas).constrainers as any) as any[]) {
            expect(constrainer.triggerList.has(square), `${constrainer.constrainerName} has`).toBe(true);
            expect(Array.from(constrainer.objectList), constrainer.constrainerName).toContain(square);
        }
    });

    it("sees objects added after the constrainers were built", () => {
        //The ordering that broke it: the lists get bound while the set is still empty.
        const canvas = Canvas.create({parent: document.body}) as Canvas;
        const constrainers = Array.from(gradum(canvas).constrainers as any) as any[];
        for (const constrainer of constrainers) expect(Array.from(constrainer.objectList).length).toBe(0);

        const square = Square.create({position: new Point(400, 300)}) as Square;
        canvas.addObject(square);

        for (const constrainer of constrainers) expect(constrainer.triggerList.has(square)).toBe(true);
    });

    it("actually solves: a pusher shoves the square it overlaps", () => {
        const canvas = Canvas.create({parent: document.body}) as Canvas;
        const pusher = Square.create({position: new Point(400, 300)}) as Square;
        const pushed = Square.create({position: new Point(460, 300)}) as Square;
        canvas.addObject(pusher);
        canvas.addObject(pushed);
        gradum(pusher).metadata.set(true, "isPusher");

        //Stand in for the drag tool: it moves the target first, then the constrainers solve for that move.
        pusher.position = new Point(410, 300);
        const event = Object.assign(new Event("gradum-drag"), {deltaPosition: new Point(10, 0)});

        gradum(pusher).solveConstrainersForEvent({event, eventTarget: pusher} as any);

        //Boxes are 100 wide and centred, so pusher now spans 360..460 and pushed 410..510 — 50 of overlap,
        //which is exactly how far the pushed square has to travel to come clear.
        expect(pushed.position.x, "the pushed square moved").toBe(510);
        expect(pusher.position.x, "the pusher stayed put").toBe(410);
    });
});
