import {describe, it, expect} from "vitest";
import {gradum, Point, Shown} from "../../../../../../build/gradum-kit.esm";
import {SelectionBox} from "../selectionBox";
import {Square} from "../../../square/square";

const tick = () => new Promise(resolve => setTimeout(resolve, 0));

describe("the selection box actually shows", () => {
    it("leaves display: none once it has a target", async () => {
        const box = SelectionBox.create({parent: document.body}) as SelectionBox;
        const square = Square.create({position: new Point(400, 300)}) as Square;

        //A reifect that was never attached applies to nothing, and the box stays hidden however correctly
        //the target is set — silent, and indistinguishable from the selection not happening.
        box.target = square as any;
        await tick();

        expect(gradum(box).showTransition.stateOf(box)).toBe(Shown.visible);
    });

    it("hides again when cleared", async () => {
        const box = SelectionBox.create({parent: document.body}) as SelectionBox;
        box.target = Square.create({position: new Point(400, 300)}) as any;
        await tick();

        box.clear();
        await tick();
        expect(gradum(box).showTransition.stateOf(box)).toBe(Shown.hidden);
    });
});

describe("selecting a target that is not a Node", () => {
    it("does not throw when the tool checks the selection chrome", () => {
        const box = SelectionBox.create({parent: document.body}) as SelectionBox;
        const square = Square.create({position: new Point(400, 300)}) as Square;

        //Node.contains rejects anything that is not a Node by throwing, so the select tool has to test that
        //before asking. A square painted into a canvas is never a Node.
        expect(square).not.toBeInstanceOf(Node);
        expect(() => (box as any).contains(square)).toThrow();
        expect(square instanceof Node && box.contains(square as any)).toBe(false);
    });

    it("still recognises its own grips, which are Nodes", () => {
        const box = SelectionBox.create({parent: document.body}) as SelectionBox;
        for (const handle of [...box.resizeHandles, ...box.rotateHandles]) {
            expect(handle).toBeInstanceOf(Node);
            expect(box.contains(handle)).toBe(true);
        }
    });
});