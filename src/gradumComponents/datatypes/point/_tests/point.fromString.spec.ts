import {describe, it, expect} from "vitest";
import {Point} from "../point";

describe("Point.from / Point.fromString", () => {
    it("round-trips through toString", () => {
        const p = new Point(3, -7);
        const parsed = Point.from(p.toString());

        expect(parsed).toBeInstanceOf(Point);
        expect(parsed.x).toBe(3);
        expect(parsed.y).toBe(-7);
    });

    it("parses as a static, without needing an instance", () => {
        const parsed = Point.from('{"x":1,"y":2}');
        expect(parsed.x).toBe(1);
        expect(parsed.y).toBe(2);
    });

    it("returns undefined on input that is not a valid point", () => {
        expect(Point.from("not json")).toBeUndefined();
        expect(Point.from("{}")).toBeUndefined();
        expect(Point.from('{"x":1}')).toBeUndefined();
        expect(Point.from('{"x":"1","y":"2"}')).toBeUndefined();
        expect(Point.from("")).toBeUndefined();
    });

    // GradumInput discovers a value's parser via `"fromString" in current`, which only
    // sees instance members — so the instance method must stay for that protocol to work.
    it("keeps the instance method GradumInput duck-types against", () => {
        const p = new Point(0, 0);

        expect("fromString" in p).toBe(true);
        expect(typeof p.fromString).toBe("function");

        const parsed = p.fromString('{"x":5,"y":6}');
        expect(parsed).toBeInstanceOf(Point);
        expect(parsed.x).toBe(5);
        expect(parsed.y).toBe(6);
    });

    it("the instance method does not read from the instance it is called on", () => {
        const parsed = new Point(99, 99).fromString('{"x":1,"y":2}');
        expect(parsed.x).toBe(1);
        expect(parsed.y).toBe(2);
    });
});

describe("Point.from reads any coordinate-ish value", () => {
    it("takes a number for both axes", () => {
        expect(Point.from(50)).toEqual(new Point(50, 50));
        expect(Point.from(0)).toEqual(new Point(0, 0));
    });

    it("takes an x/y pair, an array, and an event", () => {
        expect(Point.from({x: 1, y: 2})).toEqual(new Point(1, 2));
        expect(Point.from([3, 4])).toEqual(new Point(3, 4));
        expect(Point.from({clientX: 5, clientY: 6})).toEqual(new Point(5, 6));
    });

    it("hands a point straight back, rather than copying it", () => {
        const point = new Point(7, 8);
        expect(Point.from(point)).toBe(point);
    });

    it("gives nothing back where the constructor would build NaNs", () => {
        //These are the cases worth checking: `new Point` accepts them and produces unusable coordinates.
        expect(Point.from({width: 10, height: 20} as any)).toBeUndefined();
        expect(Point.from({x: 1} as any)).toBeUndefined();
        expect(Point.from({x: "1", y: "2"} as any)).toBeUndefined();
        expect(Point.from([1] as any)).toBeUndefined();
        expect(Point.from(undefined)).toBeUndefined();
        expect(Point.from(null as any)).toBeUndefined();
    });

    it("still parses the strings it always did", () => {
        expect(Point.from(new Point(9, 10).toString())).toEqual(new Point(9, 10));
        expect(Point.from("not json")).toBeUndefined();
    });
});
