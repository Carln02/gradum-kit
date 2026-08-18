import {describe, it, expect} from "vitest";
import {Reifect} from "../../reifect/reifect";

type Placed = {value: number};

/**
 * A reifect that spreads its objects over 0..100 by their place in the attached list. Enough to see both what
 * an object is given and how many the reifect thinks it is placing.
 */
function makeReifect() {
    return new Reifect<Placed>({
        properties: {value: (index: number, total: number) => (index + 1) / (total + 1) * 100}
    });
}

describe("a detached object is left alone", () => {
    it("stops being placed once it is detached", () => {
        const reifect = makeReifect();
        const objects: Placed[] = [{value: 0}, {value: 0}, {value: 0}];
        reifect.attach(...objects);
        reifect.apply();

        const dropped = objects[1];
        reifect.detach(dropped);
        dropped.value = -1;

        //Placed by nobody now: an apply the object is no longer part of must leave it as it was found.
        reifect.apply();
        expect(dropped.value).toBe(-1);
    });

    it("stops being counted in what the others are placed by", () => {
        const reifect = makeReifect();
        const objects: Placed[] = [{value: 0}, {value: 0}, {value: 0}];
        reifect.attach(...objects);
        reifect.apply();

        const alone = objects[0];
        const spreadOfThree = alone.value;

        reifect.detach(objects[1], objects[2]);
        //Worked out afresh rather than reused, so the placement reflects who is actually attached.
        reifect.apply(undefined, {recomputeIndices: true, recomputeProperties: true});

        //One of three sits a quarter of the way along; the only one left sits halfway. A detached object still
        //on the list would be counted again and leave the survivor where it was.
        expect(spreadOfThree).toBeCloseTo(25);
        expect(alone.value).toBeCloseTo(50);
    });

    it("takes an object back when it is attached again", () => {
        const reifect = makeReifect();
        const objects: Placed[] = [{value: 0}, {value: 0}];
        reifect.attach(...objects);

        reifect.detach(objects[0]);
        objects[0].value = -1;
        reifect.attach(objects[0]);
        reifect.apply();

        expect(objects[0].value).toBeGreaterThan(0);
    });
});
