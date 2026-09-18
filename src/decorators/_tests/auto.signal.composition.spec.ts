import {describe, it, expect, vi} from "vitest";
import {effect, initializeEffects, modelSignal, signal} from "../reactivity/reactivity";
import {GradumModel} from "../../mvc/model/model";
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

describe("@modelSignal stacked on @auto", () => {
    //A model signal keeps its value in the model's data rather than on the instance, so a decorator applied
    //closer to the declaration has to be composed with rather than stepped over: the value the model is
    //handed must be the one that came back out of it, or the clamp reads as enforced and is not.
    const cap10 = (value: number) => Math.min(value, 10);

    it("routes writes through @auto's preprocessValue", () => {
        class ProbeModel extends GradumModel {
            @modelSignal() @auto({preprocessValue: cap10}) public capped: number;
        }

        const model = new ProbeModel({data: {}});
        model.capped = 99;

        expect(model.capped).toBe(10);
    });

    it("stores the processed value in the model's data, not the raw one", () => {
        class ProbeModel extends GradumModel {
            @modelSignal() @auto({preprocessValue: cap10}) public capped: number;
        }

        const model = new ProbeModel({data: {}});
        model.capped = 99;

        //What makes the difference visible: reads come from the data, so a raw value landing there is the
        //whole bug — the property would report 99 however the preprocessor was written.
        expect(model.get("capped")).toBe(10);
    });

    it("preprocesses on the way to a nested key path", () => {
        class ProbeModel extends GradumModel {
            @modelSignal("bounds", "width") @auto({preprocessValue: cap10}) public width: number;
        }

        const model = new ProbeModel({data: {bounds: {}}});
        model.width = 40;

        expect(model.width).toBe(10);
        expect(model.get("bounds", "width")).toBe(10);
    });

    it("runs @auto's callBefore with the value being written", () => {
        const seen: number[] = [];

        class ProbeModel extends GradumModel {
            @modelSignal() @auto({callBefore: (value: number) => {seen.push(value)}}) public tracked: number;
        }

        const model = new ProbeModel({data: {}});
        model.tracked = 4;
        model.tracked = 7;

        expect(seen).toEqual([4, 7]);
        expect(model.tracked).toBe(7);
    });

    it("falls back to @auto's defaultValue when the data holds nothing", () => {
        class ProbeModel extends GradumModel {
            @modelSignal() @auto({defaultValue: 3}) public sized: number;
        }

        expect(new ProbeModel({data: {}}).sized).toBe(3);
    });

    it("leaves a plain @modelSignal untouched", () => {
        class ProbeModel extends GradumModel {
            @modelSignal() public plain: number;
        }

        const model = new ProbeModel({data: {}});
        model.plain = 99;

        expect(model.plain).toBe(99);
        expect(model.get("plain")).toBe(99);
    });

    it("keeps effects firing on a preprocessed write", async () => {
        class ProbeModel extends GradumModel {
            @modelSignal() @auto({preprocessValue: cap10}) public capped: number;

            public seen: number[] = [];

            @effect public watch() {this.seen.push(this.capped)}
        }

        const model = new ProbeModel({data: {}});
        initializeEffects(model);
        model.capped = 99;
        await tick();

        expect(model.seen.at(-1)).toBe(10);
    });
});

describe("@auto accepts a falsy default", () => {
    //`0`, `""` and `false` are all perfectly good values for a member to fall back to. They used to be
    //tested for truthiness rather than for having been given, so declaring any of them got you nothing.
    it("falls back to a zero default", () => {
        class Box {
            @auto({defaultValue: 0}) accessor count: number;
        }
        expect(new Box().count).toBe(0);
    });

    it("falls back to an empty-string default", () => {
        class Box {
            @auto({defaultValue: ""}) accessor label: string;
        }
        expect(new Box().label).toBe("");
    });

    it("falls back to a false default", () => {
        class Box {
            @auto({defaultValue: false}) accessor flag: boolean;
        }
        expect(new Box().flag).toBe(false);
    });

    it("takes a zero as an initial value", () => {
        class Box {
            @auto({initialValue: 0}) accessor count: number;
        }
        expect(new Box().count).toBe(0);
    });

    it("reaches a zero default through a model signal", () => {
        class ProbeModel extends GradumModel {
            @modelSignal() @auto({defaultValue: 0}) public price: number;
        }
        expect(new ProbeModel({data: {}}).price).toBe(0);
    });
});

