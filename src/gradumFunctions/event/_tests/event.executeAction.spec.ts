import {describe, it, expect, vi, beforeEach} from "vitest";
import {div} from "../../../elementCreation/basicElements";
import {gradum} from "../../gradumFunctions";
import {Propagation} from "../event.types";

describe("executeAction order + semantics", () => {
    beforeEach(() => gradum().clearToolBehaviors());

    it("1) custom (tool,event) wins", () => {
        const node = div({id: "obj"});
        const hit = vi.fn();

        gradum(node).onTool("click", "brush", hit);

        const consumed = gradum(node).executeAction("click", "brush", new Event("x"));
        expect(consumed).toBe(Propagation.stopPropagation);
        expect(hit).toHaveBeenCalledTimes(1);
    });

    it("2) tool defaults run on object when no custom", () => {
        const node2 = div({id: "obj2"});
        const def = vi.fn().mockReturnValue(Propagation.stopPropagation);

        gradum(node2).addToolBehavior("click", (ev, target) => def(ev, target), "brush");
        const consumed = gradum(node2).executeAction("click", "brush", new Event("click"));

        expect(consumed).toBe(Propagation.stopPropagation);
        expect(def).toHaveBeenCalledTimes(1);
        expect(def.mock.calls[0][1]).toBe(node2);
    });

    it("3) embedded: custom on embedded for ANY of the object tools", () => {
        const embeddedTool = div({id: "obj3"});
        const target = div({id: "emb3"});

        gradum(embeddedTool).makeTool("eraser");
        gradum(embeddedTool).embedTool(target);

        const embeddedEraserListener = vi.fn().mockReturnValue(Propagation.stopPropagation);
        gradum(target).onTool("click", "eraser", embeddedEraserListener);
        const consumed = gradum(embeddedTool).executeAction("click", "brush", new Event("x"));

        expect(consumed).toBe(Propagation.stopPropagation);
        expect(embeddedEraserListener).toHaveBeenCalledTimes(1);
    });

    it("4) embedded: object defaults run on embedded if no custom", () => {
        const embeddedTool = div({id: "obj4"});
        const target = div({id: "emb4"});

        gradum(embeddedTool).makeTool("eraser");
        gradum(embeddedTool).embedTool(target);

        const def = vi.fn().mockReturnValue(Propagation.stopPropagation);
        gradum(embeddedTool).addToolBehavior("click", (ev, target) => def(ev, target), "eraser");
        const consumed = gradum(embeddedTool).executeAction("click", "brush", new Event("x"));

        expect(consumed).toBe(Propagation.stopPropagation);
        expect(def.mock.calls[0][1]).toBe(target);
    });

    it("5) falls back to generic (no-tool) listeners last", () => {
        const node = div({id: "obj5"});

        const generic = vi.fn().mockReturnValue(Propagation.stopPropagation);
        gradum(node).on("pointerdown", generic);

        const consumed = gradum(node).executeAction("pointerdown", "nonexistent", new Event("x"));
        expect(consumed).toBe(Propagation.stopPropagation);
        expect(generic).toHaveBeenCalledTimes(1);
    });

    it("propagate flag makes group NOT consumed", () => {
        const node = div({id: "p"});
        const A = vi.fn().mockReturnValue(Propagation.propagate);
        const B = vi.fn().mockReturnValue(Propagation.propagate);

        gradum(node).onTool("pointerdown", "brush", A);
        gradum(node).onTool("pointerdown", "brush", B);

        const consumed = gradum(node).executeAction("pointerdown", "brush", new Event("x"));
        expect(consumed).toBe(Propagation.propagate);
        expect(A).toHaveBeenCalledTimes(1);
        expect(B).toHaveBeenCalledTimes(1);
    });

    it("once removes listener after first run", () => {
        const node = div({id: "o"});
        const L = vi.fn().mockReturnValue(Propagation.stopPropagation);

        gradum(node).onTool("click", "brush", L, {once: true});

        gradum(node).executeAction("click", "brush", new Event("x"));
        gradum(node).executeAction("click", "brush", new Event("x"));

        expect(L).toHaveBeenCalledTimes(1);
    });

    it("ignored tool on element: skips custom listeners and default behaviors", () => {
        const node = div({ id: "ign-el" });
        const custom = vi.fn().mockReturnValue(Propagation.stopPropagation);
        const def = vi.fn().mockReturnValue(Propagation.stopPropagation);

        gradum(node).onTool("click", "brush", custom);
        gradum(node).addToolBehavior("click", (ev, target) => def(ev, target), "brush");
        gradum(node).ignoreTool("brush");

        const consumed = gradum(node).executeAction("click", "brush", new Event("x"));

        // `ignoreTool` covers both halves of the tool system: the behaviors registered for the tool and
        // the listeners bound with `onTool`. Nothing runs, so nothing consumes the event.
        expect(custom).not.toHaveBeenCalled();
        expect(def).not.toHaveBeenCalled();
        expect(consumed).toBe(Propagation.propagate);
    });

    it("ignored specific (tool,type): skips only that event type, others still work", () => {
        const node = div({ id: "ign-type" });

        const customClick = vi.fn();
        const customDown  = vi.fn();
        const defClick    = vi.fn();

        gradum(node).onTool("click", "brush", customClick);
        gradum(node).onTool("pointerdown", "brush", customDown);
        gradum(node).addToolBehavior("click", (ev, target) => defClick(ev, target), "brush");

        gradum(node).ignoreTool("brush", "click");

        // "click" is ignored for this tool, so neither its listener nor its behavior runs.
        const consumedClick = gradum(node).executeAction("click", "brush", new Event("x"));
        expect(customClick).not.toHaveBeenCalled();
        expect(defClick).not.toHaveBeenCalled();
        expect(consumedClick).toBe(Propagation.propagate);

        // "pointerdown" was not ignored, so it is unaffected.
        const consumedDown = gradum(node).executeAction("pointerdown", "brush", new Event("y"));
        expect(consumedDown).toBe(Propagation.stopPropagation);
        expect(customDown).toHaveBeenCalledTimes(1);
    });
});