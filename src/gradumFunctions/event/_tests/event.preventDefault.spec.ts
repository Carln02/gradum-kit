import { describe, it, expect, vi } from "vitest";
import {div} from "../../../elementCreation/basicElements";
import {gradum} from "../../gradumFunctions";
import {Propagation} from "../event.types";

describe("preventDefault + removeAllListeners", () => {
    it("preventDefault adds handlers that call preventDefault", () => {
        const node = div({id: "pd"});

        gradum(node).preventDefault({types: ["click"]});

        const ev = new Event("click", {bubbles: true, cancelable: true});
        const consumed = gradum(node).executeAction("click", undefined, ev);

        expect(consumed).toBe(Propagation.stopPropagation);
        expect(ev.defaultPrevented).toBe(true);
    });

    it("removeAllListeners clears both bound and preventDefault handlers", () => {
        const node = div({id: "rm"});

        const generic = vi.fn().mockReturnValue(Propagation.stopImmediatePropagation);
        gradum(node).on("click", generic);
        gradum(node).preventDefault({types: ["click"]});

        let ev = new Event("click", { bubbles: true, cancelable: true });
        let consumed = gradum(node).executeAction("click", undefined, ev);
        expect(consumed).toBe(Propagation.stopImmediatePropagation);
        expect(generic).toHaveBeenCalledTimes(1);

        gradum(node).removeAllListeners();

        ev = new Event("click", { bubbles: true, cancelable: true });
        consumed = gradum(node).executeAction("click", undefined, ev);
        expect(consumed).toBe(Propagation.propagate);
    });
});
