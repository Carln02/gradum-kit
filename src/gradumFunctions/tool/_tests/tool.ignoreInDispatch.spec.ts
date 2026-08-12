import {describe, it, expect, vi} from "vitest";
import {$, gradum} from "../../gradumFunctions";
import {div, span} from "../../../elementCreation/basicElements";
import {GradumEventManager} from "../../../eventHandling/gradumEventManager/gradumEventManager";

/**
 * `ignoreTool` used to be consulted only by `applyTool`, so it suppressed tool behaviors but not
 * listeners registered with `onTool`. These pin both halves, plus the origin-scoped rule that lets a
 * toolbar button opt its whole subtree out of the tool it activates.
 */
describe("ignoreTool during dispatch", () => {
    const evt = (target: Node) => {
        const e = new Event("click");
        Object.defineProperty(e, "target", {value: target, configurable: true});
        return e;
    };

    it("still runs an onTool listener when nothing is ignored", () => {
        const host = div({id: "ig-0"});
        document.body.appendChild(host);
        const fn = vi.fn();
        gradum(host).onTool("click", "brush", fn);

        $(host).executeAction("click", "brush", evt(host));
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it("skips an onTool listener when the listener's own element ignores the tool", () => {
        const host = div({id: "ig-1"});
        document.body.appendChild(host);
        const fn = vi.fn();
        gradum(host).onTool("click", "brush", fn);
        gradum(host).ignoreTool("brush");

        $(host).executeAction("click", "brush", evt(host));
        expect(fn).not.toHaveBeenCalled();
    });

    // The demo0 case: the listener lives on an ancestor, and the click originates on the tool button.
    it("skips an ancestor's onTool listener when the event originates on an ignoring element", () => {
        const canvas = div({id: "ig-2"});
        const button = div({id: "ig-2-btn", parent: canvas});
        document.body.appendChild(canvas);

        const fn = vi.fn();
        gradum(canvas).onTool("click", "brush", fn);
        gradum(button).ignoreTool("brush");

        $(canvas).executeAction("click", "brush", evt(button));
        expect(fn).not.toHaveBeenCalled();

        // a click that did not start on the button still reaches the listener
        $(canvas).executeAction("click", "brush", evt(canvas));
        expect(fn).toHaveBeenCalledTimes(1);
    });

    // GradumButton renders its label in a child, so the real click target is never the button itself.
    it("walks up from the true event target, so inner nodes are covered", () => {
        const canvas = div({id: "ig-3"});
        const button = div({id: "ig-3-btn", parent: canvas});
        const label = span({text: "+ Add", parent: button});
        document.body.appendChild(canvas);

        const fn = vi.fn();
        gradum(canvas).onTool("click", "brush", fn);
        gradum(button).ignoreTool("brush");

        $(canvas).executeAction("click", "brush", evt(label));
        expect(fn).not.toHaveBeenCalled();
    });

    it("only ignores the named tool, leaving others alone", () => {
        const canvas = div({id: "ig-4"});
        const button = div({id: "ig-4-btn", parent: canvas});
        document.body.appendChild(canvas);

        const brush = vi.fn(), eraser = vi.fn();
        gradum(canvas).onTool("click", "brush", brush);
        gradum(canvas).onTool("click", "eraser", eraser);
        gradum(button).ignoreTool("brush");

        $(canvas).executeAction("click", "brush", evt(button));
        $(canvas).executeAction("click", "eraser", evt(button));

        expect(brush).not.toHaveBeenCalled();
        expect(eraser).toHaveBeenCalledTimes(1);
    });

    it("un-ignoring restores the listener", () => {
        const canvas = div({id: "ig-5"});
        const button = div({id: "ig-5-btn", parent: canvas});
        document.body.appendChild(canvas);

        const fn = vi.fn();
        gradum(canvas).onTool("click", "brush", fn);
        gradum(button).ignoreTool("brush");
        gradum(button).ignoreTool("brush", undefined, false);

        $(canvas).executeAction("click", "brush", evt(button));
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it("leaves plain (non-tool) listeners untouched", () => {
        const canvas = div({id: "ig-6"});
        const button = div({id: "ig-6-btn", parent: canvas});
        document.body.appendChild(canvas);

        const plain = vi.fn();
        gradum(canvas).on("click", plain);
        gradum(button).ignoreTool("brush");

        $(canvas).executeAction("click", "brush", evt(button));
        expect(plain).toHaveBeenCalledTimes(1);
    });
});
