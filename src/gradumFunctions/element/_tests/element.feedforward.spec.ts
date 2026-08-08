import {describe, it, expect} from "vitest";
import {gradum} from "../../gradumFunctions";
import {GradumMovable} from "../../../gradumComponents/wrappers/movable/movable";
import {Point} from "../../../gradumComponents/datatypes/point/point";

async function flushEffects() {
    // Effects are queueMicrotask-scheduled.
    await Promise.resolve();
    await new Promise(resolve => setTimeout(resolve, 0));
}

describe("GradumSelector.feedforward — positioning wrapper (wrap: true)", () => {
    function makeOrigin(): HTMLElement {
        const el = document.createElement("div");
        el.style.transform = "translate(100px, 100px)";
        document.body.appendChild(el);
        return el;
    }

    function makeWrapper(origin: HTMLElement): GradumMovable {
        const wrapper = gradum(origin).feedforward({wrap: true, removeOnPointerRelease: false}) as unknown as GradumMovable;
        document.body.appendChild(wrapper as unknown as Node);
        return wrapper;
    }

    it("returns a GradumMovable containing the clone", () => {
        const wrapper = makeWrapper(makeOrigin());

        expect(wrapper).toBeInstanceOf(GradumMovable);
        expect(wrapper.classList.contains("gradum-feedforward-wrapper")).toBe(true);
        expect(wrapper.children.length).toBe(1);
        expect(wrapper.firstElementChild.classList.contains("gradum-feedforward-clone")).toBe(true);
    });

    it("exposes the clone via feedforwardClone and content", () => {
        const wrapper = makeWrapper(makeOrigin()) as any;
        expect(wrapper.feedforwardClone).toBe(wrapper.firstElementChild);
        expect(wrapper.content).toBe(wrapper.firstElementChild);
    });

    it("position setter applies a CSS translate on the wrapper, not the clone", async () => {
        const wrapper = makeWrapper(makeOrigin());

        wrapper.position = {x: 40, y: -12};
        await flushEffects();
        expect(wrapper.style.transform).toContain("calc(40px)");
        expect(wrapper.style.transform).toContain("calc(-12px)");
        expect(wrapper.position.x).toBe(40);
        expect(wrapper.position.y).toBe(-12);
        expect((wrapper.firstElementChild as HTMLElement).style.transform).toBe("translate(100px, 100px)");
    });

    it("rotation setter applies a CSS rotate on the wrapper", async () => {
        const wrapper = makeWrapper(makeOrigin());

        wrapper.rotation = Math.PI / 2;
        await flushEffects();
        expect(wrapper.style.transform).toContain(`rotate(${Math.PI / 2}rad)`);
        expect(wrapper.rotation).toBe(Math.PI / 2);
    });

    it("translation is an alias of position", () => {
        const wrapper = makeWrapper(makeOrigin());

        wrapper.translation = new Point(7, 8);
        expect(wrapper.position.x).toBe(7);
        expect(wrapper.position.y).toBe(8);
    });

    it("translateBy adds to the current translation", () => {
        const wrapper = makeWrapper(makeOrigin());
        wrapper.position = {x: 10, y: 10};
        wrapper.translateBy(new Point(5, -3));
        expect(wrapper.translation.x).toBe(15);
        expect(wrapper.translation.y).toBe(7);
    });

    it("injects the transform-neutralizing stylesheet exactly once", () => {
        makeWrapper(makeOrigin());
        makeWrapper(makeOrigin());

        const sheets = document.querySelectorAll("#gradum-feedforward-styles");
        expect(sheets.length).toBe(1);
        expect(sheets[0].textContent).toContain("transform: none !important");
    });

    it("repeated feedforward() calls reuse the same wrapper", () => {
        const origin = makeOrigin();
        const first = gradum(origin).feedforward({wrap: true, removeOnPointerRelease: false});
        const second = gradum(origin).feedforward({wrap: true, removeOnPointerRelease: false});
        expect(second).toBe(first);
    });

    it("without wrap, the clone itself is returned (no wrapper)", () => {
        const origin = makeOrigin();
        const clone = gradum(origin).feedforward({removeOnPointerRelease: false, type: "unwrapped"}) as any;
        expect(clone).not.toBeInstanceOf(GradumMovable);
        expect(clone.feedforwardClone).toBeUndefined();
    });
});
