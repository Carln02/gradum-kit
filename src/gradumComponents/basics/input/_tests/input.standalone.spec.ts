import {describe, it, expect} from "vitest";
import {GradumInput} from "../input";
import {GradumNumericalInput} from "../numericalInput/numericalInput";

//An input built on its own — no model, no view, no emitter — is the ordinary way to put a field on a card
//or in a panel. Assigning to it used to throw, because the value setter announced the change to an emitter
//that was never there, which left `value` unusable on every input created this way.
describe("an input created on its own accepts a value", () => {
    it("takes a value assigned after creation", () => {
        const input = GradumInput.create({parent: document.body});
        input.value = "Ada";
        expect(input.value).toBe("Ada");
    });

    it("takes a value given at creation", () => {
        const input = GradumInput.create({parent: document.body, value: "Ada"});
        expect(input.value).toBe("Ada");
    });

    it("takes a number, and reads it back as one", () => {
        const input = GradumInput.create({parent: document.body, input: {type: "number"}});
        input.value = 7;
        expect(input.value).toBe(7);
    });

    it("reports an empty field as undefined rather than throwing", () => {
        const input = GradumInput.create({parent: document.body, input: {type: "number"}});
        input.value = "";
        expect(input.value).toBeUndefined();
    });

    //GradumNumericalInput overrides GradumInput's `@signal` value accessor and reaches it through `super`,
    //which used to recurse until the stack ran out — so the subclass could not be assigned to at all.
    it("takes a number on a numerical input", () => {
        const input: GradumNumericalInput = GradumNumericalInput.create({parent: document.body});
        input.value = 7;
        expect(input.value).toBe(7);
    });

    it("clamps and rounds a numerical input", () => {
        const input: GradumNumericalInput = GradumNumericalInput.create({parent: document.body, min: 0, decimalPlaces: 2});

        input.value = -5;
        expect(input.value).toBe(0);

        input.value = 1.239;
        expect(input.value).toBe(1.24);
    });

    it("applies a numerical input's multiplier both ways", () => {
        const input: GradumNumericalInput = GradumNumericalInput.create({parent: document.body});
        input.multiplier = 100;

        input.value = 0.5;
        expect(input.rawValue).toBe("50");
        expect(input.value).toBe(0.5);
    });
});

//Reading `.value` used to call the getter from inside itself, looking for the current value to learn which
//type to parse the text back into. Every read of non-numeric text overflowed the stack, and the
//`fromString` branch it was reaching for never ran: the error was swallowed by the `catch` around it.
describe("an input parses its text back into the type it was given", () => {
    class Pair {
        constructor(public x: number = 0, public y: number = 0) {}
        public toString() {return `${this.x},${this.y}`;}
        public fromString(value: string) {
            const [x, y] = value.split(",").map(Number);
            return new Pair(x, y);
        }
    }

    it("reads text back as the type that was assigned", () => {
        const input = GradumInput.create<any, "input", Pair>({parent: document.body});
        input.value = new Pair(1, 2);
        expect(input.rawValue).toBe("1,2");

        input.rawValue = "3,4";
        const read = input.value;

        expect(read).toBeInstanceOf(Pair);
        expect([read.x, read.y]).toEqual([3, 4]);
    });

    it("reads the element once, rather than calling itself until the stack gives out", () => {
        const input = GradumInput.create({parent: document.body});
        input.value = "Ada";

        //Counted through `rawValue`, which the getter reads once per turn: the recursion used to run it
        //thousands of times per read before the stack gave out and the error was swallowed.
        let reads = 0;
        let owner = Object.getPrototypeOf(input);
        while (owner && !Object.getOwnPropertyDescriptor(owner, "rawValue")) owner = Object.getPrototypeOf(owner);
        const read = Object.getOwnPropertyDescriptor(owner, "rawValue").get;
        Object.defineProperty(input, "rawValue", {
            configurable: true,
            get(this: any) {reads++; return read.call(this);}
        });

        expect(input.value).toBe("Ada");
        expect(reads).toBe(1);
    });

    it("keeps up with the type when written silently", () => {
        const input = GradumInput.create<any, "input", Pair>({parent: document.body});
        input.value = new Pair(1, 2);
        input.setValueSilently(new Pair(9, 9));

        input.rawValue = "5,6";

        expect(input.value).toBeInstanceOf(Pair);
    });

    it("lets a throwing fromString surface rather than swallowing it", () => {
        const input = GradumInput.create<any, "input", any>({parent: document.body});
        input.value = {toString: () => "x", fromString: () => {throw new Error("no");}};

        expect(() => input.value).toThrow("no");
    });

    it("reads a number as a number, and text that merely starts with one as text", () => {
        const input = GradumInput.create<any, "input", any>({parent: document.body});

        input.rawValue = "3";
        expect(input.value).toBe(3);

        input.rawValue = "-2.5";
        expect(input.value).toBe(-2.5);

        //`parseFloat` read this as 3, so any description starting with a digit became a number.
        input.rawValue = "3 clips";
        expect(input.value).toBe("3 clips");
    });

    it("still reads JSON and plain text", () => {
        const input = GradumInput.create<any, "input", any>({parent: document.body});

        input.rawValue = `{"a":1}`;
        expect(input.value).toEqual({a: 1});

        input.rawValue = "hello";
        expect(input.value).toBe("hello");
    });
});
