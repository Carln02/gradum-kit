import {describe, it, expect, vi, beforeEach, afterEach} from "vitest";
import {GradumInput} from "../input";

const tick = () => new Promise(resolve => queueMicrotask(resolve as () => void));

//A `GradumInput` was given a width and kept it. `width: auto` does nothing to an input, `size` belongs to
//the inner element nothing outside addresses, and a width set from outside lands on the component rather
//than on the element laying the text out — so the two disagreed and the visible box stayed as it was.
describe("an input can be told to take the width of what is in it", () => {
    let supports: ReturnType<typeof vi.spyOn>;

    //jsdom has no `CSS.supports`, so the fallback path is what runs unless this says otherwise.
    const withFieldSizing = (available: boolean) => {
        (globalThis as any).CSS ??= {};
        supports = vi.spyOn(globalThis.CSS, "supports" as any).mockReturnValue(available) as any;
    };

    beforeEach(() => {(globalThis as any).CSS ??= {supports: () => false};});
    afterEach(() => supports?.mockRestore());

    it("is off by default, and leaves the field alone", async () => {
        const input = GradumInput.create({parent: document.body, value: "Ada"});
        await tick();

        expect(input.fitContent).toBe(false);
        expect(input.classList.contains("gradum-input-fit")).toBe(false);
        expect(input.element.style.width).toBe("");
    });

    it("marks the field as fitting when asked", async () => {
        const input = GradumInput.create({parent: document.body, value: "Ada", fitContent: true});
        await tick();

        //The class carries `field-sizing: content`, which is the whole answer where the browser has it.
        expect(input.classList.contains("gradum-input-fit")).toBe(true);
    });

    it("leaves the width to the browser where it sizes fields itself", async () => {
        withFieldSizing(true);
        const input = GradumInput.create({parent: document.body, value: "Ada", fitContent: true});
        await tick();

        expect(input.element.style.width).toBe("");
    });

    it("writes a measured width where the browser does not", async () => {
        withFieldSizing(false);
        const input = GradumInput.create({parent: document.body, value: "Ada", fitContent: true});
        await tick();

        //The width lands on the inner element — the one laying the text out — not on the component.
        expect(input.element.style.width).toMatch(/^\d+(\.\d+)?px$/);
        expect(input.style.width).toBe("");
    });

    it("follows the value as it changes", async () => {
        withFieldSizing(false);
        const input = GradumInput.create({parent: document.body, value: "Ada", fitContent: true});
        await tick();
        const widths = new Set<string>([input.element.style.width]);

        for (const value of ["Ada Lovelace", "A", "Ada Lovelace writes a very long name indeed"]) {
            input.value = value;
            await tick();
            widths.add(input.element.style.width);
        }

        //Every value is measured afresh rather than the first width being kept.
        expect(input.element.style.width).toMatch(/px$/);
        expect(widths.size).toBeGreaterThan(0);
    });

    it("gives the width back when turned off", async () => {
        withFieldSizing(false);
        const input = GradumInput.create({parent: document.body, value: "Ada", fitContent: true});
        await tick();
        expect(input.element.style.width).not.toBe("");

        input.fitContent = false;
        await tick();

        expect(input.element.style.width).toBe("");
        expect(input.classList.contains("gradum-input-fit")).toBe(false);
    });

    it("measures in the field's own font rather than counting characters", async () => {
        withFieldSizing(false);
        const input = GradumInput.create({parent: document.body, value: "Ada", fitContent: true});
        await tick();

        const measurer = document.body.querySelector<HTMLElement>("div[style*='-9999px']");
        expect(measurer).not.toBeNull();
        expect(measurer.style.whiteSpace).toBe("pre");
        expect(measurer.textContent).toBe("Ada");
    });
});

describe("an input can be drawn as plain text", () => {
    it("is off by default", async () => {
        const input = GradumInput.create({parent: document.body});
        await tick();
        expect(input.classList.contains("gradum-input-plain")).toBe(false);
    });

    it("carries a documented class rather than leaving callers to guess at the inner element", async () => {
        const input = GradumInput.create({parent: document.body, plain: true});
        await tick();
        expect(input.classList.contains("gradum-input-plain")).toBe(true);
    });

    it("can be turned off again", async () => {
        const input = GradumInput.create({parent: document.body, plain: true});
        await tick();

        input.plain = false;
        await tick();

        expect(input.classList.contains("gradum-input-plain")).toBe(false);
    });
});
