import {describe, it, expect, beforeEach} from "vitest";
import {GradumEventManager} from "../gradumEventManager";
import {gradum} from "../../../gradumFunctions/gradumFunctions";
import {Propagation} from "../../../gradumFunctions/event/event.types";
import {div} from "../../../elementCreation/basicElements";

//The capture loop's `break` left only that loop. The bubble pass that followed was not guarded by its
//result, so every listener and tool behavior still ran — and `e.stopPropagation()` did not help either,
//since both passes are manual walks over `composedPath()` rather than DOM propagation. A capture-phase
//listener could observe an event but not refuse it, which is the one thing capture is normally for.
describe("a capture-phase listener can refuse an event", () => {
    let manager: GradumEventManager;
    let outer: HTMLElement, inner: HTMLElement;

    const dispatch = (type: string = "click") => {
        const e = new Event(type, {bubbles: true, composed: true, cancelable: true});
        Object.defineProperty(e, "composedPath", {value: () => [inner, outer, document.body, document], configurable: true});
        (manager as any).dispatchOperator.getToolHandlingCallback(type, e);
        return e;
    };

    beforeEach(() => {
        manager = GradumEventManager.create({enabled: true});
        outer = div({parent: document.body});
        inner = div({parent: outer});
    });

    it("stops the bubble pass when capture refuses", () => {
        const seen: string[] = [];
        gradum(outer).on("click", () => {seen.push("capture"); return Propagation.stopImmediatePropagation;},
            {capture: true}, manager);
        gradum(inner).on("click", () => {seen.push("bubble inner");}, undefined, manager);
        gradum(outer).on("click", () => {seen.push("bubble outer");}, undefined, manager);

        dispatch();

        expect(seen).toEqual(["capture"]);
    });

    it("lets the bubble pass run when capture allows it", () => {
        const seen: string[] = [];
        gradum(outer).on("click", () => {seen.push("capture"); return Propagation.propagate;},
            {capture: true}, manager);
        gradum(inner).on("click", () => {seen.push("bubble inner");}, undefined, manager);

        dispatch();

        expect(seen[0]).toBe("capture");
        expect(seen).toContain("bubble inner");
        //*Not an exact sequence: a listener registered for capture also runs in the bubble pass, which
        //matches on no options and so matches everything. That is a separate defect from this one.*
    });

    it("lets the bubble pass run when nothing captures at all", () => {
        const seen: string[] = [];
        gradum(inner).on("click", () => {seen.push("bubble inner");}, undefined, manager);

        dispatch();

        expect(seen).toEqual(["bubble inner"]);
    });
});

//A listener that returned nothing was read as `stopPropagation`, while a tool behavior that returned
//nothing was read as `propagate`. The two disagreed, and silence is not a refusal in either DOM listeners
//or tool behaviors.
describe("a handler that returns nothing carries on", () => {
    it("reads a listener's silence as propagate", () => {
        const node = div({parent: document.body});
        gradum(node).on("click", () => {});

        expect(gradum(node).executeAction("click", undefined, new Event("click"))).toBe(Propagation.propagate);
    });

    it("still obeys a listener that says to stop", () => {
        const node = div({parent: document.body});
        gradum(node).on("click", () => Propagation.stopPropagation);

        expect(gradum(node).executeAction("click", undefined, new Event("click")))
            .toBe(Propagation.stopPropagation);
    });

    it("reads a value that is not a propagation at all as propagate", () => {
        const node = div({parent: document.body});
        gradum(node).on("click", () => true as any);

        expect(gradum(node).executeAction("click", undefined, new Event("click"))).toBe(Propagation.propagate);
    });
});
