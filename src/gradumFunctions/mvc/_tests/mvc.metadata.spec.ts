import {describe, it, expect} from "vitest";
import {gradum} from "../../gradumFunctions";
import {div} from "../../../elementCreation/basicElements";
import {GradumModel} from "../../../mvc/model/model";
import {effect} from "../../../decorators/reactivity/reactivity";

const tick = () => new Promise(r => setTimeout(r, 20));

/**
 * `metadata` used to be `model.meta`, so it was `undefined` on any element without a model. It is now an
 * MVC field of its own, created on first read.
 */
describe("GradumSelector.metadata", () => {
    it("exists on an element with no model", () => {
        const el = div();
        expect(gradum(el).metadata).toBeInstanceOf(GradumModel);
    });

    it("round-trips values", () => {
        const el = div();
        gradum(el).metadata.set(true, "selectable");
        expect(gradum(el).metadata.get("selectable")).toBe(true);
    });

    it("returns the same instance on every read", () => {
        const el = div();
        expect(gradum(el).metadata).toBe(gradum(el).metadata);
    });

    it("is per element, never shared", () => {
        const a = div(), b = div();
        gradum(a).metadata.set(1, "n");
        expect(gradum(a).metadata.get("n")).toBe(1);
        expect(gradum(b).metadata.get("n")).toBeUndefined();
    });

    it("is unaffected by attaching a model afterwards", () => {
        const el = div();
        gradum(el).metadata.set("kept", "k");
        gradum(el).setMvc({model: GradumModel} as any);
        expect(gradum(el).metadata.get("k")).toBe("kept");
    });

    it("can be assigned from a plain object", () => {
        const el = div();
        gradum(el).metadata = {a: 1, b: 2} as any;
        expect(gradum(el).metadata.get("a")).toBe(1);
        expect(gradum(el).metadata.get("b")).toBe(2);
    });

    it("can be assigned an existing model", () => {
        const el = div();
        const m = GradumModel.create({data: {shared: true}, initialize: true});
        gradum(el).metadata = m as any;
        expect(gradum(el).metadata).toBe(m);
    });

    // Reactivity: reads only track through a signal, so `makeSignal` is required for @effect to re-run.
    it("drives an effect when read through makeSignal", async () => {
        const el = div();
        const box = gradum(el).metadata.makeSignal<boolean>("isSpacer");

        let runs = 0, seen: unknown;
        effect(() => { runs++; seen = box.value; });
        const before = runs;

        gradum(el).metadata.set(true, "isSpacer");
        await tick();

        expect(runs).toBeGreaterThan(before);
        expect(seen).toBe(true);
    });

    it("does not drive an effect through a plain get()", async () => {
        const el = div();
        let runs = 0;
        effect(() => { runs++; gradum(el).metadata.get("x"); });
        const before = runs;

        gradum(el).metadata.set(1, "x");
        await tick();

        expect(runs).toBe(before);
    });
});
