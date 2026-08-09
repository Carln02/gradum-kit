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
