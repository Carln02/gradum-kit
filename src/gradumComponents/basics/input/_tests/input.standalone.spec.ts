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
