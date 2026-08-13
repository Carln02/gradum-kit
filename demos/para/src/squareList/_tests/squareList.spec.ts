import {describe, it, expect} from "vitest";
import {gradum, Point} from "../../../../../build/gradum-kit.esm";
import {SquareList} from "../squareList";
import {Canvas} from "../../canvas/canvas";
import {Square} from "../../square/square";

const tick = () => new Promise(resolve => setTimeout(resolve, 0));

function makeList() {
    Canvas.create({parent: document.body});
    const list = new SquareList();
    (list as any).initialize();
    return list;
}

describe("the square list drives the new Square", () => {
    it("marks only its two ends modifiable", async () => {
        const list = makeList();
        await tick();

        const squares = Array.from(document.querySelectorAll("demo-square")) as Square[];
        expect(squares.length).toBeGreaterThan(2);

        //`modifiable` lives in metadata now, and it is what the select tool reads before moving anything.
        expect(gradum(squares[0]).metadata.get("modifiable")).toBe(true);
        expect(gradum(squares[squares.length - 1]).metadata.get("modifiable")).toBe(true);
        for (const middle of squares.slice(1, -1)) {
            expect(gradum(middle).metadata.get("modifiable")).toBe(false);
        }
    });

    it("still interpolates the middles between the ends", async () => {
        const list = makeList();
        await tick();

        list.startSquare.position = new Point(0, 0);
        list.endSquare.position = new Point(1000, 0);
        await tick();

        const squares = Array.from(document.querySelectorAll("demo-square")) as Square[];
        const middles = squares.slice(1, -1);

        //Spread out along the line, in order — the reifect writing through the new Square's exposed setters.
        for (let i = 1; i < middles.length; i++) {
            expect(middles[i].position.x).toBeGreaterThan(middles[i - 1].position.x);
        }
        expect(middles[0].position.x).toBeGreaterThan(0);
        expect(middles[middles.length - 1].position.x).toBeLessThan(1000);
    });
});
