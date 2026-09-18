import {describe, it, expect} from "vitest";
import {Anchor} from "../../../../../../build/gradum-kit.esm";
import {RotateHandle} from "../rotateHandle";

const settle = () => new Promise(resolve => setTimeout(resolve, 50));

//Each zone has to sit wholly outside its own corner. Placement is `left`/`top` on the corner plus a shift
//of the zone's own size on whichever sides face into the box — expressed in percentages of itself, so
//nothing here depends on how big the zone is drawn.
const expected: Record<string, {left: string, top: string, translate: string}> = {
    [Anchor.TopLeft]: {left: "0%", top: "0%", translate: "translate(-100%, -100%)"},
    [Anchor.TopRight]: {left: "100%", top: "0%", translate: "translate(0%, -100%)"},
    [Anchor.BottomLeft]: {left: "0%", top: "100%", translate: "translate(-100%, 0%)"},
    [Anchor.BottomRight]: {left: "100%", top: "100%", translate: "translate(0%, 0%)"},
};

describe("the rotation zones sit outside their corners", () => {
    it("offsets each one away from the box", async () => {
        const handles = Object.keys(expected).map(anchor => RotateHandle.create({anchor}));
        //setStyles batches onto an animation frame.
        await settle();

        handles.forEach((handle, index) => {
            const anchor = Object.keys(expected)[index];
            expect(handle.style.left, anchor).toBe(expected[anchor].left);
            expect(handle.style.top, anchor).toBe(expected[anchor].top);
            expect(handle.style.transform, anchor).toBe(expected[anchor].translate);
        });
    });

    it("shifts on exactly the sides that face into the box", async () => {
        //The regression this guards: a dropped offset leaves a zone at its corner extending inwards, which
        //reads as the grip being "inside the shape" for three of the four corners.
        const bottomLeft = RotateHandle.create({anchor: Anchor.BottomLeft});
        const bottomRight = RotateHandle.create({anchor: Anchor.BottomRight});
        await settle();

        //Bottom-left is at the left edge, so it has to move left by its whole width; bottom-right is already
        //past both edges and moves nowhere.
        expect(bottomLeft.style.transform).toContain("-100%");
        expect(bottomRight.style.transform).toBe("translate(0%, 0%)");
    });
});
