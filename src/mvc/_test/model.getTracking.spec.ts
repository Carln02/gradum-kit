import {describe, it, expect} from "vitest";
import {GradumModel} from "../model/model";
import {effect} from "../../decorators/reactivity/reactivity";

const tick = () => new Promise(r => setTimeout(r, 20));

/**
 * `get()` is an untracked read until a signal exists for the key. When one does, the read registers a
 * dependency so the surrounding `@effect` re-runs. For a key path only the *last* key is tracked — reading
 * `get("x","y","z")` depends on `z`, not on the intermediate `x`/`y`.
 */
describe("GradumModel.get: signal tracking", () => {
    it("does not track a key with no signal", async () => {
        const m = GradumModel.create({data: {a: 1}, initialize: true});
        let runs = 0;
        effect(() => { runs++; m.get("a"); });
        const before = runs;

        m.set(2, "a");
        await tick();
        expect(runs).toBe(before);
    });

    it("tracks a key once it has a signal", async () => {
        const m = GradumModel.create({data: {a: 1}, initialize: true});
        m.makeSignal("a");
        let runs = 0, seen: unknown;
        effect(() => { runs++; seen = m.get("a"); });
        const before = runs;

        m.set(2, "a");
        await tick();
        expect(runs).toBeGreaterThan(before);
        expect(seen).toBe(2);
    });

    it("tracks the last key of a path, not the first", async () => {
        const m = GradumModel.create({data: {x: {y: {z: 1}}}, initialize: true});
        m.makeSignals("x", "y", "z");

        let runs = 0, seen: unknown;
        effect(() => { runs++; seen = m.get("x", "y", "z"); });
        const before = runs;

        m.nest("x", "y").set(2, "z");
        await tick();
        expect(runs).toBeGreaterThan(before);
        expect(seen).toBe(2);
    });

    it("re-runs when replacing an ancestor changes the tracked value", async () => {
        const m = GradumModel.create({data: {x: {y: {z: 1}}}, initialize: true});
        m.makeSignals("x", "y", "z");

        let runs = 0, seen: unknown;
        effect(() => { runs++; seen = m.get("x", "y", "z"); });
        const before = runs;

        m.set({y: {z: 99}}, "x");
        await tick();
        expect(runs).toBeGreaterThan(before);
        expect(seen).toBe(99);
    });

    it("does not re-run when an ancestor is replaced but the value is unchanged", async () => {
        const m = GradumModel.create({data: {x: {y: {z: 7}}}, initialize: true});
        m.makeSignals("x", "y", "z");

        let runs = 0;
        effect(() => { runs++; m.get("x", "y", "z"); });
        const before = runs;

        m.set({y: {z: 7}}, "x");
        await tick();
        expect(runs).toBe(before);
    });

    it("does not re-run for an unrelated sibling key", async () => {
        const m = GradumModel.create({data: {x: {y: {z: 1}}, other: 0}, initialize: true});
        m.makeSignals("x", "y", "z");

        let runs = 0;
        effect(() => { runs++; m.get("x", "y", "z"); });
        const before = runs;

        m.set(42, "other");
        await tick();
        expect(runs).toBe(before);
    });

    it("a read never creates nested models", () => {
        const m = GradumModel.create({data: {a: {b: 1}}, initialize: true});
        const before = (m as any).nestedModels.size;

        m.get("a", "b");

        expect((m as any).nestedModels.size).toBe(before);
    });
});
