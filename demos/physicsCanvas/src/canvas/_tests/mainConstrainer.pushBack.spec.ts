import {describe, it, expect} from "vitest";
import {GradumRect, Point} from "../../../../../build/gradum-kit.esm";
import {CanvasConstrainer} from "../canvas.mainConstrainer";

type Physics = {
    pushElement(pusher: object, pushed: object, delta: Point, pushBack?: boolean): Point;
    mtvAxis(a: object, b: object): {normal: Point, depth: number} | null;
};

const physics = Object.create(CanvasConstrainer.prototype) as Physics;

//A movable stand-in, and a plain object rather than an Element: a position the solver can write to, and a
//box derived from it. Between them that is everything the constrainer needs of the things it moves.
function movable(x: number, y: number, size = 100, angleDeg = 0) {
    const obj: any = {position: new Point(x, y)};
    obj.getBoundingClientRect = () => new GradumRect(
        {x: obj.position.x, y: obj.position.y, width: size, height: size, angleDeg});
    return obj;
}

const depthBetween = (a: object, b: object) => physics.mtvAxis(a, b)?.depth ?? 0;

describe("pushBack separates the element it moves", () => {
    it("bounces clear when the element was moving into the obstacle", () => {
        const el = movable(0, 0), obstacle = movable(60, 0);
        //Moving right, straight into an obstacle on the right.
        physics.pushElement(el, obstacle, new Point(10, 0), true);
        expect(physics.mtvAxis(el, obstacle)).toBeNull();
    });

    it("bounces clear even when the element was already moving away", () => {
        const el = movable(0, 0), obstacle = movable(60, 0);
        const before = depthBetween(el, obstacle);
        expect(before).toBeGreaterThan(0);

        //Same overlap, but the recorded delta points away from the obstacle. A diagonal push off a rotated
        //pusher lands here routinely: the delta's sign along the separating axis is then more or less
        //arbitrary, where an axis-aligned push almost always opposed it.
        physics.pushElement(el, obstacle, new Point(-10, 0), true);

        expect(physics.mtvAxis(el, obstacle)).toBeNull();
    });

    it("never ends up deeper than it started, whichever way the delta points", () => {
        for (const delta of [new Point(10, 0), new Point(-10, 0), new Point(7, 7), new Point(-7, -7),
            new Point(7, -7), new Point(-7, 7)]) {
            const el = movable(0, 0), obstacle = movable(60, 20);
            const before = depthBetween(el, obstacle);
            physics.pushElement(el, obstacle, delta, true);
            const after = depthBetween(el, obstacle);
            expect(after, `delta ${delta.x},${delta.y}`).toBeLessThanOrEqual(before);
        }
    });
});
