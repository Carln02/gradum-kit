import {describe, it, expect, vi, beforeEach, afterEach} from "vitest";
import {GradumPopup} from "../popup";
import {div} from "../../../../elementCreation/basicElements";

const anchorAt = (left: number, top: number, width = 100, height = 40) => {
    const anchor = div({parent: document.body});
    anchor.getBoundingClientRect = () => ({left, top, right: left + width, bottom: top + height,
        width, height, x: left, y: top, toJSON: () => ({})}) as DOMRect;
    return anchor;
};

const sized = (popup: GradumPopup, width = 80, height = 30) => {
    popup.getBoundingClientRect = () => ({left: 0, top: 0, right: width, bottom: height,
        width, height, x: 0, y: 0, toJSON: () => ({})}) as DOMRect;
    return popup;
};

//Placing a popup was `recomputePosition`, which was private *and* an `@effect`, and whose style writes
//were queued for an animation frame. A tab in the background is given no frames, so a popup opened there
//was shown without ever being positioned — silently, and looking like it never opened.
describe("a popup can be placed without waiting for a frame", () => {
    const frames: FrameRequestCallback[] = [];
    let raf: ReturnType<typeof vi.spyOn>;
    let styles: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        frames.length = 0;
        //A backgrounded tab: frames are requested and never run.
        raf = vi.spyOn(window, "requestAnimationFrame").mockImplementation(cb => frames.push(cb));
        //jsdom reports no margins at all, and the popup adds them to its placement — `parseFloat("")` is
        //NaN, which would make every computed offset NaN and every style write be rejected.
        styles = vi.spyOn(window, "getComputedStyle").mockReturnValue(
            {marginLeft: "0px", marginRight: "0px", marginTop: "0px", marginBottom: "0px"} as CSSStyleDeclaration);
    });
    afterEach(() => {raf.mockRestore(); styles.mockRestore();});

    it("exposes the placement, so it need not be reached through show()", () => {
        expect(typeof GradumPopup.create().recomputePosition).toBe("function");
    });

    it("has placed the popup by the time the call returns", () => {
        const popup = sized(GradumPopup.create({anchor: anchorAt(300, 200)}));

        popup.recomputePosition();

        expect(popup.style.left).not.toBe("");
        expect(popup.style.top).not.toBe("");
    });

    it("places it when shown, with no frame ever coming", () => {
        const popup = sized(GradumPopup.create({anchor: anchorAt(300, 200)}));

        popup.show(true);

        expect(frames.length).toBeGreaterThan(0);   //frames were asked for and will never run
        expect(popup.style.left).not.toBe("");
        expect(popup.style.top).not.toBe("");
    });

    it("places it under its anchor, where the defaults say", () => {
        const popup = sized(GradumPopup.create({anchor: anchorAt(300, 200, 100, 40)}), 80, 30);

        popup.recomputePosition();

        //The defaults pin the popup's top-left to the anchor's bottom-left, 4px below it.
        expect(Math.round(parseFloat(popup.style.left))).toBe(300);
        expect(Math.round(parseFloat(popup.style.top))).toBe(244);
    });

    it("follows the anchor when it moves, without a frame in between", () => {
        const popup = sized(GradumPopup.create({anchor: anchorAt(300, 200)}));
        popup.recomputePosition();
        const first = popup.style.top;

        popup.anchor = anchorAt(300, 500);
        popup.recomputePosition();

        //Measured fresh: the rects cache for one pass and clear on a frame, which never comes here.
        expect(popup.style.top).not.toBe(first);
        expect(Math.round(parseFloat(popup.style.top))).toBe(544);
    });

    it("constrains itself to the viewport in the same pass", () => {
        const popup = sized(GradumPopup.create({anchor: anchorAt(300, 200)}));

        popup.recomputePosition();

        expect(popup.style.maxWidth).not.toBe("");
        expect(popup.style.maxHeight).not.toBe("");
    });
});
