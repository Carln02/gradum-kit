import {describe, it, expect, vi} from "vitest";
import {effect, initializeEffects, signal} from "../reactivity/reactivity";
import {auto} from "../auto/auto";
import {Point} from "../../gradumComponents/datatypes/point/point";

const tick = () => new Promise(resolve => queueMicrotask(resolve as () => void));
const clamp = (value: Point) => new Point(Math.max(value?.x ?? 0, 25), Math.max(value?.y ?? 0, 25));

describe("@auto keeps the value a member was declared with", () => {
    it("adopts an accessor's initializer", () => {
        class Box {
            @auto({preprocessValue: clamp}) accessor size: Point = new Point(100, 100);
        }
        expect(new Box().size).toEqual(new Point(100, 100));
    });

    it("adopts a field's initializer", () => {
        class Box {
            @auto({preprocessValue: clamp}) size: Point = new Point(100, 100);
        }
        expect(new Box().size).toEqual(new Point(100, 100));
    });

    it("runs the declared value through preprocessValue", () => {
        class Box {
            @auto({preprocessValue: clamp}) accessor size: Point = new Point(5, 5);
        }
        expect(new Box().size).toEqual(new Point(25, 25));
    });

    it("lets an explicit initialValue win over the declared one", () => {
        class Box {
            @auto({initialValue: new Point(7, 7)}) accessor size: Point = new Point(100, 100);
        }
        expect(new Box().size).toEqual(new Point(7, 7));
    });

    it("leaves a member with no initializer to its defaultValueCallback", () => {
        class Box {
            @auto({defaultValueCallback: () => new Point(3, 4)}) accessor size: Point;
        }
        expect(new Box().size).toEqual(new Point(3, 4));
    });
});

describe("@signal stacked on @auto", () => {
    class Box {
        @signal @auto({preprocessValue: clamp}) accessor size: Point = new Point(100, 100);
    }

    it("reads back the declared value", () => {
        expect(new Box().size).toEqual(new Point(100, 100));
    });

    it("routes writes through @auto's preprocessValue", () => {
        const box = new Box();
        box.size = new Point(5, 5);
        expect(box.size).toEqual(new Point(25, 25));
        box.size = new Point(60, 5);
        expect(box.size).toEqual(new Point(60, 25));
    });

    it("works the same way on a field", () => {
        class FieldBox {
            @signal @auto({preprocessValue: clamp}) size: Point = new Point(100, 100);
        }
        const box = new FieldBox();
        expect(box.size).toEqual(new Point(100, 100));
        box.size = new Point(5, 5);
        expect(box.size).toEqual(new Point(25, 25));
    });

    it("is still reactive, and reports the preprocessed value to effects", async () => {
        const seen: Point[] = [];

        class Watched {
            @signal @auto({preprocessValue: clamp}) accessor size: Point = new Point(100, 100);

            @effect private track() {
                seen.push(this.size);
            }
        }

        const box = new Watched();
        initializeEffects(box);
        await tick();
        expect(seen).toEqual([new Point(100, 100)]);

        box.size = new Point(5, 5);
        await tick();
        //The effect sees the clamped value, not the (5, 5) that was assigned.
        expect(seen).toEqual([new Point(100, 100), new Point(25, 25)]);
    });

    it("fires callAfter on write", () => {
        const after = vi.fn();

        class Box {
            @signal @auto({preprocessValue: clamp, callAfter: after}) accessor size: Point = new Point(100, 100);
        }

        new Box().size = new Point(5, 5);
        expect(after).toHaveBeenCalledTimes(1);
        expect(after.mock.calls[0][0]).toEqual(new Point(25, 25));
    });
});

describe("@signal on its own is unchanged", () => {
    it("accessor", () => {
        class Box {
            @signal accessor count: number = 3;
        }
        const box = new Box();
        expect(box.count).toBe(3);
        box.count = 9;
        expect(box.count).toBe(9);
    });

    it("field", () => {
        class Box {
            @signal count: number = 3;
        }
        const box = new Box();
        expect(box.count).toBe(3);
        box.count = 9;
        expect(box.count).toBe(9);
    });

    it("getter and setter pair", () => {
        class Box {
            private stored: number = 3;
            @signal get count(): number {return this.stored;}
            set count(value: number) {this.stored = value * 2;}
        }
        const box = new Box();
        expect(box.count).toBe(3);
        box.count = 9;
        expect(box.count).toBe(18);
    });
});
